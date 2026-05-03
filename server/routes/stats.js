// Rebel.fun — Stats / Config Routes
const express = require('express');
const router = express.Router();
const { get, all, getConfig } = require('../db');

// GET /api/stats?chain=atom
router.get('/', (req, res) => {
  const chain = req.query.chain || 'atom';

  const totalStaked = get('SELECT COUNT(*) as c FROM staked_nfts WHERE chain = ?', [chain]);
  const totalStakers = get('SELECT COUNT(DISTINCT wallet) as c FROM staked_nfts WHERE chain = ?', [chain]);
  const totalCollections = get('SELECT COUNT(*) as c FROM collections WHERE chain = ? AND active = 1', [chain]);
  const liveRaffles = get(`SELECT COUNT(*) as c FROM raffles WHERE chain = ? AND status = 'live'`, [chain]);
  const totalUsers = get('SELECT COUNT(*) as c FROM users WHERE chain = ?', [chain]);
  const totalEarned = get('SELECT SUM(total_earned) as total FROM users WHERE chain = ?', [chain]);
  const avgHp = get('SELECT AVG(hp) as avg FROM staked_nfts WHERE chain = ?', [chain]);

  res.json({
    stats: {
      chain,
      totalStakedNfts: totalStaked?.c || 0,
      totalStakers: totalStakers?.c || 0,
      totalCollections: totalCollections?.c || 0,
      liveRaffles: liveRaffles?.c || 0,
      totalUsers: totalUsers?.c || 0,
      totalEarned: totalEarned?.total || 0,
      averageHp: avgHp?.avg || 100,
      gameActive: getConfig('game_active', '1') === '1',
    }
  });
});

// GET /api/stats/coins — top coins (static for now, can be replaced with live API)
router.get('/coins', (req, res) => {
  const chain = req.query.chain || 'atom';

  // In production, fetch from CoinGecko/Osmosis API
  // For now, return static data per chain
  const COINS = {
    atom: [
      { symbol:'$ATOM', name:'Cosmos', val:'$1.5M', change:'+9.4%', up:true },
      { symbol:'$OSMO', name:'Osmosis', val:'$890K', change:'+5.2%', up:true },
      { symbol:'$JUNO', name:'Juno', val:'$234K', change:'-2.1%', up:false },
      { symbol:'$STARS', name:'Stargaze', val:'$156K', change:'+18.3%', up:true },
      { symbol:'$INJ', name:'Injective', val:'$3.2M', change:'+12.7%', up:true },
      { symbol:'$TIA', name:'Celestia', val:'$2.8M', change:'+7.1%', up:true },
    ],
    megaeth: [
      { symbol:'$METH', name:'MegaETH', val:'$4.8M', change:'+5.6%', up:true },
      { symbol:'$REBEL', name:'Rebel Token', val:'$2.1M', change:'+22.1%', up:true },
      { symbol:'$TURBO', name:'TurboSwap', val:'$890K', change:'+34.5%', up:true },
      { symbol:'$BLITZ', name:'Blitz Finance', val:'$567K', change:'+8.9%', up:true },
    ],
    ethereum: [
      { symbol:'$ETH', name:'Ethereum', val:'$12.3M', change:'+2.4%', up:true },
      { symbol:'$UNI', name:'Uniswap', val:'$8.9M', change:'+4.1%', up:true },
      { symbol:'$AAVE', name:'Aave', val:'$5.6M', change:'+6.8%', up:true },
      { symbol:'$LINK', name:'Chainlink', val:'$4.2M', change:'-1.3%', up:false },
    ],
  };

  res.json(COINS[chain] || []);
});

module.exports = router;
