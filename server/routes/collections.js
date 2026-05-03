// Rebel.fun — Collection Routes
const express = require('express');
const router = express.Router();
const { get, all } = require('../db');

// GET /api/collections?chain=atom
router.get('/', (req, res) => {
  const chain = req.query.chain || 'atom';
  const collections = all('SELECT * FROM collections WHERE chain = ? AND active = 1 ORDER BY total_staked DESC', [chain]);

  res.json(collections.map(c => ({
    id: c.id,
    chain: c.chain,
    name: c.name,
    ticker: c.ticker,
    contractAddr: c.contract_addr,
    imageUrl: c.image_url,
    creator: c.creator,
    floorPrice: c.floor_price,
    totalStaked: c.total_staked,
    totalStakers: c.total_stakers,
    rewardPerDay: c.reward_per_day,
    badge: c.badge,
  })));
});

// GET /api/collections/:id
router.get('/:id', (req, res) => {
  const coll = get('SELECT * FROM collections WHERE id = ?', [req.params.id]);
  if (!coll) return res.status(404).json({ error: 'Collection not found' });

  const stakedNfts = all('SELECT * FROM staked_nfts WHERE collection_id = ? ORDER BY staked_at DESC LIMIT 50', [coll.id]);
  const stakers = all(`
    SELECT wallet, COUNT(*) as nfts, SUM(hp) as total_hp 
    FROM staked_nfts WHERE collection_id = ? 
    GROUP BY wallet ORDER BY nfts DESC LIMIT 20
  `, [coll.id]);

  res.json({
    collection: {
      id: coll.id,
      chain: coll.chain,
      name: coll.name,
      ticker: coll.ticker,
      contractAddr: coll.contract_addr,
      imageUrl: coll.image_url,
      creator: coll.creator,
      floorPrice: coll.floor_price,
      totalStaked: coll.total_staked,
      totalStakers: coll.total_stakers,
      rewardPerDay: coll.reward_per_day,
      badge: coll.badge,
    },
    stakedNfts: stakedNfts.map(n => ({
      id: n.id,
      tokenId: n.token_id,
      name: n.name,
      imageUrl: n.image_url,
      rarity: n.rarity,
      hp: n.hp,
      stakedAt: n.staked_at,
      wallet: n.wallet,
    })),
    stakers: stakers.map(s => ({
      wallet: s.wallet,
      nfts: s.nfts,
      totalHp: s.total_hp,
    })),
  });
});

module.exports = router;
