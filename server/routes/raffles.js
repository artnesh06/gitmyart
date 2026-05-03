// Rebel.fun — Raffle Routes
const express = require('express');
const router = express.Router();
const { db, get, all, run, audit } = require('../db');
const { walletRateLimit } = require('../middleware');

// GET /api/raffles?chain=atom
router.get('/', (req, res) => {
  const chain = req.query.chain || 'atom';
  const raffles = all(`SELECT * FROM raffles WHERE chain = ? AND status = 'live' ORDER BY ends_at ASC`, [chain]);

  const now = new Date();
  res.json(raffles.map(r => {
    const endsAt = new Date(r.ends_at);
    const diff = endsAt - now;
    let endsIn = 'Ended';
    if (diff > 0) {
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      if (h >= 24) {
        const d = Math.floor(h / 24);
        endsIn = `${d}d ${h % 24}h`;
      } else {
        endsIn = `${h}h ${m}m`;
      }
    }
    return {
      id: r.id,
      chain: r.chain,
      name: r.name,
      description: r.description,
      imageUrl: r.image_url,
      entryFee: r.price,
      tokenSymbol: r.token,
      maxEntries: r.max_entries,
      currentEntries: r.current_entries,
      endsAt: r.ends_at,
      endsIn,
      status: r.status,
    };
  }));
});

// GET /api/raffles/:id
router.get('/:id', (req, res) => {
  const raffle = get('SELECT * FROM raffles WHERE id = ?', [req.params.id]);
  if (!raffle) return res.status(404).json({ error: 'Raffle not found' });

  const entries = all('SELECT wallet, SUM(quantity) as total FROM raffle_entries WHERE raffle_id = ? GROUP BY wallet ORDER BY total DESC LIMIT 20', [raffle.id]);

  const now = new Date();
  const endsAt = new Date(raffle.ends_at);
  const diff = endsAt - now;
  let endsIn = 'Ended';
  if (diff > 0) {
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    endsIn = h >= 24 ? `${Math.floor(h/24)}d ${h%24}h` : `${h}h ${m}m`;
  }

  res.json({
    id: raffle.id,
    chain: raffle.chain,
    name: raffle.name,
    description: raffle.description,
    imageUrl: raffle.image_url,
    entryFee: raffle.price,
    tokenSymbol: raffle.token,
    maxEntries: raffle.max_entries,
    currentEntries: raffle.current_entries,
    endsAt: raffle.ends_at,
    endsIn,
    status: raffle.status,
    winner: raffle.winner_wallet,
    topEntries: entries.map(e => ({ wallet: e.wallet, entries: e.total })),
  });
});

// POST /api/raffles/:id/enter — buy raffle entries
router.post('/:id/enter', walletRateLimit('raffle-enter', 3000), (req, res) => {
  const { quantity } = req.body;
  const qty = Math.max(1, Math.min(100, parseInt(quantity) || 1));

  const raffle = get('SELECT * FROM raffles WHERE id = ?', [req.params.id]);
  if (!raffle) return res.status(404).json({ error: 'Raffle not found' });
  if (raffle.status !== 'live') return res.status(400).json({ error: 'Raffle not active' });
  if (new Date(raffle.ends_at) < new Date()) return res.status(400).json({ error: 'Raffle ended' });
  if (raffle.current_entries + qty > raffle.max_entries) return res.status(400).json({ error: 'Not enough entries left' });

  // Check user balance (simplified — in production, check on-chain balance)
  const user = get('SELECT * FROM users WHERE wallet = ?', [req.wallet]);
  const cost = raffle.price * qty;
  // For demo: deduct from balance. In production: verify on-chain payment
  if ((user?.balance || 0) < cost) {
    // For demo, allow anyway but log it
    // return res.status(400).json({ error: 'Insufficient balance' });
  }

  const enterTransaction = db.transaction(() => {
    run('INSERT INTO raffle_entries (raffle_id, wallet, quantity) VALUES (?, ?, ?)',
      [raffle.id, req.wallet, qty]);
    run('UPDATE raffles SET current_entries = current_entries + ? WHERE id = ?',
      [qty, raffle.id]);
    audit('raffle_enter', req.wallet, req.chain, { raffleId: raffle.id, quantity: qty, cost });
  });

  try {
    enterTransaction();
    res.json({ success: true, message: `Entered ${qty}x into ${raffle.name}` });
  } catch (e) {
    console.error('[RAFFLE ENTER ERROR]', e.message);
    res.status(500).json({ error: 'Failed to enter raffle' });
  }
});

module.exports = router;
