// ===== SYSTEM DOCUMENTATION PAGE =====
// Halaman ini berisi dokumentasi lengkap arsitektur, struktur, dan cara kerja Rebel.fun
// Tujuan: Agar tim tidak lupa struktur dan mudah debug

const SYSTEM_DOCS = {
  overview: `
# 🏗️ REBEL.FUN — SYSTEM ARCHITECTURE

## Project Overview
Rebel.fun adalah platform multi-chain NFT staking dan raffle. Users stake NFT dari koleksi terkurasi, earn points, dan ikut raffle dengan token chain-native.

**Status:** Backend ~80% done, Frontend ~40% done (skeleton React)
**Tech Stack:** Node.js + Express 5, SQLite, React + Vite, RainbowKit
**Deployment:** Fly.io free tier (256MB RAM, 3GB storage)

---

## 📊 ARCHITECTURE OVERVIEW

### Backend (Express.js)
\`\`\`
server/
├── index.js          → Express setup, middleware, routes mounting
├── db.js             → SQLite connection, schema, query helpers
├── middleware.js     → Session tokens (HMAC-SHA256), rate limiting, sanitization
├── cron.js           → Background jobs (HP decay, rewards, leaderboard, raffle expiry)
├── seed.js           → Demo data seeder
└── routes/
    ├── auth.js       → Login, profile, NFT verification
    ├── collections.js → Get collections, staking stats
    ├── stake.js      → Stake, unstake, feed, claim rewards
    ├── raffles.js    → Get raffles, enter raffle
    ├── leaderboard.js → Rankings
    ├── stats.js      → Platform stats, coin prices
    └── ai.js         → AI chat (Groq API)
\`\`\`

### Frontend (React + Vite)
\`\`\`
src/
├── App.jsx           → Main app, RainbowKit setup
├── main.jsx          → Entry point
├── components/
│   ├── Sidebar.jsx   → Left nav
│   ├── Topbar.jsx    → Top bar, chain selector
│   ├── MainContent.jsx → Router & page container
│   ├── RightPanel.jsx → Settings, notifications
│   └── ...
├── pages/
│   ├── HomePage.jsx
│   ├── LeaderboardPage.jsx
│   ├── RafflesPage.jsx
│   └── CollectionsPage.jsx
├── context/
│   ├── AppContext.jsx → Global state (user, chain, session)
│   └── ThemeContext.jsx → Theme management
├── hooks/
│   ├── useApi.js     → API calls dengan session token
│   ├── useWallet.js  → Wallet connection
│   └── useToast.js   → Notifications
└── utils/
    └── helpers.js    → Format, helpers
\`\`\`

---

## 🗄️ DATABASE SCHEMA

### Tables (SQLite)
1. **users** — Wallet, chain, display_name, balance, total_earned
2. **staked_nfts** — Wallet, token_id, collection_id, hp, rarity, staked_at
3. **collections** — Name, ticker, contract_addr, floor_price, reward_per_day
4. **raffles** — Name, price, token, max_entries, current_entries, ends_at, winner_wallet
5. **raffle_entries** — raffle_id, wallet, quantity
6. **leaderboard** — wallet, chain, nfts_staked, points (cache, updated by cron)
7. **audit_log** — action, wallet, chain, detail, created_at (immutable)
8. **config** — key-value store (hp_decay_rate, base_reward, etc)

**Key Features:**
- WAL mode enabled (concurrent reads)
- Foreign keys enforced
- Transactions untuk multi-step writes
- Audit logging semua state changes

---

## 🔐 SECURITY IMPLEMENTATION

### Session Tokens
- HMAC-SHA256 signature
- Format: \`wallet:chain:expires:signature\`
- 24h expiry
- Timing-safe comparison (crypto.timingSafeEqual)
- Passed via \`x-session-token\` header

### Rate Limiting
- **IP-based:** 400 reads/min, 200 writes/min
- **Per-wallet cooldowns:** 3s stake, 5s batch, 10s claim
- In-memory Map (resets on server restart — TODO: persist to DB)

### Input Sanitization
- HTML special chars escaped (\`<>"'&\`)
- Applied to user input

### HTTP Security
- Helmet.js for security headers
- CORS whitelist (localhost + production URLs)
- Content-Security-Policy disabled (untuk admin panel)

---

## ⚙️ CRON JOBS (Background Tasks)

Semua berjalan di background, tidak auto-sleep di Fly.io:

1. **Ownership Verification** (every 30 min)
   - Check if staked NFTs masih owned by staker
   - Auto-unstake kalau NFT pindah owner
   - Hanya untuk MegaETH (0x wallets)

2. **HP Decay** (every 30 min)
   - Kurangi HP semua staked NFTs sebesar \`hp_decay_rate\` (default 2%)
   - HP tidak bisa < 0

3. **Earn Rewards** (every hour)
   - Hitung reward per NFT: \`(reward_per_day / 24) * (hp / 100)\`
   - Add ke user balance
   - Reward scales dengan HP (full HP = full reward, 0 HP = no reward)

4. **Leaderboard Refresh** (every 15 min)
   - Aggregate points per wallet per chain
   - Update leaderboard table (cache)

5. **Raffle Expiry** (every 5 min)
   - Check raffles yang sudah expired
   - Pick random winner dari entries
   - Update status ke "ended"

---

## 🎮 CORE FEATURES & FLOW

### 1. Staking Flow
\`\`\`
User → Connect Wallet → Login (POST /api/auth/login)
     → Get session token (24h)
     → Browse collections (GET /api/collections)
     → Stake NFT (POST /api/stake)
     → NFT added ke staked_nfts table
     → HP = 100, last_fed = now
     → Points += 10 (leaderboard updated)
\`\`\`

### 2. Earning Flow
\`\`\`
Cron (hourly) → For each staked NFT:
              → reward = (collection.reward_per_day / 24) * (nft.hp / 100)
              → user.balance += reward
              → nft.last_earned = now
\`\`\`

### 3. Raffle Flow
\`\`\`
User → Browse raffles (GET /api/raffles)
    → Enter raffle (POST /api/raffles/:id/enter)
    → Check balance (simplified, not enforced yet)
    → Add entry ke raffle_entries table
    → raffle.current_entries += quantity
    → Cron (5 min) → Check if raffle expired
                  → Pick random winner
                  → Update raffle.winner_wallet
\`\`\`

### 4. Claim Flow
\`\`\`
User → Claim rewards (POST /api/stake/claim)
    → Check user.balance > 0
    → user.balance = 0
    → user.total_earned += amount
    → Audit log created
\`\`\`

---

## 🚨 KNOWN ISSUES & TODO

### Critical (Fix Before Deploy)
- [ ] SESSION_SECRET hardcoded di middleware.js (set di .env)
- [ ] Raffle balance check commented out (un-comment)
- [ ] AI route (/api/ai/chat) tidak ada auth (add requireSession)
- [ ] Conversations Map di AI route memory leak (add TTL)
- [ ] GROQ_API_KEY tidak di .env

### Important
- [ ] Rate limit in-memory (resets on restart) — persist to DB
- [ ] NFT ownership check hanya untuk MegaETH (add Cosmos support)
- [ ] Cron ownership check hanya 100 NFTs per run (bisa kelewat)
- [ ] Coin prices hardcoded (integrate CoinGecko API)

### Frontend
- [ ] Vanilla app.js (2500 lines) belum dimigrate ke React
- [ ] Staking UI belum ada
- [ ] Raffle detail page belum ada
- [ ] Collection detail page belum ada
- [ ] Live updates (WebSocket) belum ada
- [ ] Animations belum ada

---

## 📈 CAPACITY & LIMITS

### Fly.io Free Tier
- **RAM:** 256MB → ~100-150 concurrent users
- **Storage:** 3GB → Ratusan ribu users + jutaan transaksi
- **Bandwidth:** 160GB/month → ~2000 active users/day
- **Bottleneck:** RAM (upgrade ke $3-6/month kalau ramai)

### Database Limits
- **Users:** Unlimited (storage limited)
- **Staked NFTs:** Unlimited
- **Raffles:** Unlimited
- **Audit logs:** Unlimited (bisa grow besar)

---

## 🔄 DEPLOYMENT CHECKLIST

- [ ] Set SESSION_SECRET di .env
- [ ] Set GROQ_API_KEY di .env (atau disable AI)
- [ ] Set VITE_WALLETCONNECT_PROJECT_ID di .env
- [ ] Fix raffle balance check
- [ ] Add auth ke AI route
- [ ] Fix conversations memory leak
- [ ] Test cron jobs
- [ ] Test rate limiting
- [ ] Build frontend (npm run build)
- [ ] Deploy ke Fly.io (flyctl deploy)
- [ ] Monitor logs (flyctl logs)

---

## 📞 QUICK REFERENCE

### API Endpoints
\`\`\`
POST   /api/auth/login              → Login dengan wallet
GET    /api/auth/me                 → Get current user
POST   /api/auth/update-profile     → Update profile

GET    /api/collections             → Get all collections
GET    /api/collections/:id         → Get collection detail

GET    /api/stake/my                → Get my staked NFTs
POST   /api/stake                   → Stake single NFT
POST   /api/stake/batch             → Stake multiple NFTs
POST   /api/stake/unstake           → Unstake NFT
POST   /api/stake/feed              → Feed NFT (restore HP)
POST   /api/stake/claim             → Claim rewards

GET    /api/raffles                 → Get active raffles
GET    /api/raffles/:id             → Get raffle detail
POST   /api/raffles/:id/enter       → Enter raffle

GET    /api/leaderboard             → Get leaderboard
GET    /api/stats                   → Get platform stats
GET    /api/stats/coins             → Get coin prices

POST   /api/ai/chat                 → Chat dengan AI
\`\`\`

### Environment Variables
\`\`\`
NODE_ENV=production
PORT=3456
SESSION_SECRET=your-secret-key-here
GROQ_API_KEY=your-groq-key
VITE_WALLETCONNECT_PROJECT_ID=your-wc-id
VITE_API_BASE=https://rebel.fun/api
\`\`\`

### Useful Commands
\`\`\`bash
npm start              # Start server
npm run seed           # Seed demo data
npm run dev            # Dev mode (server + client)
npm run build          # Build frontend
flyctl deploy          # Deploy ke Fly.io
flyctl logs            # View logs
\`\`\`
  `,

  dataFlow: `
# 📊 DATA FLOW DIAGRAM

## User Staking Journey
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ 1. USER CONNECTS WALLET                                     │
│    - RainbowKit modal                                       │
│    - Select chain (Cosmos, MegaETH, Ethereum)              │
│    - Sign message (optional)                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. LOGIN (POST /api/auth/login)                            │
│    - Send: { wallet, chain }                               │
│    - Backend: Create session token (HMAC-SHA256)           │
│    - Return: { sessionToken, user }                        │
│    - Frontend: Store in sessionStorage                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. BROWSE COLLECTIONS (GET /api/collections?chain=atom)   │
│    - Backend: Query collections table                      │
│    - Return: [{ id, name, ticker, reward_per_day, ... }]  │
│    - Frontend: Display collection grid                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. STAKE NFT (POST /api/stake)                             │
│    - Send: { tokenId, collectionId, name, imageUrl }      │
│    - Header: x-session-token                              │
│    - Backend:                                              │
│      1. Verify session token                              │
│      2. Check NFT not already staked                       │
│      3. Check collection exists                           │
│      4. INSERT into staked_nfts (hp=100)                  │
│      5. UPDATE collections stats                          │
│      6. UPDATE leaderboard (+10 points)                   │
│      7. INSERT audit log                                  │
│    - Return: { success: true }                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. CRON: EARN REWARDS (every hour)                         │
│    - For each staked NFT with hp > 0:                      │
│      reward = (collection.reward_per_day / 24) * (hp/100) │
│      UPDATE users SET balance += reward                    │
│      UPDATE staked_nfts SET last_earned = now              │
│    - Audit log created                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. CLAIM REWARDS (POST /api/stake/claim)                   │
│    - Check user.balance > 0                                │
│    - UPDATE users SET balance = 0, total_earned += amount  │
│    - Return: { claimed: amount }                           │
│    - Audit log created                                     │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Raffle Entry Journey
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ 1. BROWSE RAFFLES (GET /api/raffles?chain=atom)           │
│    - Backend: Query raffles WHERE status='live'            │
│    - Return: [{ id, name, price, token, entries, ... }]   │
│    - Frontend: Display raffle cards                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. ENTER RAFFLE (POST /api/raffles/:id/enter)             │
│    - Send: { quantity }                                    │
│    - Header: x-session-token                              │
│    - Backend:                                              │
│      1. Verify session token                              │
│      2. Check raffle exists & is live                     │
│      3. Check entries not full                            │
│      4. Check user balance (simplified, not enforced)     │
│      5. INSERT into raffle_entries                        │
│      6. UPDATE raffles SET current_entries += qty         │
│      7. INSERT audit log                                  │
│    - Return: { success: true }                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. CRON: RAFFLE EXPIRY (every 5 min)                       │
│    - Query raffles WHERE status='live' AND ends_at < now   │
│    - For each expired raffle:                              │
│      1. Query raffle_entries                               │
│      2. Pick random winner                                 │
│      3. UPDATE raffles SET winner_wallet, status='ended'   │
│      4. INSERT audit log                                   │
│    - Return: Winner announced                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## HP Decay & Feeding
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ CRON: HP DECAY (every 30 min)                              │
│    - For each staked NFT:                                  │
│      newHp = max(0, hp - hp_decay_rate)                    │
│      UPDATE staked_nfts SET hp = newHp                     │
│    - Lower HP = lower rewards                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ USER: FEED NFT (POST /api/stake/feed)                      │
│    - Send: { nftId }                                       │
│    - Backend:                                              │
│      1. Check NFT exists & belongs to user                 │
│      2. Check hp < 100                                     │
│      3. newHp = min(100, hp + 25)                          │
│      4. UPDATE staked_nfts SET hp = newHp, last_fed = now │
│      5. INSERT audit log                                   │
│    - Return: { hp: newHp }                                 │
└─────────────────────────────────────────────────────────────┘
\`\`\`
  `,

  security: `
# 🔐 SECURITY ARCHITECTURE

## Authentication Flow
\`\`\`
1. User connects wallet via RainbowKit
2. Frontend calls POST /api/auth/login { wallet, chain }
3. Backend creates session token:
   - payload = "wallet:chain:expires"
   - signature = HMAC-SHA256(payload, SESSION_SECRET)
   - token = "payload:signature"
4. Token stored in sessionStorage (frontend)
5. Token sent in x-session-token header for protected routes
6. Backend verifies:
   - Token format valid
   - Expiry not passed
   - Signature matches (timing-safe compare)
\`\`\`

## Rate Limiting Strategy
\`\`\`
IP-Based (Global):
  - Read routes: 400 requests/min
  - Write routes: 200 requests/min
  - Enforced via middleware

Per-Wallet Cooldowns:
  - Stake: 3 seconds
  - Batch stake: 5 seconds
  - Claim: 10 seconds
  - Raffle enter: 3 seconds
  - Enforced via walletRateLimit middleware

⚠️ TODO: Persist cooldowns to DB (currently in-memory, resets on restart)
\`\`\`

## Input Validation
\`\`\`
1. HTML Sanitization
   - Escape: < > " ' &
   - Applied to user input (names, descriptions)

2. Type Checking
   - tokenId: string
   - collectionId: string
   - quantity: integer (1-100)
   - wallet: string (format validated)

3. Business Logic Validation
   - NFT not already staked
   - Collection exists
   - Raffle is live
   - User has balance
   - Entries not full
\`\`\`

## Database Security
\`\`\`
1. Foreign Keys Enforced
   - staked_nfts.collection_id → collections.id
   - raffle_entries.raffle_id → raffles.id

2. Transactions for Atomicity
   - Multi-step writes wrapped in db.transaction()
   - All-or-nothing execution

3. Audit Logging
   - Every state change logged to audit_log
   - Immutable (no deletes)
   - Includes: action, wallet, chain, detail, timestamp

4. SQL Injection Prevention
   - All queries use parameterized statements
   - No string concatenation
\`\`\`

## Known Vulnerabilities & Mitigations
\`\`\`
❌ SESSION_SECRET hardcoded
   → FIX: Set in .env, load via process.env.SESSION_SECRET

❌ Raffle balance check commented out
   → FIX: Un-comment validation, check on-chain balance

❌ AI route no auth
   → FIX: Add requireSession middleware

❌ Conversations Map memory leak
   → FIX: Add TTL or max size limit

❌ Rate limit in-memory
   → FIX: Persist to Redis or DB

❌ NFT ownership check only MegaETH
   → FIX: Add Cosmos RPC integration
\`\`\`

## Deployment Security Checklist
\`\`\`
- [ ] Set SESSION_SECRET in production .env
- [ ] Enable HTTPS (Fly.io auto-enables)
- [ ] Set CORS whitelist to production domain only
- [ ] Disable admin panel in production (or password-protect)
- [ ] Monitor audit logs for suspicious activity
- [ ] Set up rate limit alerts
- [ ] Regular database backups
- [ ] Monitor Fly.io logs for errors
\`\`\`
  `,

  troubleshooting: `
# 🔧 TROUBLESHOOTING GUIDE

## Common Issues

### 1. "Unauthorized" Error on Protected Routes
**Symptom:** POST /api/stake returns 401
**Cause:** Session token missing or invalid
**Fix:**
  - Check x-session-token header is sent
  - Verify token not expired (24h)
  - Re-login to get new token
  - Check SESSION_SECRET matches between frontend & backend

### 2. "Too many requests" Error
**Symptom:** 429 status code
**Cause:** Rate limit exceeded
**Fix:**
  - Wait 1 minute for IP rate limit to reset
  - Wait 3-10 seconds for per-wallet cooldown
  - Check if bot/script is spamming

### 3. NFT Not Appearing After Stake
**Symptom:** Stake succeeds but NFT not in /api/stake/my
**Cause:** Query filter by chain mismatch
**Fix:**
  - Check activeChain matches staked NFT chain
  - Verify collection exists in that chain
  - Check database directly: SELECT * FROM staked_nfts WHERE wallet='...'

### 4. Rewards Not Earning
**Symptom:** Balance not increasing
**Cause:** Cron job not running or HP = 0
**Fix:**
  - Check cron jobs are scheduled (server logs)
  - Check NFT hp > 0 (feed if needed)
  - Check collection reward_per_day > 0
  - Wait 1 hour for next earn cycle

### 5. Raffle Not Ending
**Symptom:** Raffle still "live" after end time
**Cause:** Cron job not running or ends_at format wrong
**Fix:**
  - Check cron logs
  - Verify ends_at is ISO datetime
  - Manually trigger: UPDATE raffles SET status='ended' WHERE id=X

### 6. Admin Panel Login Fails
**Symptom:** "Invalid username or password"
**Cause:** Wrong credentials
**Fix:**
  - Default: admin / rebel2024
  - Check admin.js for ADMIN_CREDS
  - Change password in code before deploy

### 7. Database Locked Error
**Symptom:** "database is locked"
**Cause:** Multiple writes at same time (SQLite limitation)
**Fix:**
  - Increase WAL timeout
  - Use transactions (already done)
  - Consider upgrading to PostgreSQL for production

### 8. Memory Usage High
**Symptom:** Server slow or crashes
**Cause:** Conversations Map growing unbounded
**Fix:**
  - Restart server
  - Fix memory leak in ai.js (add TTL)
  - Monitor with: flyctl metrics

---

## Debug Commands

### Check Database
\`\`\`bash
# Connect to SQLite
sqlite3 data/rebel.db

# View schema
.schema

# Count records
SELECT COUNT(*) FROM staked_nfts;
SELECT COUNT(*) FROM users;

# Check specific user
SELECT * FROM users WHERE wallet='cosmos1...';

# View audit log
SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 10;
\`\`\`

### Check Logs
\`\`\`bash
# Local development
npm start  # Watch console output

# Production (Fly.io)
flyctl logs
flyctl logs --follow  # Real-time

# Filter by level
flyctl logs | grep ERROR
flyctl logs | grep CRON
\`\`\`

### Test API Endpoints
\`\`\`bash
# Login
curl -X POST http://localhost:3456/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"wallet":"cosmos1test","chain":"atom"}'

# Get collections
curl http://localhost:3456/api/collections?chain=atom

# Get stats
curl http://localhost:3456/api/stats?chain=atom

# Health check
curl http://localhost:3456/api/health
\`\`\`

### Monitor Performance
\`\`\`bash
# Fly.io metrics
flyctl metrics

# Database size
du -sh data/rebel.db

# Server uptime
curl http://localhost:3456/api/health | jq .uptime
\`\`\`
  `
};

function renderAdminDocs() {
  const el = document.getElementById('adminDocsContent');
  if (!el) return;

  const tabs = ['overview', 'dataFlow', 'security', 'troubleshooting'];
  const tabsHtml = tabs.map(t => `
    <button class="admin-docs-tab ${t === 'overview' ? 'active' : ''}" 
            onclick="switchAdminDocsTab('${t}',this)">
      ${t === 'overview' ? '📋 Overview' : 
        t === 'dataFlow' ? '📊 Data Flow' :
        t === 'security' ? '🔐 Security' :
        '🔧 Troubleshooting'}
    </button>
  `).join('');

  const contentHtml = `
    <div class="admin-docs-tabs">${tabsHtml}</div>
    <div class="admin-docs-content" id="adminDocsContentArea">
      ${markdownToHtml(SYSTEM_DOCS.overview)}
    </div>
  `;

  el.innerHTML = contentHtml;
}

function switchAdminDocsTab(tab, btn) {
  document.querySelectorAll('.admin-docs-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const content = document.getElementById('adminDocsContentArea');
  content.innerHTML = markdownToHtml(SYSTEM_DOCS[tab]);
  content.scrollTop = 0;
}

function markdownToHtml(md) {
  let html = md
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^- (.*?)$/gm, '<li>$1</li>')
    .replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n/g, '<br>');
  return '<p>' + html + '</p>';
}
