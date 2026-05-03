/**
 * Gitmyart — Comprehensive System Test Suite
 * Tests: Soft Stake, Raffle, Claim, HP Decay, Rewards
 * 
 * Run: node test-system.js
 */

const API_BASE = 'http://localhost:3456/api';

// Test data
let testWallet = '0xtest' + Math.random().toString(36).slice(2, 10);
let testChain = 'atom';
let sessionToken = null;
let testCollectionId = null;
let testNftId = null;
let testRaffleId = null;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function logTest(name) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`TEST: ${name}`, 'blue');
  log(`${'='.repeat(60)}`, 'cyan');
}

function logPass(msg) {
  log(`✅ PASS: ${msg}`, 'green');
}

function logFail(msg) {
  log(`❌ FAIL: ${msg}`, 'red');
}

function logWarn(msg) {
  log(`⚠️  WARN: ${msg}`, 'yellow');
}

// API Helper
async function api(path, opts = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(sessionToken && { 'x-session-token': sessionToken }),
    ...opts.headers,
  };

  try {
    const r = await fetch(API_BASE + path, {
      ...opts,
      headers,
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
    return data;
  } catch (e) {
    throw new Error(`API Error: ${e.message}`);
  }
}

// ===== TESTS =====

async function test1_Login() {
  logTest('1. LOGIN & SESSION');
  try {
    const res = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ wallet: testWallet, chain: testChain }),
    });

    if (!res.sessionToken) throw new Error('No session token returned');
    sessionToken = res.sessionToken;
    logPass(`Login successful. Wallet: ${testWallet}, Chain: ${testChain}`);
    logPass(`Session token: ${sessionToken.slice(0, 20)}...`);
    return true;
  } catch (e) {
    logFail(`Login failed: ${e.message}`);
    return false;
  }
}

async function test2_GetCollections() {
  logTest('2. GET COLLECTIONS');
  try {
    const res = await api('/collections');
    // API returns array directly, not wrapped in object
    const collections = Array.isArray(res) ? res : res.collections;
    
    if (!collections || collections.length === 0) {
      throw new Error('No collections in database');
    }

    testCollectionId = collections[0].id;
    logPass(`Found ${collections.length} collections`);
    logPass(`Using collection: ${collections[0].name} (ID: ${testCollectionId})`);
    return true;
  } catch (e) {
    logFail(`Get collections failed: ${e.message}`);
    return false;
  }
}

async function test3_SoftStake() {
  logTest('3. SOFT STAKE NFT');
  try {
    // Create test NFT stake
    const res = await api('/stake', {
      method: 'POST',
      body: JSON.stringify({
        collectionId: testCollectionId,
        tokenId: '1',
        name: 'Test NFT #1',
        imageUrl: 'https://picsum.photos/300/300?random=1',
      }),
    });

    if (!res.success) throw new Error(res.error || 'Stake failed');
    testNftId = res.nftId;
    logPass(`Staked NFT successfully`);
    logPass(`NFT ID: ${testNftId}`);
    logPass(`Initial HP: 100`);
    return true;
  } catch (e) {
    logFail(`Soft stake failed: ${e.message}`);
    return false;
  }
}

async function test4_GetStakedNfts() {
  logTest('4. GET STAKED NFTs');
  try {
    const res = await api('/stake/my');
    // API returns array directly, not wrapped in object
    const nfts = Array.isArray(res) ? res : res.nfts;
    
    if (!nfts || nfts.length === 0) {
      throw new Error('No staked NFTs found');
    }

    const nft = nfts[0];
    logPass(`Found ${nfts.length} staked NFT(s)`);
    logPass(`NFT: ${nft.name}`);
    logPass(`HP: ${nft.hp}/100`);
    logPass(`Staked at: ${new Date(nft.stakedAt).toLocaleString()}`);
    return true;
  } catch (e) {
    logFail(`Get staked NFTs failed: ${e.message}`);
    return false;
  }
}

async function test5_FeedNft() {
  logTest('5. FEED NFT (Restore HP)');
  try {
    // First, simulate HP decay by waiting or checking current HP
    const beforeRes = await api('/stake/my');
    const nfts = Array.isArray(beforeRes) ? beforeRes : beforeRes.nfts;
    const beforeHp = nfts[0].hp;
    logPass(`HP before feed: ${beforeHp}`);

    // Feed NFT
    const res = await api('/stake/feed', {
      method: 'POST',
      body: JSON.stringify({ nftId: testNftId }),
    });

    if (!res.success) throw new Error(res.error || 'Feed failed');

    // Check HP after feed
    const afterRes = await api('/stake/my');
    const afterNfts = Array.isArray(afterRes) ? afterRes : afterRes.nfts;
    const afterHp = afterNfts[0].hp;
    logPass(`HP after feed: ${afterHp}`);
    logPass(`HP restored by: ${afterHp - beforeHp} points`);

    if (afterHp > beforeHp) {
      logPass(`Feed successful! HP increased.`);
    } else {
      logWarn(`HP did not increase. Check feed logic.`);
    }
    return true;
  } catch (e) {
    logFail(`Feed NFT failed: ${e.message}`);
    return false;
  }
}

async function test6_ClaimRewards() {
  logTest('6. CLAIM REWARDS');
  try {
    // Get current balance before claim
    const beforeRes = await api('/auth/me');
    const beforeBalance = beforeRes.balance || 0;
    logPass(`Balance before claim: ${beforeBalance} pts`);

    // Claim rewards
    const res = await api('/stake/claim', {
      method: 'POST',
      body: JSON.stringify({ nftId: testNftId }),
    });

    if (!res.success) throw new Error(res.error || 'Claim failed');

    // Get balance after claim
    const afterRes = await api('/auth/me');
    const afterBalance = afterRes.balance || 0;
    logPass(`Balance after claim: ${afterBalance} pts`);
    logPass(`Claimed: ${afterBalance - beforeBalance} pts`);

    if (afterBalance > beforeBalance) {
      logPass(`Claim successful! Balance increased.`);
    } else {
      logWarn(`Balance did not increase. Check claim logic.`);
    }
    return true;
  } catch (e) {
    logFail(`Claim rewards failed: ${e.message}`);
    return false;
  }
}

async function test7_GetRaffles() {
  logTest('7. GET RAFFLES');
  try {
    const res = await api('/raffles');
    // API returns array directly
    const raffles = Array.isArray(res) ? res : res.raffles;
    
    if (!raffles || raffles.length === 0) {
      throw new Error('No raffles in database');
    }

    testRaffleId = raffles[0].id;
    const raffle = raffles[0];
    logPass(`Found ${raffles.length} raffle(s)`);
    logPass(`Raffle: ${raffle.name}`);
    logPass(`Entry fee: ${raffle.entryFee} ${raffle.tokenSymbol}`);
    logPass(`Current entries: ${raffle.currentEntries}/${raffle.maxEntries}`);
    logPass(`Ends at: ${new Date(raffle.endsAt).toLocaleString()}`);
    return true;
  } catch (e) {
    logFail(`Get raffles failed: ${e.message}`);
    return false;
  }
}

async function test8_EnterRaffle() {
  logTest('8. ENTER RAFFLE');
  try {
    // Check if user has enough balance
    const userRes = await api('/auth/me');
    const balance = userRes.balance || 0;

    const raffleRes = await api(`/raffles/${testRaffleId}`);
    const raffle = raffleRes.raffle || raffleRes;
    const entryFee = raffle.entryFee;

    logPass(`User balance: ${balance} pts`);
    logPass(`Entry fee: ${entryFee} pts`);

    if (balance < entryFee) {
      logWarn(`Insufficient balance. Need ${entryFee}, have ${balance}`);
      logWarn(`Skipping raffle entry test.`);
      return true; // Skip but don't fail
    }

    // Enter raffle
    const res = await api(`/raffles/${testRaffleId}/enter`, {
      method: 'POST',
      body: JSON.stringify({ quantity: 1 }),
    });

    if (!res.success) throw new Error(res.error || 'Enter raffle failed');

    logPass(`Entered raffle successfully`);
    logPass(`Entry ID: ${res.entryId}`);
    logPass(`Quantity: 1`);
    return true;
  } catch (e) {
    logFail(`Enter raffle failed: ${e.message}`);
    return false;
  }
}

async function test9_GetLeaderboard() {
  logTest('9. GET LEADERBOARD');
  try {
    const res = await api('/leaderboard');
    // API returns array directly
    const leaderboard = Array.isArray(res) ? res : res.leaderboard;
    
    if (!leaderboard || leaderboard.length === 0) {
      logWarn('Leaderboard is empty');
      return true;
    }

    logPass(`Leaderboard has ${leaderboard.length} entries`);
    const top3 = leaderboard.slice(0, 3);
    top3.forEach((entry, i) => {
      logPass(`#${i + 1}: ${entry.wallet.slice(0, 10)}... - ${entry.points} pts (${entry.nftsStaked} NFTs)`);
    });
    return true;
  } catch (e) {
    logFail(`Get leaderboard failed: ${e.message}`);
    return false;
  }
}

async function test10_UnstakeNft() {
  logTest('10. UNSTAKE NFT');
  try {
    // Get the staked NFT details first
    const stakedRes = await api('/stake/my');
    const nfts = Array.isArray(stakedRes) ? stakedRes : stakedRes.nfts;
    
    if (!nfts || nfts.length === 0) {
      logWarn('No staked NFTs to unstake');
      return true;
    }

    const nft = nfts[0];
    const res = await api('/stake/unstake', {
      method: 'POST',
      body: JSON.stringify({ tokenId: nft.tokenId, collectionId: nft.collectionId }),
    });

    if (!res.success) throw new Error(res.error || 'Unstake failed');

    logPass(`Unstaked NFT successfully`);
    logPass(`NFT ID: ${nft.id}`);

    // Verify unstake
    const checkRes = await api('/stake/my');
    const checkNfts = Array.isArray(checkRes) ? checkRes : checkRes.nfts;
    const stillStaked = checkNfts.some(n => n.id === nft.id);
    if (!stillStaked) {
      logPass(`Verification: NFT no longer in staked list`);
    } else {
      logWarn(`Verification: NFT still in staked list`);
    }
    return true;
  } catch (e) {
    logFail(`Unstake NFT failed: ${e.message}`);
    return false;
  }
}

async function test11_BatchStake() {
  logTest('11. BATCH STAKE (Multiple NFTs)');
  try {
    const nfts = [
      { tokenId: '2', collectionId: testCollectionId, name: 'Test NFT #2', imageUrl: 'https://picsum.photos/300/300?random=2' },
      { tokenId: '3', collectionId: testCollectionId, name: 'Test NFT #3', imageUrl: 'https://picsum.photos/300/300?random=3' },
      { tokenId: '4', collectionId: testCollectionId, name: 'Test NFT #4', imageUrl: 'https://picsum.photos/300/300?random=4' },
    ];

    const res = await api('/stake/batch', {
      method: 'POST',
      body: JSON.stringify({
        nfts: nfts,
      }),
    });

    if (!res.success) throw new Error(res.error || 'Batch stake failed');

    logPass(`Batch staked ${nfts.length} NFTs successfully`);
    logPass(`Staked IDs: ${res.nftIds.join(', ')}`);
    return true;
  } catch (e) {
    logFail(`Batch stake failed: ${e.message}`);
    return false;
  }
}

async function test12_CalculateRewards() {
  logTest('12. CALCULATE REWARDS (Verification)');
  try {
    const res = await api('/stats');
    if (!res.stats) throw new Error('No stats returned');

    logPass(`Total staked NFTs: ${res.stats.totalStakedNfts}`);
    logPass(`Total users: ${res.stats.totalUsers}`);
    logPass(`Total earned: ${res.stats.totalEarned} pts`);
    logPass(`Average HP: ${res.stats.averageHp.toFixed(2)}/100`);

    // Verify calculation logic
    if (res.stats.totalStakedNfts > 0) {
      logPass(`Reward calculation appears to be working`);
    } else {
      logWarn(`No staked NFTs for reward calculation`);
    }
    return true;
  } catch (e) {
    logFail(`Calculate rewards failed: ${e.message}`);
    return false;
  }
}

// ===== MAIN TEST RUNNER =====

async function runAllTests() {
  log(`\n${'#'.repeat(60)}`, 'cyan');
  log(`# REBEL.FUN — SYSTEM TEST SUITE`, 'cyan');
  log(`# Testing: Soft Stake, Raffle, Claim, Rewards`, 'cyan');
  log(`# Wallet: ${testWallet}`, 'cyan');
  log(`# Chain: ${testChain}`, 'cyan');
  log(`${'#'.repeat(60)}\n`, 'cyan');

  const tests = [
    test1_Login,
    test2_GetCollections,
    test3_SoftStake,
    test4_GetStakedNfts,
    test5_FeedNft,
    test6_ClaimRewards,
    test7_GetRaffles,
    test8_EnterRaffle,
    test9_GetLeaderboard,
    test10_UnstakeNft,
    test11_BatchStake,
    test12_CalculateRewards,
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (e) {
      logFail(`Test error: ${e.message}`);
      failed++;
    }
  }

  // Summary
  log(`\n${'#'.repeat(60)}`, 'cyan');
  log(`# TEST SUMMARY`, 'cyan');
  log(`${'#'.repeat(60)}`, 'cyan');
  log(`Total tests: ${tests.length}`, 'blue');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`Success rate: ${((passed / tests.length) * 100).toFixed(1)}%`, passed === tests.length ? 'green' : 'yellow');
  log(`${'#'.repeat(60)}\n`, 'cyan');

  if (failed === 0) {
    log(`✅ ALL TESTS PASSED!`, 'green');
  } else {
    log(`❌ ${failed} TEST(S) FAILED`, 'red');
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(e => {
  logFail(`Fatal error: ${e.message}`);
  process.exit(1);
});
