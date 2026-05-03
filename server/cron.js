// Rebel.fun — Cron Jobs
const cron = require('node-cron');
const { all, run, get, getConfig, audit } = require('./db');

// ===== OWNERSHIP VERIFICATION — every 30 minutes =====
// Check if staked NFTs are still owned by the staker on MegaETH
let ownershipRunning = false;
cron.schedule('*/30 * * * *', async () => {
  if (ownershipRunning) return;
  ownershipRunning = true;
  try {
    const { getOwnerOf } = require('./routes/auth');
    // Only check MegaETH staked NFTs (EVM wallets start with 0x)
    const stakedNfts = all(`
      SELECT s.id, s.wallet, s.token_id, s.collection_id, c.contract_addr
      FROM staked_nfts s
      LEFT JOIN collections c ON c.id = s.collection_id
      WHERE s.wallet LIKE '0x%' AND c.contract_addr IS NOT NULL
      LIMIT 100
    `);

    let unstaked = 0;
    for (const nft of stakedNfts) {
      try {
        const currentOwner = await getOwnerOf(nft.contract_addr, nft.token_id);
        if (!currentOwner || currentOwner.toLowerCase() !== nft.wallet.toLowerCase()) {
          // NFT moved — auto unstake
          run('DELETE FROM staked_nfts WHERE id = ?', [nft.id]);
          audit('auto_unstake', nft.wallet, 'megaeth', {
            tokenId: nft.token_id,
            collection: nft.collection_id,
            reason: 'ownership_changed',
            newOwner: currentOwner,
          });
          unstaked++;
        }
      } catch (e) { /* skip individual errors */ }
    }

    if (unstaked > 0) console.log(`[CRON] Ownership check: ${unstaked} NFTs auto-unstaked (ownership changed)`);
  } catch (e) {
    console.error('[CRON] Ownership check error:', e.message);
  }
  ownershipRunning = false;
});


let hpDecayRunning = false;
cron.schedule('*/30 * * * *', () => {
  if (hpDecayRunning) return;
  hpDecayRunning = true;
  try {
    const rate = parseFloat(getConfig('hp_decay_rate', '2'));
    const nfts = all('SELECT id, hp, wallet FROM staked_nfts WHERE hp > 0');
    let decayed = 0;
    for (const nft of nfts) {
      try {
        const newHp = Math.max(0, nft.hp - rate);
        run('UPDATE staked_nfts SET hp = ? WHERE id = ?', [newHp, nft.id]);
        decayed++;
      } catch (e) { /* skip */ }
    }
    if (decayed > 0) console.log(`[CRON] HP decay: ${decayed} NFTs, -${rate} HP each`);
  } catch (e) {
    console.error('[CRON] HP decay error:', e.message);
  }
  hpDecayRunning = false;
});

// ===== EARN REWARDS — every hour =====
let earnRunning = false;
cron.schedule('0 * * * *', () => {
  if (earnRunning) return;
  earnRunning = true;
  try {
    const baseReward = parseFloat(getConfig('base_reward', '5'));
    const nfts = all('SELECT s.*, c.reward_per_day FROM staked_nfts s LEFT JOIN collections c ON c.id = s.collection_id WHERE s.hp > 0');
    let totalEarned = 0;

    for (const nft of nfts) {
      try {
        // Reward scales with HP: full HP = full reward, 0 HP = no reward
        const hpMultiplier = nft.hp / 100;
        const hourlyReward = ((nft.reward_per_day || baseReward) / 24) * hpMultiplier;

        if (hourlyReward > 0) {
          run('UPDATE users SET balance = balance + ? WHERE wallet = ?', [hourlyReward, nft.wallet]);
          run("UPDATE staked_nfts SET last_earned = datetime('now') WHERE id = ?", [nft.id]);
          totalEarned += hourlyReward;
        }
      } catch (e) { /* skip */ }
    }

    if (totalEarned > 0) console.log(`[CRON] Earn: ${nfts.length} NFTs, total ${totalEarned.toFixed(2)} points distributed`);
  } catch (e) {
    console.error('[CRON] Earn error:', e.message);
  }
  earnRunning = false;
});

// ===== LEADERBOARD REFRESH — every 15 minutes =====
cron.schedule('*/15 * * * *', () => {
  try {
    const wallets = all(`
      SELECT wallet, chain, COUNT(*) as nfts, 
             COALESCE((SELECT points FROM leaderboard WHERE leaderboard.wallet = staked_nfts.wallet AND leaderboard.chain = staked_nfts.chain), 0) as points
      FROM staked_nfts GROUP BY wallet, chain
    `);
    for (const w of wallets) {
      run("INSERT OR REPLACE INTO leaderboard (wallet, chain, nfts_staked, points, updated_at) VALUES (?, ?, ?, ?, datetime('now'))",
        [w.wallet, w.chain, w.nfts, w.points]);
    }
    if (wallets.length > 0) console.log(`[CRON] Leaderboard refreshed: ${wallets.length} entries`);
  } catch (e) {
    console.error('[CRON] Leaderboard error:', e.message);
  }
});

// ===== RAFFLE EXPIRY CHECK — every 5 minutes =====
cron.schedule('*/5 * * * *', () => {
  try {
    const expired = all(`SELECT * FROM raffles WHERE status = 'live' AND ends_at < datetime('now')`);
    for (const raffle of expired) {
      // Pick random winner from entries
      const entries = all('SELECT wallet FROM raffle_entries WHERE raffle_id = ?', [raffle.id]);
      if (entries.length > 0) {
        const winner = entries[Math.floor(Math.random() * entries.length)];
        run('UPDATE raffles SET status = "ended", winner_wallet = ? WHERE id = ?', [winner.wallet, raffle.id]);
        audit('raffle_ended', winner.wallet, raffle.chain, { raffleId: raffle.id, raffleName: raffle.name });
        console.log(`[CRON] Raffle "${raffle.name}" ended. Winner: ${winner.wallet}`);
      } else {
        run('UPDATE raffles SET status = "ended" WHERE id = ?', [raffle.id]);
        console.log(`[CRON] Raffle "${raffle.name}" ended with no entries.`);
      }
    }
  } catch (e) {
    console.error('[CRON] Raffle expiry error:', e.message);
  }
});

console.log('[CRON] All cron jobs scheduled');
