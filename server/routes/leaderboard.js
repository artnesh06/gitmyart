// Rebel.fun — Leaderboard Routes
const express = require('express');
const router = express.Router();
const { all } = require('../db');

// GET /api/leaderboard?chain=atom (or chain=all)
router.get('/', (req, res) => {
  const chain = req.query.chain || 'all';
  const limit = Math.min(100, parseInt(req.query.limit) || 50);

  let data;
  if (chain === 'all') {
    data = all(`
      SELECT l.wallet, l.chain, l.nfts_staked, l.points, u.display_name, u.avatar
      FROM leaderboard l
      LEFT JOIN users u ON u.wallet = l.wallet
      ORDER BY l.points DESC
      LIMIT ?
    `, [limit]);
  } else {
    data = all(`
      SELECT l.wallet, l.chain, l.nfts_staked, l.points, u.display_name, u.avatar
      FROM leaderboard l
      LEFT JOIN users u ON u.wallet = l.wallet
      WHERE l.chain = ?
      ORDER BY l.points DESC
      LIMIT ?
    `, [chain, limit]);
  }

  res.json(data.map(l => ({
    wallet: l.wallet,
    chain: l.chain,
    nftsStaked: l.nfts_staked,
    points: l.points,
    displayName: l.display_name,
    avatar: l.avatar,
  })));
});

module.exports = router;
