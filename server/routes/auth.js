// Rebel.fun — Auth Routes
const express = require('express');
const router = express.Router();
const { get, run, all, audit } = require('../db');
const { createSession, sanitize, requireSession } = require('../middleware');

// ===== MEGAETH CONFIG =====
const MEGAETH_RPC = process.env.MEGAETH_RPC || 'https://mainnet.megaeth.com/rpc';
const MEGAETH_CHAIN_ID = 4326;

// ERC-721 ABI fragments we need
const ERC721_ABI = {
  // balanceOf(address owner) → uint256
  balanceOf: '0x70a08231',
  // ownerOf(uint256 tokenId) → address
  ownerOf: '0x6352211e',
  // tokenOfOwnerByIndex(address owner, uint256 index) → uint256
  tokenOfOwnerByIndex: '0x2f745c59',
  // totalSupply() → uint256
  totalSupply: '0x18160ddd',
  // tokenURI(uint256 tokenId) → string
  tokenURI: '0xc87b56dd',
  // name() → string
  name: '0x06fdde03',
  // owner() → address (Ownable)
  owner: '0x8da5cb5b',
};

// In-memory NFT metadata cache (per session, cleared on restart)
const nftMetaCache = new Map();

// ===== EVM RPC HELPERS =====

// Pad address to 32 bytes for ABI encoding
function padAddress(addr) {
  return addr.replace('0x', '').padStart(64, '0');
}

// Pad uint256 to 32 bytes
function padUint256(n) {
  return BigInt(n).toString(16).padStart(64, '0');
}

// Decode uint256 from hex response
function decodeUint256(hex) {
  if (!hex || hex === '0x') return 0n;
  return BigInt(hex);
}

// Decode address from hex response (last 20 bytes)
function decodeAddress(hex) {
  if (!hex || hex === '0x') return null;
  return '0x' + hex.slice(-40).toLowerCase();
}

// eth_call helper
async function ethCall(contractAddr, data, rpc = MEGAETH_RPC) {
  const body = JSON.stringify({
    jsonrpc: '2.0', id: 1, method: 'eth_call',
    params: [{ to: contractAddr, data }, 'latest']
  });
  const resp = await fetch(rpc, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    signal: AbortSignal.timeout(8000),
  });
  const json = await resp.json();
  return json.result || null;
}

// Get NFT balance for a wallet
async function getNFTBalance(contractAddr, walletAddr) {
  const data = ERC721_ABI.balanceOf + padAddress(walletAddr);
  const result = await ethCall(contractAddr, data);
  return Number(decodeUint256(result));
}

// Get tokenId at index for a wallet (ERC-721 Enumerable)
async function getTokenOfOwnerByIndex(contractAddr, walletAddr, index) {
  const data = ERC721_ABI.tokenOfOwnerByIndex + padAddress(walletAddr) + padUint256(index);
  const result = await ethCall(contractAddr, data);
  return decodeUint256(result).toString();
}

// Get owner of a specific tokenId
async function getOwnerOf(contractAddr, tokenId) {
  const data = ERC721_ABI.ownerOf + padUint256(tokenId);
  const result = await ethCall(contractAddr, data);
  return decodeAddress(result);
}

// Get contract owner (Ownable)
async function getContractOwner(contractAddr) {
  try {
    const result = await ethCall(contractAddr, ERC721_ABI.owner);
    return decodeAddress(result);
  } catch (e) { return null; }
}

// Decode ABI-encoded string (tokenURI / name)
function decodeABIString(hex) {
  try {
    if (!hex || hex === '0x') return '';
    const raw = hex.slice(2); // remove 0x
    // offset (32 bytes) + length (32 bytes) + data
    const lengthHex = raw.slice(64, 128);
    const length = parseInt(lengthHex, 16);
    const strHex = raw.slice(128, 128 + length * 2);
    return Buffer.from(strHex, 'hex').toString('utf8');
  } catch (e) { return ''; }
}

// Get tokenURI
async function getTokenURI(contractAddr, tokenId) {
  const cacheKey = `${contractAddr}:${tokenId}`;
  if (nftMetaCache.has(cacheKey)) return nftMetaCache.get(cacheKey);
  const data = ERC721_ABI.tokenURI + padUint256(tokenId);
  const result = await ethCall(contractAddr, data);
  const uri = decodeABIString(result);
  nftMetaCache.set(cacheKey, uri);
  return uri;
}

// Resolve IPFS/HTTP metadata
async function resolveMetadata(uri) {
  if (!uri) return null;
  try {
    let url = uri;
    if (url.startsWith('ipfs://')) url = 'https://ipfs.io/ipfs/' + url.slice(7);
    const resp = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!resp.ok) return null;
    return await resp.json();
  } catch (e) { return null; }
}

// Ensure wallet_nft_cache table exists
function ensureNFTCacheTable() {
  try {
    run(`CREATE TABLE IF NOT EXISTS wallet_nft_cache (
      wallet TEXT NOT NULL,
      contract TEXT NOT NULL,
      nfts TEXT NOT NULL,
      cached_at DATETIME DEFAULT (datetime('now')),
      PRIMARY KEY (wallet, contract)
    )`);
  } catch (e) { /* already exists */ }
}
ensureNFTCacheTable();

// POST /api/auth/login — wallet login (create/update user, return session)
router.post('/login', (req, res) => {
  const { wallet, chain } = req.body;
  if (!wallet || !chain) return res.status(400).json({ error: 'wallet and chain required' });

  const cleanWallet = sanitize(wallet.trim());
  const cleanChain = sanitize(chain.trim());

  // Upsert user
  const existing = get('SELECT * FROM users WHERE wallet = ?', [cleanWallet]);
  if (!existing) {
    run('INSERT INTO users (wallet, chain) VALUES (?, ?)', [cleanWallet, cleanChain]);
    audit('user_created', cleanWallet, cleanChain, 'New user registered');
  } else {
    run("UPDATE users SET last_seen = datetime('now'), chain = ? WHERE wallet = ?", [cleanChain, cleanWallet]);
  }

  const token = createSession(cleanWallet, cleanChain);
  const user = get('SELECT * FROM users WHERE wallet = ?', [cleanWallet]);

  res.json({
    success: true,
    sessionToken: token,
    user: {
      wallet: user.wallet,
      chain: user.chain,
      displayName: user.display_name,
      avatar: user.avatar,
      balance: user.balance,
      totalEarned: user.total_earned,
    }
  });
});

// GET /api/auth/me — get current user info
router.get('/me', requireSession, (req, res) => {
  // requireSession middleware sets req.wallet
  const user = get('SELECT * FROM users WHERE wallet = ?', [req.wallet]);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const stakedCount = get('SELECT COUNT(*) as c FROM staked_nfts WHERE wallet = ?', [req.wallet]);

  res.json({
    wallet: user.wallet,
    chain: user.chain,
    displayName: user.display_name,
    avatar: user.avatar,
    balance: user.balance,
    totalEarned: user.total_earned,
    stakedNfts: stakedCount?.c || 0,
  });
});

// POST /api/auth/update-profile
router.post('/update-profile', requireSession, (req, res) => {
  const { displayName, avatar } = req.body;
  if (displayName) {
    const clean = sanitize(displayName.trim()).slice(0, 30);
    run('UPDATE users SET display_name = ? WHERE wallet = ?', [clean, req.wallet]);
  }
  if (avatar) {
    const clean = sanitize(avatar.trim()).slice(0, 200);
    run('UPDATE users SET avatar = ? WHERE wallet = ?', [clean, req.wallet]);
  }
  audit('profile_update', req.wallet, req.chain, { displayName, avatar });
  res.json({ success: true });
});

// GET /api/auth/nfts?wallet=0x...&contract=0x...
// Read NFTs owned by wallet from MegaETH — cached in DB for 10 min
router.get('/nfts', async (req, res) => {
  const { wallet, contract } = req.query;
  if (!wallet) return res.status(400).json({ error: 'wallet required' });

  // Default to MegaRebel collection if no contract specified
  const contractAddr = (contract || '0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac').toLowerCase();
  const walletAddr = wallet.toLowerCase();

  // Check DB cache first
  try {
    const cached = get('SELECT nfts, cached_at FROM wallet_nft_cache WHERE wallet = ? AND contract = ?', [walletAddr, contractAddr]);
    if (cached) {
      const age = Date.now() - new Date(cached.cached_at + 'Z').getTime();
      const parsed = JSON.parse(cached.nfts);
      const maxAge = parsed.length === 0 ? 60000 : 600000; // 1min if empty, 10min if has NFTs
      if (age < maxAge) {
        return res.json({ nfts: parsed, total: parsed.length, cached: true });
      }
    }
  } catch (e) { /* cache miss, continue */ }

  try {
    // Get balance
    const balance = await getNFTBalance(contractAddr, walletAddr);

    if (balance === 0) {
      run("INSERT OR REPLACE INTO wallet_nft_cache (wallet, contract, nfts, cached_at) VALUES (?, ?, ?, datetime('now'))",
        [walletAddr, contractAddr, '[]']);
      return res.json({ nfts: [], total: 0 });
    }

    // Get all tokenIds via tokenOfOwnerByIndex (ERC-721 Enumerable)
    const tokenIds = [];
    for (let i = 0; i < Math.min(balance, 50); i++) {
      try {
        const tokenId = await getTokenOfOwnerByIndex(contractAddr, walletAddr, i);
        tokenIds.push(tokenId);
      } catch (e) { break; }
    }

    // Fetch metadata for each token in parallel (max 10 concurrent)
    const nfts = await Promise.all(tokenIds.map(async (tokenId) => {
      try {
        const uri = await getTokenURI(contractAddr, tokenId);
        const meta = await resolveMetadata(uri);
        let imageUrl = meta?.image || meta?.image_url || '';
        if (imageUrl.startsWith('ipfs://')) imageUrl = 'https://ipfs.io/ipfs/' + imageUrl.slice(7);
        return {
          tokenId,
          name: meta?.name || `#${tokenId}`,
          imageUrl,
          attributes: meta?.attributes || [],
          contractAddr,
        };
      } catch (e) {
        return { tokenId, name: `#${tokenId}`, imageUrl: '', attributes: [], contractAddr };
      }
    }));

    // Cache result
    run("INSERT OR REPLACE INTO wallet_nft_cache (wallet, contract, nfts, cached_at) VALUES (?, ?, ?, datetime('now'))",
      [walletAddr, contractAddr, JSON.stringify(nfts)]);

    res.json({ nfts, total: nfts.length });
  } catch (e) {
    console.error('[NFT] Error fetching NFTs:', e.message);
    res.status(500).json({ error: 'Failed to fetch NFTs from MegaETH', detail: e.message });
  }
});

// GET /api/auth/verify-owner?wallet=0x...&contract=0x...
// Check if wallet is the owner/deployer of a contract (for collection registration)
router.get('/verify-owner', async (req, res) => {
  const { wallet, contract } = req.query;
  if (!wallet || !contract) return res.status(400).json({ error: 'wallet and contract required' });

  try {
    const contractOwner = await getContractOwner(contract.toLowerCase());
    const isOwner = contractOwner && contractOwner.toLowerCase() === wallet.toLowerCase();
    res.json({ isOwner, contractOwner });
  } catch (e) {
    res.status(500).json({ error: 'Failed to verify ownership', detail: e.message });
  }
});

// GET /api/auth/check-ownership?wallet=0x...&contract=0x...&tokenId=123
// Verify a specific NFT is still owned by wallet (used by cron + unstake check)
router.get('/check-ownership', async (req, res) => {
  const { wallet, contract, tokenId } = req.query;
  if (!wallet || !contract || !tokenId) return res.status(400).json({ error: 'wallet, contract, tokenId required' });

  try {
    const owner = await getOwnerOf(contract.toLowerCase(), tokenId);
    const stillOwned = owner && owner.toLowerCase() === wallet.toLowerCase();
    res.json({ stillOwned, currentOwner: owner });
  } catch (e) {
    res.status(500).json({ error: 'Failed to check ownership', detail: e.message });
  }
});

module.exports = router;
// Export helpers for cron job
module.exports.getOwnerOf = getOwnerOf;
module.exports.MEGAETH_RPC = MEGAETH_RPC;
