// Gitmyart — Stake Routes
const express = require('express');
const router = express.Router();
const { db, get, all, run, audit } = require('../db');
const { walletRateLimit } = require('../middleware');

// GET /api/stake/my — get my staked NFTs
router.get('/my', (req, res) => {
  const chain = req.query.chain || req.chain;
  const nfts = all('SELECT * FROM staked_nfts WHERE wallet = ? AND chain = ? ORDER BY staked_at DESC', [req.wallet, chain]);

  res.json(nfts.map(n => ({
    id: n.id,
    tokenId: n.token_id,
    collectionId: n.collection_id,
    collectionName: n.collection_name,
    name: n.name,
    imageUrl: n.image_url,
    rarity: n.rarity,
    hp: n.hp,
    stakedAt: n.staked_at,
    lastFed: n.last_fed,
    lastEarned: n.last_earned,
  })));
});

// POST /api/stake — stake a single NFT
router.post('/', walletRateLimit('stake', 3000), (req, res) => {
  const { tokenId, collectionId, name, imageUrl, rarity } = req.body;
  if (!tokenId || !collectionId) return res.status(400).json({ error: 'tokenId and collectionId required' });

  // Check if already staked
  const existing = get('SELECT id FROM staked_nfts WHERE wallet = ? AND token_id = ? AND collection_id = ?',
    [req.wallet, tokenId, collectionId]);
  if (existing) return res.status(400).json({ error: 'Already staked' });

  // Check collection exists
  const coll = get('SELECT * FROM collections WHERE id = ?', [collectionId]);
  if (!coll) return res.status(404).json({ error: 'Collection not found' });

  // Stake it (soft stake — no on-chain tx needed)
  let nftId = null;
  const stakeTransaction = db.transaction(() => {
    const insertResult = run(`INSERT INTO staked_nfts (wallet, chain, token_id, collection_id, collection_name, name, image_url, rarity)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.wallet, req.chain, tokenId, collectionId, coll.name, name || `${coll.ticker} #${tokenId}`, imageUrl || '', rarity || 'common']);
    nftId = insertResult.lastInsertRowid;

    // Update collection stats
    const stats = get('SELECT COUNT(DISTINCT id) as staked, COUNT(DISTINCT wallet) as stakers FROM staked_nfts WHERE collection_id = ?', [collectionId]);
    run('UPDATE collections SET total_staked = ?, total_stakers = ? WHERE id = ?',
      [stats.staked, stats.stakers, collectionId]);

    // Update leaderboard
    const myStats = get('SELECT COUNT(*) as c FROM staked_nfts WHERE wallet = ? AND chain = ?', [req.wallet, req.chain]);
    const myLb = get('SELECT points FROM leaderboard WHERE wallet = ? AND chain = ?', [req.wallet, req.chain]);
    const points = (myLb?.points || 0) + 10; // +10 points for staking
    run('INSERT OR REPLACE INTO leaderboard (wallet, chain, nfts_staked, points) VALUES (?, ?, ?, ?)',
      [req.wallet, req.chain, myStats.c, points]);

    audit('stake', req.wallet, req.chain, { tokenId, collectionId });
  });

  try {
    stakeTransaction();
    res.json({ success: true, message: `Staked ${name || tokenId}`, nftId });
  } catch (e) {
    console.error('[STAKE ERROR]', e.message, e.stack);
    res.status(500).json({ error: 'Stake failed' });
  }
});

// POST /api/stake/batch — stake multiple NFTs at once
router.post('/batch', walletRateLimit('stake-batch', 5000), (req, res) => {
  const { nfts } = req.body; // [{tokenId, collectionId, name, imageUrl, rarity}]
  if (!Array.isArray(nfts) || nfts.length === 0) return res.status(400).json({ error: 'nfts array required' });
  if (nfts.length > 20) return res.status(400).json({ error: 'Max 20 NFTs per batch' });

  const results = [];
  const nftIds = [];
  const batchTransaction = db.transaction(() => {
    for (const nft of nfts) {
      try {
        const existing = get('SELECT id FROM staked_nfts WHERE wallet = ? AND token_id = ? AND collection_id = ?',
          [req.wallet, nft.tokenId, nft.collectionId]);
        if (existing) { results.push({ tokenId: nft.tokenId, success: false, error: 'Already staked' }); continue; }

        const coll = get('SELECT * FROM collections WHERE id = ?', [nft.collectionId]);
        if (!coll) { results.push({ tokenId: nft.tokenId, success: false, error: 'Collection not found' }); continue; }

        const insertResult = run(`INSERT INTO staked_nfts (wallet, chain, token_id, collection_id, collection_name, name, image_url, rarity)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [req.wallet, req.chain, nft.tokenId, nft.collectionId, coll.name, nft.name || `${coll.ticker} #${nft.tokenId}`, nft.imageUrl || '', nft.rarity || 'common']);

        results.push({ tokenId: nft.tokenId, success: true, nftId: insertResult.lastInsertRowid });
        nftIds.push(insertResult.lastInsertRowid);
        audit('stake', req.wallet, req.chain, { tokenId: nft.tokenId, collectionId: nft.collectionId, batch: true });
      } catch (e) {
        results.push({ tokenId: nft.tokenId, success: false, error: e.message });
      }
    }

    // Update collection stats for all affected collections
    const collIds = [...new Set(nfts.map(n => n.collectionId))];
    for (const cid of collIds) {
      const stats = get('SELECT COUNT(DISTINCT id) as staked, COUNT(DISTINCT wallet) as stakers FROM staked_nfts WHERE collection_id = ?', [cid]);
      run('UPDATE collections SET total_staked = ?, total_stakers = ? WHERE id = ?', [stats.staked, stats.stakers, cid]);
    }

    // Update leaderboard
    const myStats = get('SELECT COUNT(*) as c FROM staked_nfts WHERE wallet = ? AND chain = ?', [req.wallet, req.chain]);
    const successCount = results.filter(r => r.success).length;
    const myLb = get('SELECT points FROM leaderboard WHERE wallet = ? AND chain = ?', [req.wallet, req.chain]);
    const points = (myLb?.points || 0) + (successCount * 10);
    run('INSERT OR REPLACE INTO leaderboard (wallet, chain, nfts_staked, points) VALUES (?, ?, ?, ?)',
      [req.wallet, req.chain, myStats.c, points]);
  });

  try {
    batchTransaction();
    res.json({ success: true, results, nftIds });
  } catch (e) {
    console.error('[BATCH STAKE ERROR]', e.message);
    res.status(500).json({ error: 'Batch stake failed' });
  }
});

// POST /api/stake/unstake
router.post('/unstake', walletRateLimit('unstake', 3000), (req, res) => {
  const { tokenId, collectionId } = req.body;
  if (!tokenId || !collectionId) return res.status(400).json({ error: 'tokenId and collectionId required' });

  const nft = get('SELECT * FROM staked_nfts WHERE wallet = ? AND token_id = ? AND collection_id = ?',
    [req.wallet, tokenId, collectionId]);
  if (!nft) return res.status(404).json({ error: 'NFT not staked' });

  const unstakeTransaction = db.transaction(() => {
    run('DELETE FROM staked_nfts WHERE id = ?', [nft.id]);

    // Update collection stats
    const stats = get('SELECT COUNT(DISTINCT id) as staked, COUNT(DISTINCT wallet) as stakers FROM staked_nfts WHERE collection_id = ?', [collectionId]);
    run('UPDATE collections SET total_staked = ?, total_stakers = ? WHERE id = ?',
      [stats?.staked || 0, stats?.stakers || 0, collectionId]);

    // Update leaderboard
    const myStats = get('SELECT COUNT(*) as c FROM staked_nfts WHERE wallet = ? AND chain = ?', [req.wallet, req.chain]);
    run('INSERT OR REPLACE INTO leaderboard (wallet, chain, nfts_staked, points) VALUES (?, ?, ?, COALESCE((SELECT points FROM leaderboard WHERE wallet = ? AND chain = ?), 0))',
      [req.wallet, req.chain, myStats.c, req.wallet, req.chain]);

    audit('unstake', req.wallet, req.chain, { tokenId, collectionId });
  });

  try {
    unstakeTransaction();
    res.json({ success: true, message: `Unstaked ${nft.name || tokenId}` });
  } catch (e) {
    console.error('[UNSTAKE ERROR]', e.message);
    res.status(500).json({ error: 'Unstake failed' });
  }
});

// POST /api/stake/feed — feed an NFT to restore HP
router.post('/feed', walletRateLimit('feed', 5000), (req, res) => {
  const { nftId } = req.body;
  if (!nftId) return res.status(400).json({ error: 'nftId required' });

  const nft = get('SELECT * FROM staked_nfts WHERE id = ? AND wallet = ?', [nftId, req.wallet]);
  if (!nft) return res.status(404).json({ error: 'NFT not found or not yours' });
  if (nft.hp >= 100) return res.status(400).json({ error: 'HP already full' });

  const newHp = Math.min(100, nft.hp + 25);
  run("UPDATE staked_nfts SET hp = ?, last_fed = datetime('now') WHERE id = ?", [newHp, nft.id]);
  audit('feed', req.wallet, req.chain, { nftId, oldHp: nft.hp, newHp });

  res.json({ success: true, hp: newHp });
});

// POST /api/stake/claim — claim earned rewards
router.post('/claim', walletRateLimit('claim', 10000), (req, res) => {
  const user = get('SELECT * FROM users WHERE wallet = ?', [req.wallet]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.balance <= 0) return res.status(400).json({ error: 'No rewards to claim' });

  const amount = user.balance;
  run('UPDATE users SET balance = 0, total_earned = total_earned + ? WHERE wallet = ?', [amount, req.wallet]);
  audit('claim', req.wallet, req.chain, { amount });

  res.json({ success: true, claimed: amount });
});

module.exports = router;
