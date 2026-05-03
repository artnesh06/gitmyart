# Project Structure

```
rebel-gallery/
├── index.html              # Single-page app entry point
├── app.js                  # All client-side JavaScript (DOM, API calls, rendering)
├── styles.css              # All CSS styles
├── package.json            # Node project config and scripts
├── data/                   # SQLite database files (gitignored)
│   └── rebel.db
└── server/
    ├── index.js            # Express app setup, middleware, route mounting, server start
    ├── db.js               # SQLite connection, schema creation, query helpers (get/all/run), audit logging
    ├── middleware.js        # Session tokens, rate limiting, input sanitization
    ├── cron.js              # Scheduled jobs: HP decay, reward distribution, leaderboard refresh, raffle expiry
    ├── seed.js              # Demo data seeder for collections, raffles, users, and staked NFTs
    └── routes/
        ├── auth.js          # POST /api/auth/login, GET /api/auth/me, POST /api/auth/update-profile
        ├── collections.js   # GET /api/collections, GET /api/collections/:id
        ├── stake.js         # GET /api/stake/my, POST /api/stake, POST /api/stake/batch, POST /api/stake/unstake, POST /api/stake/feed, POST /api/stake/claim
        ├── raffles.js       # GET /api/raffles, GET /api/raffles/:id, POST /api/raffles/:id/enter
        ├── leaderboard.js   # GET /api/leaderboard
        └── stats.js         # GET /api/stats, GET /api/stats/coins
```

## Architecture

- **Monolith**: Single Express server serves both the API and the static frontend
- **Frontend**: Vanilla JS SPA with manual DOM manipulation — no router, pages toggled via `goPage()` showing/hiding `.page` divs
- **Backend**: RESTful JSON API under `/api/` prefix, route files in `server/routes/`
- **Database**: All queries use synchronous `better-sqlite3` helpers (`get`, `all`, `run`) exported from `db.js`
- **Background jobs**: Cron module auto-loaded on server start; handles HP decay (30min), reward earning (hourly), leaderboard refresh (15min), raffle expiry (5min)

## Conventions

- Route files export an Express Router and are mounted in `server/index.js`
- Public read routes use `readLimit` middleware; write/auth routes use `writeLimit`
- Protected routes use `requireSession` middleware which sets `req.wallet` and `req.chain`
- Per-wallet cooldowns use `walletRateLimit(action, ms)` middleware
- Database column names use `snake_case`; API responses use `camelCase`
- All state-changing operations are logged to the `audit_log` table via `audit()`
- Multi-step writes use `db.transaction()` for atomicity
- The `config` table is a key-value store for runtime settings (HP decay rate, base reward, etc.)
