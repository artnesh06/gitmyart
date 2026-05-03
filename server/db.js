// Gitmyart — Database (SQLite)
const Database = require('better-sqlite3');
const path = require('path');

// Use persistent volume in production, local data dir in development
const DB_PATH = process.env.NODE_ENV === 'production'
  ? '/data/rebel.db'
  : path.join(__dirname, '..', 'data', 'rebel.db');

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(DB_PATH);

// WAL mode for better concurrent reads
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ===== SCHEMA =====
db.exec(`
  -- Users
  CREATE TABLE IF NOT EXISTS users (
    wallet TEXT PRIMARY KEY,
    chain TEXT NOT NULL DEFAULT 'atom',
    display_name TEXT,
    avatar TEXT,
    balance REAL DEFAULT 0,
    total_earned REAL DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now')),
    last_seen DATETIME DEFAULT (datetime('now'))
  );

  -- Soft Staked NFTs
  CREATE TABLE IF NOT EXISTS staked_nfts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wallet TEXT NOT NULL,
    chain TEXT NOT NULL DEFAULT 'atom',
    token_id TEXT NOT NULL,
    collection_id TEXT NOT NULL,
    collection_name TEXT,
    name TEXT,
    image_url TEXT,
    rarity TEXT DEFAULT 'common',
    hp REAL DEFAULT 100,
    traits TEXT DEFAULT '[]',
    staked_at DATETIME DEFAULT (datetime('now')),
    last_fed DATETIME DEFAULT (datetime('now')),
    last_earned DATETIME DEFAULT (datetime('now')),
    UNIQUE(wallet, token_id, collection_id)
  );

  -- Collections
  CREATE TABLE IF NOT EXISTS collections (
    id TEXT PRIMARY KEY,
    chain TEXT NOT NULL DEFAULT 'atom',
    name TEXT NOT NULL,
    ticker TEXT,
    contract_addr TEXT,
    image_url TEXT,
    creator TEXT,
    floor_price REAL DEFAULT 0,
    total_staked INTEGER DEFAULT 0,
    total_stakers INTEGER DEFAULT 0,
    reward_per_day REAL DEFAULT 5,
    badge TEXT,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT (datetime('now'))
  );

  -- Raffles
  CREATE TABLE IF NOT EXISTS raffles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chain TEXT NOT NULL DEFAULT 'atom',
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    price REAL NOT NULL,
    token TEXT NOT NULL,
    max_entries INTEGER NOT NULL,
    current_entries INTEGER DEFAULT 0,
    ends_at DATETIME NOT NULL,
    winner_wallet TEXT,
    status TEXT DEFAULT 'live',
    created_at DATETIME DEFAULT (datetime('now'))
  );

  -- Raffle Entries
  CREATE TABLE IF NOT EXISTS raffle_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    raffle_id INTEGER NOT NULL,
    wallet TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (raffle_id) REFERENCES raffles(id)
  );

  -- Leaderboard cache (updated by cron)
  CREATE TABLE IF NOT EXISTS leaderboard (
    wallet TEXT NOT NULL,
    chain TEXT NOT NULL,
    nfts_staked INTEGER DEFAULT 0,
    points REAL DEFAULT 0,
    updated_at DATETIME DEFAULT (datetime('now')),
    PRIMARY KEY (wallet, chain)
  );

  -- Audit Log (immutable)
  CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    wallet TEXT,
    chain TEXT,
    detail TEXT,
    created_at DATETIME DEFAULT (datetime('now'))
  );

  -- Config (key-value store)
  CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// ===== HELPERS =====
function get(sql, params = []) {
  return db.prepare(sql).get(...(Array.isArray(params) ? params : [params]));
}

function all(sql, params = []) {
  return db.prepare(sql).all(...(Array.isArray(params) ? params : [params]));
}

function run(sql, params = []) {
  return db.prepare(sql).run(...(Array.isArray(params) ? params : [params]));
}

function getConfig(key, fallback = null) {
  const row = get('SELECT value FROM config WHERE key = ?', [key]);
  return row ? row.value : fallback;
}

function setConfig(key, value) {
  run('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', [key, String(value)]);
}

function audit(action, wallet, chain, detail) {
  run('INSERT INTO audit_log (action, wallet, chain, detail) VALUES (?, ?, ?, ?)',
    [action, wallet || null, chain || null, typeof detail === 'object' ? JSON.stringify(detail) : (detail || null)]);
}

module.exports = { db, get, all, run, getConfig, setConfig, audit };
