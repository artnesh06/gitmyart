// Rebel.fun — Backend Server
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const { readLimit, writeLimit, requireSession } = require('./middleware');

const app = express();
const PORT = process.env.PORT || 3456;

// ===== SECURITY =====
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '1mb' }));

// ===== CORS =====
const ALLOWED_ORIGINS = [
  'http://localhost:3456',
  'http://127.0.0.1:3456',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
];
// Add production origins from env
if (process.env.FRONTEND_URL) ALLOWED_ORIGINS.push(process.env.FRONTEND_URL);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(null, false);
  },
  credentials: true,
}));

// ===== STATIC FILES (serve frontend) =====
app.use(express.static(path.join(__dirname, '..')));

// ===== API ROUTES =====
const authRouter = require('./routes/auth');
const collectionsRouter = require('./routes/collections');
const stakeRouter = require('./routes/stake');
const rafflesRouter = require('./routes/raffles');
const leaderboardRouter = require('./routes/leaderboard');
const statsRouter = require('./routes/stats');
const aiRouter = require('./routes/ai');

// Public routes (read)
app.use('/api/collections', readLimit, collectionsRouter);
app.use('/api/raffles', readLimit, rafflesRouter);
app.use('/api/leaderboard', readLimit, leaderboardRouter);
app.use('/api/stats', readLimit, statsRouter);
app.use('/api/ai', writeLimit, aiRouter);

// Auth routes (login is public, /me and /update-profile require session — handled inside router)
app.use('/api/auth', writeLimit, authRouter);

// Protected routes (require session)
app.use('/api/stake', writeLimit, requireSession, stakeRouter);

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', port: PORT, uptime: process.uptime() });
});

// ===== SPA FALLBACK =====
app.get('/{*path}', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ===== CRON JOBS =====
require('./cron');

// ===== START =====
app.listen(PORT, () => {
  console.log(`\n🚀 DropStudio.fun server running on http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api/health`);
  console.log(`🎮 Frontend: http://localhost:${PORT}\n`);
});
