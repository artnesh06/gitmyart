// Rebel.fun — Middleware (session, rate limit, security)
const crypto = require('crypto');

const SESSION_SECRET = process.env.SESSION_SECRET || 'rebel-fun-dev-secret-change-in-prod';

// ===== SESSION TOKEN =====
function createSession(wallet, chain) {
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24h
  const payload = `${wallet}:${chain}:${expires}`;
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return `${payload}:${sig}`;
}

function verifySession(token) {
  if (!token) return null;
  const parts = token.split(':');
  if (parts.length !== 4) return null;
  const [wallet, chain, exp, sig] = parts;
  if (Date.now() > Number(exp)) return null;
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(`${wallet}:${chain}:${exp}`).digest('hex');
  if (sig.length !== expected.length) return null;
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch { return null; }
  return { wallet, chain };
}

function requireSession(req, res, next) {
  const token = req.headers['x-session-token'] || req.query.session;
  const session = verifySession(token);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  req.wallet = session.wallet;
  req.chain = session.chain;
  next();
}

// ===== IP RATE LIMIT =====
const ipBuckets = new Map();
function rateLimit(maxReq, windowMs) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const key = ip;
    let bucket = ipBuckets.get(key);
    if (!bucket || now - bucket.start > windowMs) {
      bucket = { start: now, count: 0 };
      ipBuckets.set(key, bucket);
    }
    bucket.count++;
    if (bucket.count > maxReq) {
      return res.status(429).json({ error: 'Too many requests. Try again later.' });
    }
    next();
  };
}

const readLimit = rateLimit(400, 60 * 1000);  // 400/min reads
const writeLimit = rateLimit(200, 60 * 1000); // 200/min writes

// ===== WALLET RATE LIMIT (per-action cooldown) =====
const cooldowns = new Map();
function walletRateLimit(action, ms = 3000) {
  return (req, res, next) => {
    const wallet = req.body?.wallet || req.wallet || req.query?.wallet;
    if (!wallet) return next();
    const key = `${wallet}:${action}`;
    const last = cooldowns.get(key) || 0;
    if (Date.now() - last < ms) {
      return res.status(429).json({ error: 'Too fast. Wait a moment.' });
    }
    cooldowns.set(key, Date.now());
    next();
  };
}

// ===== SANITIZE =====
function sanitize(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>"'&]/g, c => ({
    '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;'
  }[c]));
}

module.exports = {
  createSession, verifySession, requireSession,
  readLimit, writeLimit, walletRateLimit, sanitize
};
