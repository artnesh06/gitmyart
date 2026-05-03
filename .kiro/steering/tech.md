# Tech Stack

## Runtime & Language

- **Node.js** backend with **Express 5** (v5.2.1)
- **Vanilla JavaScript** frontend — no framework, no bundler, no transpilation
- Single `app.js` file for all client-side logic
- Single `styles.css` file for all styling
- Single `index.html` entry point

## Dependencies

| Package | Purpose |
|---------|---------|
| express | HTTP server and API routing |
| better-sqlite3 | SQLite database (synchronous, embedded) |
| helmet | HTTP security headers |
| cors | Cross-origin resource sharing |
| node-cron | Scheduled background jobs |

## Database

- **SQLite** via `better-sqlite3`, stored at `data/rebel.db`
- WAL mode enabled for concurrent reads
- Foreign keys enforced
- Tables: `users`, `staked_nfts`, `collections`, `raffles`, `raffle_entries`, `leaderboard`, `audit_log`, `config`

## Security

- HMAC-SHA256 session tokens (24h expiry) passed via `x-session-token` header
- Timing-safe signature comparison
- IP-based rate limiting (400/min reads, 200/min writes)
- Per-wallet action cooldowns
- Input sanitization for HTML special characters
- Helmet for HTTP headers

## Common Commands

```bash
# Start the server (port 3456)
npm start

# Start in development (same as start, no watch mode)
npm run dev

# Seed the database with demo data
npm run seed
```

## Notes

- No test framework is configured
- No linter or formatter is configured
- No TypeScript — all plain JavaScript with CommonJS (`require`/`module.exports`)
- The server serves the frontend as static files and includes an SPA fallback route
- Default port is `3456`, configurable via `PORT` env var
