// DropStudio.fun — App Logic (Full Dummy + Live Animations)
const API_BASE = window.location.origin + '/api';
let activeChain = 'megaeth'; // Default to MegaETH
let sessionToken = sessionStorage.getItem('rebel_session') || null;
let currentUser = null;

const CHAINS = {
  atom: { name:'Cosmos', symbol:'ATOM', color:'#a78bfa' },
  megaeth: { name:'MegaETH', symbol:'METH', color:'#4ade80' },
  ethereum: { name:'Ethereum', symbol:'ETH', color:'#60a5fa' },
};

// ===== API =====
async function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (sessionToken) headers['x-session-token'] = sessionToken;
  try {
    const r = await fetch(API_BASE + path, { ...opts, headers: { ...headers, ...opts.headers } });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'API error');
    return data;
  } catch (e) { console.warn('[API]', path, e.message); return null; }
}

// ===== HELPERS =====
function fn(n) { return Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 }); }
function shortAddr(a) { return (!a || a.length <= 14) ? (a||'') : a.slice(0,8)+'...'+a.slice(-4); }
function randBetween(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ===== SPARKLINE =====
function genSparkline(w, h, pts, color) {
  const d = []; let v = 50 + Math.random() * 30;
  for (let i = 0; i < pts; i++) { v += (Math.random() - 0.45) * 8; v = Math.max(5, Math.min(95, v)); d.push(v); }
  const mn = Math.min(...d), mx = Math.max(...d), rng = mx - mn || 1;
  const id = 'sg' + Math.random().toString(36).slice(2,7);
  const coords = d.map((v, i) => `${(i/(d.length-1))*w},${h-((v-mn)/rng)*(h*0.8)-h*0.1}`).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}" stop-opacity="0.3"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><polyline points="${coords}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/><polygon points="0,${h} ${coords} ${w},${h}" fill="url(#${id})" opacity="0.4"/></svg>`;
}

// ===== COINS DATA =====
const COINS_BY_CHAIN = {
  atom: [
    {symbol:'$ATOM',name:'Cosmos',img:'https://picsum.photos/seed/atom/80/80',val:'$1.5M',rawVal:1500000,change:'+9.4%',up:true},
    {symbol:'$OSMO',name:'Osmosis',img:'https://picsum.photos/seed/osmo/80/80',val:'$890K',rawVal:890000,change:'+5.2%',up:true},
    {symbol:'$JUNO',name:'Juno',img:'https://picsum.photos/seed/juno/80/80',val:'$234K',rawVal:234000,change:'-2.1%',up:false},
    {symbol:'$STARS',name:'Stargaze',img:'https://picsum.photos/seed/stars/80/80',val:'$156K',rawVal:156000,change:'+18.3%',up:true},
    {symbol:'$INJ',name:'Injective',img:'https://picsum.photos/seed/inj/80/80',val:'$3.2M',rawVal:3200000,change:'+12.7%',up:true},
    {symbol:'$TIA',name:'Celestia',img:'https://picsum.photos/seed/tia/80/80',val:'$2.8M',rawVal:2800000,change:'+7.1%',up:true},
    {symbol:'$KUJI',name:'Kujira',img:'https://picsum.photos/seed/kuji/80/80',val:'$78K',rawVal:78000,change:'-4.5%',up:false},
    {symbol:'$AKT',name:'Akash',img:'https://picsum.photos/seed/akt/80/80',val:'$1.1M',rawVal:1100000,change:'+22.8%',up:true},
  ],
  megaeth: [
    {symbol:'$METH',name:'MegaETH',img:'https://picsum.photos/seed/mega/80/80',val:'$4.8M',rawVal:4800000,change:'+5.6%',up:true},
    {symbol:'$REBEL',name:'Rebel Token',img:'https://picsum.photos/seed/rebel/80/80',val:'$2.1M',rawVal:2100000,change:'+22.1%',up:true},
    {symbol:'$TURBO',name:'TurboSwap',img:'https://picsum.photos/seed/turbo/80/80',val:'$890K',rawVal:890000,change:'+34.5%',up:true},
    {symbol:'$BLITZ',name:'Blitz Finance',img:'https://picsum.photos/seed/blitz/80/80',val:'$567K',rawVal:567000,change:'+8.9%',up:true},
    {symbol:'$FLASH',name:'FlashLend',img:'https://picsum.photos/seed/flash/80/80',val:'$345K',rawVal:345000,change:'-5.2%',up:false},
    {symbol:'$HYPER',name:'HyperDEX',img:'https://picsum.photos/seed/hyper/80/80',val:'$234K',rawVal:234000,change:'+15.3%',up:true},
  ],
  ethereum: [
    {symbol:'$ETH',name:'Ethereum',img:'https://picsum.photos/seed/eth/80/80',val:'$12.3M',rawVal:12300000,change:'+2.4%',up:true},
    {symbol:'$UNI',name:'Uniswap',img:'https://picsum.photos/seed/uni/80/80',val:'$8.9M',rawVal:8900000,change:'+4.1%',up:true},
    {symbol:'$AAVE',name:'Aave',img:'https://picsum.photos/seed/aave/80/80',val:'$5.6M',rawVal:5600000,change:'+6.8%',up:true},
    {symbol:'$LINK',name:'Chainlink',img:'https://picsum.photos/seed/link/80/80',val:'$4.2M',rawVal:4200000,change:'-1.3%',up:false},
    {symbol:'$LDO',name:'Lido DAO',img:'https://picsum.photos/seed/ldo/80/80',val:'$3.8M',rawVal:3800000,change:'+3.5%',up:true},
    {symbol:'$MKR',name:'Maker',img:'https://picsum.photos/seed/mkr/80/80',val:'$2.9M',rawVal:2900000,change:'+1.9%',up:true},
  ],
};
const CHARITY_COINS = [
  {symbol:'$WISH',name:'Make A Wish',img:'https://picsum.photos/seed/wish/80/80',val:'$2.44M',change:'+4.9%',up:true},
  {symbol:'$STJUDE',name:'St. Jude',img:'https://picsum.photos/seed/stjude/80/80',val:'$607K',change:'+4.3%',up:true},
  {symbol:'$PUP',name:'Wheelchair P...',img:'https://picsum.photos/seed/pup/80/80',val:'$408K',change:'+4.7%',up:true},
  {symbol:'$RC',name:'Red Cross',img:'https://picsum.photos/seed/redcross/80/80',val:'$202K',change:'+4.8%',up:true},
  {symbol:'$WATER',name:'Water',img:'https://picsum.photos/seed/water/80/80',val:'$149K',change:'+16.7%',up:true},
];
function getCoins() { return COINS_BY_CHAIN[activeChain] || []; }
let myCoinsFilter = 'all';
let topCoinsView = 'my';
const myCoinPortfolioByChain = {};

function buildMyCoinPortfolio() {
  const key = activeChain;
  if (myCoinPortfolioByChain[key]) return myCoinPortfolioByChain[key];
  const coins = getCoins();
  const rows = coins.map((c, i) => {
    const hold = Math.random() > 0.22 ? randBetween(8, 220) : 0;
    const staked = randBetween(0, Math.floor(hold * 0.7));
    const pending = hold > 0 ? randBetween(0, 180) : 0;
    const earned = hold > 0 ? pending + randBetween(180, 4200) : 0;
    return {
      symbol: c.symbol,
      name: c.name,
      img: c.img,
      mcap: c.val,
      change: c.change,
      up: c.up,
      hold,
      staked,
      pending,
      earned,
      apy: randBetween(4, 28) + '%',
      rank: i + 1,
    };
  });
  myCoinPortfolioByChain[key] = rows;
  return rows;
}

const DUMMY_NAMES = ['CryptoWhale','StarDust','MoonHunter','CosmosKing','NFTLord','DiamondHands','RocketMan','PixelMaster','ChainGuru','TokenBoss','ApeKing','DeFiWiz','MetaTrader','BlockSmith','HashPower','StakeKing','YieldFarmer','GasOptimizer'];
const NOTIFICATIONS = [
  {icon:'',text:'New raffle <b>Mega Jackpot</b> just launched!',time:'2m ago'},
  {icon:'',text:'Raffle <b>Whale Raffle</b> ending in 1 hour!',time:'15m ago'},
  {icon:'',text:'<b>0xdead...eeff</b> won the Genesis Raffle!',time:'1h ago'},
  {icon:'',text:'New collection <b>PixelPunk</b> added.',time:'2h ago'},
  {icon:'',text:'<b>0x1a2b...ef12</b> claimed 14,200 $REBEL.',time:'3h ago'},
  {icon:'',text:'<b>Golden Ticket</b> raffle 45% full!',time:'4h ago'},
];
let cachedRaffles = {}, cachedCollections = {};
let selectedTickerCoin = 'all'; // for filtering trending raffles by ticker coin

// ===== TOAST =====
function toast(msg, type='info') {
  const t = document.createElement('div'); t.className = 'toast toast-' + type; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
}

// ===== WALLET CONNECT MODAL =====
const MEGAETH_CHAIN = {
  chainId: '0x10e6', // 4326
  chainName: 'MegaETH Mainnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://mainnet.megaeth.com/rpc'],
  blockExplorerUrls: ['https://mega.etherscan.io'],
};

const WALLET_DEFS = {
  metamask: { name: 'MetaMask',     icon: '🦊', bg: 'linear-gradient(135deg,#f6851b,#e2761b)', installUrl: 'https://metamask.io/download/' },
  rabby:    { name: 'Rabby Wallet', icon: '🐰', bg: 'linear-gradient(135deg,#8697ff,#7b61ff)', installUrl: 'https://rabby.io/' },
  keplr:    { name: 'Keplr',        icon: '⚛️', bg: 'linear-gradient(135deg,#2e6fef,#1a4fd4)', installUrl: 'https://www.keplr.app/download' },
};

function openWalletModal() {
  if (window.ethereum) {
    if (window.ethereum.isMetaMask && !window.ethereum.isBraveWallet) showWcBadge('MetaMask');
    if (window.ethereum.isCoinbaseWallet) showWcBadge('Coinbase');
    if (window.ethereum.isRabby)          showWcBadge('Rabby');
    if (window.ethereum.isBraveWallet)    showWcBadge('Brave');
  }
  if (window.keplr) showWcBadge('Keplr');
  if (window.leap)  showWcBadge('Leap');
  wcShowList();
  document.getElementById('wcOverlay').classList.add('open');
}

function closeWalletModal() {
  document.getElementById('wcOverlay').classList.remove('open');
  wcShowList();
}

function showWcBadge(name) {
  const el = document.getElementById('wcBadge' + name);
  if (el) { el.textContent = 'Installed'; el.classList.add('show'); }
}

function wcShowList() {
  document.getElementById('wcBody').style.display = '';
  document.getElementById('wcConnecting').style.display = 'none';
  document.getElementById('wcQRView').style.display = 'none';
  document.getElementById('wcInstall').style.display = 'none';
}

function wcShowConnecting(walletKey) {
  const def = WALLET_DEFS[walletKey] || {};
  document.getElementById('wcBody').style.display = 'none';
  document.getElementById('wcConnecting').style.display = 'flex';
  document.getElementById('wcQRView').style.display = 'none';
  document.getElementById('wcInstall').style.display = 'none';
  const icon = document.getElementById('wcConnectingIcon');
  icon.style.background = def.bg || 'var(--accent)';
  icon.textContent = def.icon || '🔗';
  document.getElementById('wcConnectingName').textContent = 'Connecting to ' + (def.name || walletKey);
  document.getElementById('wcConnectingSub').textContent = 'Waiting for confirmation in your wallet';
}

function wcShowInstall(walletKey) {
  const def = WALLET_DEFS[walletKey] || {};
  document.getElementById('wcBody').style.display = 'none';
  document.getElementById('wcConnecting').style.display = 'none';
  document.getElementById('wcQRView').style.display = 'none';
  document.getElementById('wcInstall').style.display = 'flex';
  const icon = document.getElementById('wcInstallIcon');
  icon.style.background = def.bg || '#333';
  icon.textContent = def.icon || '❓';
  document.getElementById('wcInstallName').textContent = def.name + ' not found';
  document.getElementById('wcInstallDesc').textContent = 'Install the extension to connect with ' + def.name;
  const link = document.getElementById('wcInstallLink');
  link.href = def.installUrl || '#';
  link.textContent = 'Install ' + def.name;
}

async function switchToMegaETH(provider) {
  try {
    await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: MEGAETH_CHAIN.chainId }] });
  } catch (e) {
    if (e.code === 4902) {
      await provider.request({ method: 'wallet_addEthereumChain', params: [MEGAETH_CHAIN] });
    } else throw e;
  }
}

async function wcFinishLogin(wallet, chain) {
  try {
    const r = await fetch(API_BASE + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet, chain }),
    });
    const d = await r.json();
    if (d?.sessionToken) {
      sessionToken = d.sessionToken;
      sessionStorage.setItem('rebel_session', sessionToken);
      currentUser = d.user;
      activeChain = chain;
      updateAuthUI();
      closeWalletModal();
      toast('Connected: ' + shortAddr(wallet), 'success');
    } else {
      toast(d?.error || 'Login failed', 'error');
      wcShowList();
    }
  } catch (e) {
    toast('Login error: ' + e.message, 'error');
    wcShowList();
  }
}

async function wcConnect(walletKey) {
  wcShowConnecting(walletKey);
  try {
    if (['metamask','coinbase','rabby','brave'].includes(walletKey)) {
      if (!window.ethereum) { wcShowInstall(walletKey); return; }
      let provider = window.ethereum;
      if (window.ethereum.providers?.length) {
        if (walletKey === 'metamask') provider = window.ethereum.providers.find(p => p.isMetaMask && !p.isBraveWallet) || window.ethereum;
        if (walletKey === 'coinbase') provider = window.ethereum.providers.find(p => p.isCoinbaseWallet) || window.ethereum;
        if (walletKey === 'rabby')    provider = window.ethereum.providers.find(p => p.isRabby) || window.ethereum;
        if (walletKey === 'brave')    provider = window.ethereum.providers.find(p => p.isBraveWallet) || window.ethereum;
      }
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (!accounts?.length) throw new Error('No accounts');
      const wallet = accounts[0].toLowerCase();
      await switchToMegaETH(provider);
      provider.on('accountsChanged', accs => { if (!accs.length) logout(); else wcFinishLogin(accs[0].toLowerCase(), 'megaeth'); });
      provider.on('chainChanged', () => toast('Chain changed', 'info'));
      await wcFinishLogin(wallet, 'megaeth');
      return;
    }
    if (walletKey === 'walletconnect') {
      document.getElementById('wcBody').style.display = 'none';
      document.getElementById('wcConnecting').style.display = 'none';
      document.getElementById('wcQRView').style.display = '';
      document.getElementById('wcInstall').style.display = 'none';
      toast('Scan QR with Trust Wallet, Rainbow, or Binance', 'info');
      return;
    }
    if (walletKey === 'keplr') {
      if (!window.keplr) { wcShowInstall('keplr'); return; }
      await window.keplr.enable('cosmoshub-4');
      const offlineSigner = window.keplr.getOfflineSigner('cosmoshub-4');
      const accounts = await offlineSigner.getAccounts();
      if (!accounts?.length) throw new Error('No accounts');
      await wcFinishLogin(accounts[0].address, 'atom');
      return;
    }
    if (walletKey === 'leap') {
      if (!window.leap) { wcShowInstall('leap'); return; }
      await window.leap.enable('cosmoshub-4');
      const offlineSigner = window.leap.getOfflineSigner('cosmoshub-4');
      const accounts = await offlineSigner.getAccounts();
      if (!accounts?.length) throw new Error('No accounts');
      await wcFinishLogin(accounts[0].address, 'atom');
      return;
    }
  } catch (e) {
    if (e.code === 4001 || e.message?.includes('rejected')) toast('Connection rejected', 'error');
    else toast('Connect failed: ' + (e.message || e), 'error');
    wcShowList();
  }
}

async function connectMetaMask() {
  if (!window.ethereum) {
    toast('MetaMask not found. Please install MetaMask.', 'error');
    window.open('https://metamask.io/download/', '_blank');
    return null;
  }

  try {
    // Request accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) throw new Error('No accounts returned');
    const wallet = accounts[0].toLowerCase();

    // Check current chain
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== MEGAETH_CHAIN.chainId) {
      // Try to switch to MegaETH
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: MEGAETH_CHAIN.chainId }],
        });
      } catch (switchErr) {
        // Chain not added yet — add it
        if (switchErr.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MEGAETH_CHAIN],
          });
        } else {
          throw switchErr;
        }
      }
    }

    return wallet;
  } catch (e) {
    if (e.code === 4001) toast('Connection rejected by user', 'error');
    else toast('Wallet connect failed: ' + e.message, 'error');
    return null;
  }
}

async function demoLogin() {
  openWalletModal();
}

// Load NFTs from wallet via backend (MegaETH RPC)
async function loadWalletNFTs(contractAddr) {
  if (!currentUser?.wallet) return [];
  try {
    const params = new URLSearchParams({ wallet: currentUser.wallet });
    if (contractAddr) params.set('contract', contractAddr);
    const d = await api('/auth/nfts?' + params.toString());
    return d?.nfts || [];
  } catch (e) {
    console.warn('[NFT] Failed to load wallet NFTs:', e.message);
    return [];
  }
}

// Check if current wallet is owner of a contract (for collection registration)
async function checkContractOwner(contractAddr) {
  if (!currentUser?.wallet) return false;
  try {
    const d = await api(`/auth/verify-owner?wallet=${currentUser.wallet}&contract=${contractAddr}`);
    return d?.isOwner || false;
  } catch (e) { return false; }
}

function logout() {
  sessionToken = null;
  currentUser = null;
  sessionStorage.removeItem('rebel_session');
  updateAuthUI();
  toast('Disconnected');
}


function updateAuthUI() {
  const btn = document.getElementById('signinBtn'); if (!btn) return;
  if (currentUser) {
    btn.textContent = shortAddr(currentUser.wallet);
    btn.onclick = toggleProfilePanel;
    btn.classList.add('connected');
  } else {
    btn.textContent = 'Sign in';
    btn.onclick = demoLogin;
    btn.classList.remove('connected');
  }
}

// ===== NAV =====
function goPage(id) {
  if(event)event.preventDefault();
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+id)?.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const m={home:0,leaderboard:1,raffles:2,allcollections:3};
  if(m[id]!==undefined) document.querySelectorAll('.nav-item')[m[id]]?.classList.add('active');
  else if(id==='raffledetail') {} // no nav highlight for detail page
  else document.querySelectorAll('.nav-item')[0]?.classList.add('active');
  document.querySelector('.content').scrollTop=0;
  if(id!=='collection'&&id!=='raffledetail') window.location.hash=id;
  if(id==='topcoins')renderCoinsListFull(); if(id==='leaderboard')renderLeaderboardPage();
  if(id==='raffles')renderRafflesPage(); if(id==='allcollections')renderAllCollectionsPage();
}
function scrollTrack(id,amt){document.getElementById(id)?.scrollBy({left:amt,behavior:'smooth'});}

// ===== FORMAT VALUE =====
function fmtVal(n) {
  if (n >= 1e6) return '$' + (n/1e6).toFixed(1) + 'M';
  if (n >= 1e3) return '$' + (n/1e3).toFixed(0) + 'K';
  return '$' + n;
}
function formatEndsInLabel(endsAt, fallbackEndsIn='') {
  const end = endsAt ? new Date(endsAt) : null;
  if (!end || Number.isNaN(end.getTime())) {
    if (!fallbackEndsIn || fallbackEndsIn === 'Ended') return 'Ended';
    return 'End in ' + fallbackEndsIn.replace(/\b0d\b\s*/g, '').replace(/\b0h\b\s*/g, '').trim();
  }
  const diff = end.getTime() - Date.now();
  if (diff <= 0) return 'Ended';
  let totalSeconds = Math.floor(diff / 1000);
  const d = Math.floor(totalSeconds / 86400);
  totalSeconds -= d * 86400;
  const h = Math.floor(totalSeconds / 3600);
  totalSeconds -= h * 3600;
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0 || d > 0) parts.push(`${h}h`);
  parts.push(`${m}m`);
  parts.push(`${s}s`);
  return 'End in ' + parts.join(' ');
}
function formatEndsInValue(endsAt, fallbackEndsIn='') {
  const label = formatEndsInLabel(endsAt, fallbackEndsIn);
  if (label === 'Ended') return 'Ended';
  return label.replace(/^End in\s*/, '');
}
const liveRaffleState = new Map();

function syncLiveRaffleState(list) {
  (list || []).forEach(r => {
    if (!r?.id) return;
    liveRaffleState.set(String(r.id), {
      id: r.id,
      endsAt: r.endsAt,
      currentEntries: Number(r.currentEntries) || 0,
      maxEntries: Number(r.maxEntries) || 0,
    });
  });
}

function animateTextChange(el, nextText, trendClass) {
  if (!el || el.textContent === nextText) return;
  el.textContent = nextText;
}

function renderEntriesByFormat(value, fmt) {
  if (fmt === 'plain') return String(value);
  if (fmt === 'ratioCurrent') return fn(value);
  return fn(value);
}
function updateCountdownTokens(el, nextValue) {
  if (!el) return;
  if (el.dataset.value === nextValue) return;
  el.textContent = nextValue;
  el.dataset.value = nextValue;
}

function updateLiveRaffleDOMById(raffleId, prevVal, nextVal) {
  const id = String(raffleId);
  const trendClass = nextVal >= prevVal ? 'num-rise' : 'num-fall';
  document.querySelectorAll(`.live-entries[data-raffle-id="${id}"]`).forEach(el => {
    const fmt = el.dataset.format || 'entries';
    animateTextChange(el, renderEntriesByFormat(nextVal, fmt), trendClass);
  });
  const state = liveRaffleState.get(id);
  if (!state || !state.maxEntries) return;
  const pct = Math.max(0, Math.min(100, Math.round((nextVal / state.maxEntries) * 100)));
  document.querySelectorAll(`.live-progress-fill[data-raffle-id="${id}"]`).forEach(el => {
    el.style.width = pct + '%';
  });
  document.querySelectorAll(`.live-progress-pct[data-raffle-id="${id}"]`).forEach(el => {
    animateTextChange(el, `${pct}% full`, trendClass);
  });
  document.querySelectorAll(`.live-progress-ratio[data-raffle-id="${id}"]`).forEach(el => {
    animateTextChange(el, `${fn(nextVal)} / ${fn(state.maxEntries)}`, trendClass);
  });
}

function startLiveRaffleTicker() {
  let tickCount = 0;
  setInterval(() => {
    // 1) Countdown ticks every second.
    document.querySelectorAll('.live-countdown[data-ends-at]').forEach(el => {
      const next = formatEndsInValue(el.dataset.endsAt);
      updateCountdownTokens(el, next);
    });

    // 2) Simulate entry growth every 3 seconds.
    tickCount += 1;
    if (tickCount % 3 !== 0 || liveRaffleState.size === 0) return;
    const candidates = [...liveRaffleState.values()].filter(r => r.currentEntries < r.maxEntries);
    if (!candidates.length) return;
    const picked = pickRandom(candidates);
    const bump = randBetween(1, 3);
    const prev = picked.currentEntries;
    picked.currentEntries = Math.min(picked.maxEntries, picked.currentEntries + bump);
    liveRaffleState.set(String(picked.id), picked);
    updateLiveRaffleDOMById(picked.id, prev, picked.currentEntries);
  }, 1000);
}

// ===== RENDER: TICKER =====
function renderTicker() {
  const el = document.getElementById('tickerTrack'); if(!el) return;
  const allActive = selectedTickerCoin === 'all' ? 'ticker-item-active' : '';
  const coins = getCoins().slice(0, 10); // max 10
  el.innerHTML = `<div class="ticker-item ticker-item-all ${allActive}" onclick="selectTickerCoin('all')"><span class="ticker-symbol" style="font-size:12px;">All</span></div>` +
    coins.map((c,i) => {
    const isActive = selectedTickerCoin === c.symbol ? 'ticker-item-active' : '';
    return `<div class="ticker-item ${isActive}" data-symbol="${c.symbol}" onclick="selectTickerCoin('${c.symbol}')">
      <span class="ticker-rank">${i+1}</span>
      <div class="ticker-avatar"><img src="${c.img}" alt=""></div>
      <div class="ticker-info"><span class="ticker-symbol">${c.symbol}</span><span class="ticker-name">${c.name}</span></div>
      <div class="ticker-price"><span class="ticker-val" data-raw="${c.rawVal}">${c.val}</span><span class="ticker-change ${c.up?'up':'down'}">${c.change}</span></div>
    </div>`;
  }).join('');
}
function selectTickerCoin(symbol) {
  selectedTickerCoin = symbol;
  renderTicker();
  renderTrendingRaffles();
}
function renderCharityCoins() {
  const el = document.getElementById('charityTrack'); if(!el) return;
  el.innerHTML = CHARITY_COINS.map((c,i) => `
    <div class="charity-item"><span class="ticker-rank">${i+1}</span><div class="ticker-avatar"><img src="${c.img}" alt=""></div>
    <div class="ticker-info"><span class="ticker-symbol">${c.symbol}</span><span class="ticker-name">${c.name}</span></div>
    <div class="ticker-price"><span class="ticker-val">${c.val}</span><span class="ticker-change up">${c.change}</span></div></div>`).join('');
}
function renderCoinsListFull() {
  const tabsEl = document.getElementById('myCoinsViewTabs');
  const summaryEl = document.getElementById('myCoinsSummary');
  const filtersEl = document.getElementById('myCoinsFilters');
  const listEl = document.getElementById('coinsListFull');
  if (!tabsEl || !summaryEl || !filtersEl || !listEl) return;

  tabsEl.innerHTML = `
    <button class="mycoins-view-tab ${topCoinsView==='my'?'active':''}" onclick="setTopCoinsView('my')">Leaderboard My Coins</button>
    <button class="mycoins-view-tab ${topCoinsView==='all'?'active':''}" onclick="setTopCoinsView('all')">Leaderboard All Coins</button>
  `;

  const rows = buildMyCoinPortfolio();
  const marketRows = getCoins();
  listEl.classList.toggle('mycoins-list', topCoinsView === 'my');
  listEl.classList.toggle('allcoins-list', topCoinsView === 'all');

  if (topCoinsView === 'all') {
    const myMap = new Map(rows.map(r => [r.symbol, r]));
    const ownedCount = rows.filter(r => r.hold > 0).length;
    const totalPending = rows.reduce((s, r) => s + r.pending, 0);
    const totalEarned = rows.reduce((s, r) => s + r.earned, 0);
    summaryEl.innerHTML = `
      <div class="mycoins-card"><div class="mycoins-card-label">All Coins</div><div class="mycoins-card-val mycoins-num-anim">${marketRows.length}</div></div>
      <div class="mycoins-card"><div class="mycoins-card-label">My Coins</div><div class="mycoins-card-val mycoins-num-anim">${ownedCount}</div></div>
      <div class="mycoins-card"><div class="mycoins-card-label">Total Earned</div><div class="mycoins-card-val green mycoins-num-anim">${fn(totalEarned)} pts</div></div>
      <div class="mycoins-card"><div class="mycoins-card-label">Pending Claim</div><div class="mycoins-card-val green mycoins-num-anim">${fn(totalPending)} pts</div></div>
    `;
    filtersEl.innerHTML = `<button class="mycoins-claimall" onclick="claimAllMyCoins()" ${totalPending===0?'disabled':''}>Claim All (${fn(totalPending)} pts)</button>`;
    listEl.innerHTML = marketRows.map((c, i) => {
      const rc = i===0?'gold':i===1?'silver':i===2?'bronze':'';
      const mine = myMap.get(c.symbol);
      const isOwned = !!mine;
      const pending = mine?.pending || 0;
      const earned = mine?.earned || 0;
      return `<div class="coins-list-item">
        <div class="coins-list-rank ${rc}">${i+1}</div>
        <div class="coins-list-avatar"><img src="${c.img}" alt=""></div>
        <div class="coins-list-info"><div class="coins-list-symbol">${c.symbol}</div><div class="coins-list-name">${c.name}${isOwned ? ` · Hold ${fn(mine.hold)}` : ''}</div></div>
        <div class="mycoins-row-extra">
          <span class="mycoins-badge ${isOwned ? 'owned' : 'not-owned'}">${isOwned ? 'My Coin' : 'Not Owned'}</span>
          <span class="mycoins-chip">Earned <b class="mycoins-num-anim">${fn(earned)} pts</b></span>
          <span class="mycoins-chip">Claimable <b class="mycoins-num-anim">${fn(pending)} pts</b></span>
        </div>
        <div class="coins-list-price">${c.val}</div>
        <div class="coins-list-change ${c.up?'up':'down'}">${c.change}</div>
        <button class="mycoins-claim-btn" onclick="claimMyCoin('${c.symbol}')" ${pending===0?'disabled':''}>Claim</button>
      </div>`;
    }).join('');
    return;
  }

  const totalEarned = rows.reduce((s, r) => s + r.earned, 0);
  const totalPending = rows.reduce((s, r) => s + r.pending, 0);
  const totalStaked = rows.reduce((s, r) => s + r.staked, 0);
  const activeRows = rows.filter(r => {
    if (myCoinsFilter === 'claimable') return r.pending > 0;
    if (myCoinsFilter === 'staked') return r.staked > 0;
    return true;
  });

  summaryEl.innerHTML = `
    <div class="mycoins-card"><div class="mycoins-card-label">Coins Owned</div><div class="mycoins-card-val mycoins-num-anim">${rows.length}</div></div>
    <div class="mycoins-card"><div class="mycoins-card-label">Staked Units</div><div class="mycoins-card-val mycoins-num-anim">${fn(totalStaked)}</div></div>
    <div class="mycoins-card"><div class="mycoins-card-label">Total Earned</div><div class="mycoins-card-val green mycoins-num-anim">${fn(totalEarned)} pts</div></div>
    <div class="mycoins-card"><div class="mycoins-card-label">Pending Claim</div><div class="mycoins-card-val green mycoins-num-anim">${fn(totalPending)} pts</div></div>
  `;

  filtersEl.innerHTML = `
    <button class="mycoins-filter ${myCoinsFilter==='all'?'active':''}" onclick="setMyCoinsFilter('all')">All</button>
    <button class="mycoins-filter ${myCoinsFilter==='staked'?'active':''}" onclick="setMyCoinsFilter('staked')">Staked</button>
    <button class="mycoins-filter ${myCoinsFilter==='claimable'?'active':''}" onclick="setMyCoinsFilter('claimable')">Claimable</button>
    <button class="mycoins-claimall" onclick="claimAllMyCoins()" ${totalPending===0?'disabled':''}>Claim All (${fn(totalPending)} pts)</button>
  `;

  if (!activeRows.length) {
    listEl.innerHTML = '<div style="padding:24px 16px;color:var(--t3);">No coins match this filter.</div>';
    return;
  }

  listEl.innerHTML = activeRows.map((c, i) => {
    const rc = i===0?'gold':i===1?'silver':i===2?'bronze':'';
    return `<div class="coins-list-item">
      <div class="coins-list-rank ${rc}">${c.rank}</div>
      <div class="coins-list-avatar"><img src="${c.img}" alt=""></div>
      <div class="coins-list-info">
        <div class="coins-list-symbol">${c.symbol}</div>
        <div class="coins-list-name">${c.name} · Hold ${fn(c.hold)}</div>
      </div>
      <div class="mycoins-row-extra">
        <span class="mycoins-chip">Earned <b>${fn(c.earned)} pts</b></span>
        <span class="mycoins-chip">Claimable <b>${fn(c.pending)} pts</b></span>
      </div>
      <div class="coins-list-price">${c.mcap}</div>
      <div class="coins-list-change ${c.up?'up':'down'}">${c.change}</div>
      <button class="mycoins-claim-btn" onclick="claimMyCoin('${c.symbol}')" ${c.pending===0?'disabled':''}>Claim</button>
    </div>`;
  }).join('');
}
function setTopCoinsView(next) {
  topCoinsView = next;
  renderCoinsListFull();
}
function setMyCoinsFilter(next) {
  myCoinsFilter = next;
  renderCoinsListFull();
}
function claimMyCoin(symbol) {
  const rows = buildMyCoinPortfolio();
  const coin = rows.find(r => r.symbol === symbol);
  if (!coin || coin.pending <= 0) return;
  const got = coin.pending;
  coin.pending = 0;
  coin.earned += got;
  toast(`Claimed ${fn(got)} pts from ${symbol}`, 'success');
  renderCoinsListFull();
}
function claimAllMyCoins() {
  const rows = buildMyCoinPortfolio();
  const total = rows.reduce((s, r) => s + r.pending, 0);
  if (!total) return;
  rows.forEach(r => { r.earned += r.pending; r.pending = 0; });
  toast(`Claimed ${fn(total)} pts from all coins`, 'success');
  renderCoinsListFull();
}

// ===== RENDER: TRENDING RAFFLES =====
async function renderTrendingRaffles() {
  const el = document.getElementById('trendingTrack'); if(!el) return;
  const raffles = await api('/raffles?chain='+activeChain);
  let list = raffles || cachedRaffles[activeChain] || [];
  if(raffles) cachedRaffles[activeChain]=raffles;
  syncLiveRaffleState(list);
  if (selectedTickerCoin !== 'all') list = list.filter(r => r.token === selectedTickerCoin);
  list = list.filter(r => r.endsIn !== 'Ended').slice(0, 10); // max 10, hide ended
  if (!list.length) { el.innerHTML = '<div style="padding:30px 20px;color:var(--t3);font-size:13px;">No raffles for this token</div>'; return; }
  el.innerHTML = list.map(r => {
    return `<div class="trending-card" onclick="openRafflePage(${r.id})">
      <div class="trending-img">
        <img src="${r.imageUrl}" alt="" loading="lazy">
        <div class="trending-name-overlay">
          <span class="trending-entries"><span class="live-entries" data-raffle-id="${r.id}" data-format="entries">${fn(r.currentEntries)}</span> Entries</span>
          <span class="trending-raffle-name">${r.name} <span class="trending-token">${r.token}</span></span>
        </div>
        <div class="coll-card-overlay">
          <div class="coll-overlay-name">${r.name}</div>
          <div class="coll-overlay-desc">${r.description || ''}</div>
          <button class="coll-overlay-btn stake" onclick="event.stopPropagation();openRafflePage(${r.id})">Enter Raffle</button>
        </div>
      </div>
      <div class="trending-bottom"><span class="trending-live-dot"></span> ${r.endsIn === 'Ended' ? 'Ended' : 'LIVE · End in '}<span class="live-countdown" data-ends-at="${r.endsAt}" data-value="${formatEndsInValue(r.endsAt, r.endsIn)}">${formatEndsInValue(r.endsAt, r.endsIn)}</span></div>
    </div>`;
  }).join('');
}

// ===== RENDER: EXPLORE TABS =====
function renderExploreTabs() {
  const el = document.getElementById('exploreTabs'); if(!el) return;
  const tabs = [{label:'Movers'},{label:'Charities'},{label:'Mayhem'},{label:'Live'},{label:'New'},{label:'Market cap'},{label:'Agents'},{label:'Oldest'},{label:'Last trade'}];
  el.innerHTML = tabs.map((t,i) => `<button class="explore-tab ${i===0?'active':''}" onclick="switchTab(this)">${t.label}</button>`).join('') + `<div class="explore-tab-actions"><button class="tab-action-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg></button></div>`;
}
function switchTab(btn) { document.querySelectorAll('.explore-tab').forEach(t=>t.classList.remove('active')); btn.classList.add('active'); }

// ===== RENDER: COLLECTION GRID (sparklines + glow) =====
async function renderCollectionGrid() {
  const el = document.getElementById('collectionTrack'); if(!el) return;
  const collections = await api('/collections?chain='+activeChain);
  const allList = collections || cachedCollections[activeChain] || [];
  if(collections) cachedCollections[activeChain]=collections;
  const list = allList.slice(0, 10); // max 10 on home
  const descs = ['Stake your NFTs and earn rewards daily.','A community-driven collection for true believers.','Explore rare digital art and earn while you hold.','Join the movement. Stake, earn, collect.','Premium NFTs with exclusive staking bonuses.','New collection with high reward potential.'];
  el.innerHTML = list.map((c,i) => {
    const recent = Math.random()>0.75;
    const desc = descs[i % descs.length];
    const hasNft = Math.random()>0.5;
    const hasReward = hasNft && Math.random()>0.4;
    const btnLabel = hasReward ? 'Claim' : hasNft ? 'Stake' : 'Buy';
    const btnClass = hasReward ? 'claim' : hasNft ? 'stake' : 'buy';
    return `<div class="trending-card coll-slide-card ${recent?'glow-stake':''}" data-coll-id="${c.id}">
      <div class="trending-img">
        <img src="${c.imageUrl}" alt="${c.name}" loading="lazy">
        ${recent?'<div class="coll-card-activity"><span class="live-dot"></span> Staking</div>':''}
        <div class="trending-name-overlay">
          <span class="trending-entries">${c.name}</span>
          <span class="trending-raffle-name">${c.totalStaked} staked</span>
        </div>
        <div class="coll-card-overlay">
          <div class="coll-overlay-name">${c.name}</div>
          <div class="coll-overlay-desc">${desc}</div>
          <button class="coll-overlay-btn ${btnClass}" onclick="event.stopPropagation();openCollection('${c.id}')">${btnLabel}</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ===== COLLECTION DETAIL =====
async function openCollection(id) {
  document.getElementById('collDetailTitle').textContent='Loading...'; goPage('collection');
  const data = await api('/collections/'+id); if(!data){toast('Failed','error');return;}
  const c=data.collection; document.getElementById('collDetailTitle').textContent=c.name+' — '+c.ticker;

  // Generate dummy hold NFTs (not staked)
  const holdNfts = Array.from({length: randBetween(2,5)}, (_,i) => ({
    id:'hold_'+i, tokenId:'hold_'+i, name:`${c.ticker} #${randBetween(1000,9999)}`,
    imageUrl:`https://picsum.photos/seed/hold${c.id}${i}/300/300`, rarity:['common','rare','epic','legendary'][randBetween(0,3)], hp:0, staked:false
  }));
  const stakedNfts = data.stakedNfts.map(n => ({...n, staked:true}));
  const allNfts = [...stakedNfts, ...holdNfts];

  // Earn bar
  const dummyBalance = randBetween(500, 8000);
  const dummyPending = randBetween(10, 500);
  const earnHtml = `<div class="coll-earn-bar">
    <div class="coll-earn-stat"><span class="coll-earn-label">Balance</span><span class="coll-earn-val">${fn(dummyBalance)} pts</span></div>
    <div class="coll-earn-stat"><span class="coll-earn-label">Pending</span><span class="coll-earn-val coll-earn-pending">${fn(dummyPending)} pts</span></div>
    <button class="coll-claim-btn" onclick="event.stopPropagation();toast('Claimed ${fn(dummyPending)} pts!','success')">Claim ${fn(dummyPending)} pts</button>
  </div>`;

  // NFT filter tabs
  const tabsHtml = `<div class="coll-nft-tabs">
    <button class="coll-nft-tab active" onclick="filterCollNfts(this,'all')">All (${allNfts.length})</button>
    <button class="coll-nft-tab" onclick="filterCollNfts(this,'staked')">Staked (${stakedNfts.length})</button>
    <button class="coll-nft-tab" onclick="filterCollNfts(this,'hold')">Hold (${holdNfts.length})</button>
  </div>`;

  function renderNftCard(n) {
    const img = (n.imageUrl && n.imageUrl.length > 5) ? n.imageUrl : 'https://picsum.photos/seed/'+n.tokenId+'/300/300';
    const rarity = n.rarity || 'common';
    const rarityLabel = rarity[0].toUpperCase() + rarity.slice(1);
    if (n.staked) {
      const d = Date.now() - new Date(n.stakedAt).getTime();
      const days = Math.floor(d/864e5), hrs = Math.floor((d%864e5)/36e5);
      return `<div class="nft-card" data-filter="staked">
        <div class="nft-card-img"><img src="${img}" alt="" loading="lazy">
          <div class="nft-card-hover"><button class="nft-hover-btn unstake" onclick="event.stopPropagation();toast('Unstaked ${n.name}','success')">Unstake</button></div>
        </div>
        <div class="nft-card-body">
          <div class="nft-card-name">${n.name}</div>
          <div class="nft-card-id">Staked · ${days}d ${hrs}h · HP ${Math.round(n.hp)}%</div>
          <span class="nft-card-rarity ${rarity}">${rarityLabel}</span>
        </div>
      </div>`;
    } else {
      return `<div class="nft-card" data-filter="hold">
        <div class="nft-card-img"><img src="${img}" alt="" loading="lazy">
          <div class="nft-card-hover"><button class="nft-hover-btn stake" onclick="event.stopPropagation();toast('Staked ${n.name}','success')">Stake</button></div>
        </div>
        <div class="nft-card-body">
          <div class="nft-card-name">${n.name}</div>
          <div class="nft-card-id">In Wallet</div>
          <span class="nft-card-rarity ${rarity}">${rarityLabel}</span>
        </div>
      </div>`;
    }
  }

  const ng = document.getElementById('collNftGrid');
  ng.innerHTML = earnHtml + tabsHtml + '<div class="nft-grid-inner" id="nftGridInner">' + allNfts.map(renderNftCard).join('') + '</div>';

  // Store for filtering
  window._collNfts = allNfts;
  window._renderNftCard = renderNftCard;

  // Leaderboard
  const lb = document.getElementById('collLeaderboard');
  let lbHtml = `<div class="coll-lb-tabs">
    <button class="coll-lb-tab active" onclick="switchCollLbTab(this,'all')">All Stakers</button>
    <button class="coll-lb-tab" onclick="switchCollLbTab(this,'my')">My Stats</button>
  </div>`;
  lbHtml += `<div class="coll-lb-panel" data-panel="all">`;
  lbHtml += data.stakers.length === 0 ? '<div style="padding:20px;text-align:center;color:var(--t3);">No stakers yet</div>' :
    data.stakers.map((s,i) => {const rc=i===0?'gold':i===1?'silver':i===2?'bronze':'';
    return `<div class="lb-item"><div class="lb-rank ${rc}">${i+1}</div><div class="lb-avatar"><img src="https://picsum.photos/seed/${s.wallet.slice(-6)}/60/60" alt=""></div><div class="lb-info"><div class="lb-addr">${shortAddr(s.wallet)}</div><div class="lb-sub">${s.nfts} NFTs</div></div><div class="lb-val">${Math.round(s.totalHp)} HP</div></div>`;}).join('');
  lbHtml += '</div>';
  lbHtml += `<div class="coll-lb-panel" data-panel="my" style="display:none;">`;
  const myCount = stakedNfts.filter(n => currentUser && n.wallet === currentUser.wallet).length;
  lbHtml += currentUser ? `<div class="coll-my-stats">
    <div class="coll-my-stat"><span class="coll-my-stat-v">${myCount}</span><span class="coll-my-stat-l">My Staked</span></div>
    <div class="coll-my-stat"><span class="coll-my-stat-v">${holdNfts.length}</span><span class="coll-my-stat-l">In Wallet</span></div>
    <div class="coll-my-stat"><span class="coll-my-stat-v">${fn(dummyPending)}</span><span class="coll-my-stat-l">Pending</span></div>
  </div>` : '<div style="padding:20px;text-align:center;color:var(--t3);">Sign in to see stats</div>';
  lbHtml += '</div>';
  lb.innerHTML = lbHtml;
}

function filterCollNfts(btn, filter) {
  btn.parentElement.querySelectorAll('.coll-nft-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const grid = document.getElementById('nftGridInner');
  if (!grid || !window._collNfts) return;
  const nfts = filter === 'all' ? window._collNfts : window._collNfts.filter(n => filter === 'staked' ? n.staked : !n.staked);
  grid.innerHTML = nfts.map(window._renderNftCard).join('');
}

// ===== COLLECTION LB TAB SWITCH =====
function switchCollLbTab(btn, panel) {
  btn.parentElement.querySelectorAll('.coll-lb-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const container = btn.closest('.side-card') || btn.closest('#collLeaderboard');
  if (!container) return;
  container.querySelectorAll('.coll-lb-panel').forEach(p => p.style.display = 'none');
  const target = container.querySelector(`.coll-lb-panel[data-panel="${panel}"]`);
  if (target) target.style.display = 'block';
}

// ===== RAFFLE DETAIL PAGE =====
let lastRafflePage = 'home'; // track where user came from
async function openRafflePage(id) {
  if(event)event.stopPropagation();
  // Remember which page user came from
  const activePage = document.querySelector('.page.active');
  if (activePage) {
    const pageId = activePage.id.replace('page-','');
    if (pageId !== 'raffledetail') lastRafflePage = pageId;
  }
  document.getElementById('raffleDetailTitle').textContent = 'Loading...';
  document.getElementById('raffleDetailContent').innerHTML = '<div style="padding:40px;text-align:center;color:var(--t3);">Loading...</div>';
  document.getElementById('raffleDetailBack').onclick = function(){ goPage(lastRafflePage); };
  goPage('raffledetail');
  const r = await api('/raffles/'+id); if(!r){toast('Failed to load raffle','error');return;}
  syncLiveRaffleState([r]);
  const pct = Math.round((r.currentEntries/r.maxEntries)*100);
  // Generate dummy participants
  const participantCount = Math.min(r.currentEntries, 12);
  let participantsHtml = '';
  for (let i = 0; i < participantCount; i++) {
    const name = DUMMY_NAMES[i % DUMMY_NAMES.length];
    const entries = randBetween(1, 5);
    participantsHtml += `<div class="raffle-participant"><div class="raffle-participant-avatar"><img src="https://picsum.photos/seed/${name.toLowerCase()}/60/60" alt=""></div><div class="raffle-participant-info"><span class="raffle-participant-name">${name}</span><span class="raffle-participant-entries">${entries} entr${entries===1?'y':'ies'}</span></div></div>`;
  }
  document.getElementById('raffleDetailTitle').textContent = r.name;
  document.getElementById('raffleDetailContent').innerHTML = `
    <div class="raffle-detail-image"><img src="${r.imageUrl}" alt="${r.name}"><div class="raffle-detail-status"><span class="live-dot"></span> LIVE</div></div>
    <div class="raffle-detail-info">
      <div class="raffle-detail-desc">${r.description || 'No description available.'}</div>
      <div class="raffle-detail-stats">
        <div class="raffle-detail-stat"><div class="raffle-detail-stat-v live-entries" data-raffle-id="${r.id}" data-format="plain">${fn(r.currentEntries)}</div><div class="raffle-detail-stat-l">Entries</div></div>
        <div class="raffle-detail-stat"><div class="raffle-detail-stat-v">${fn(r.maxEntries)}</div><div class="raffle-detail-stat-l">Max Entries</div></div>
        <div class="raffle-detail-stat"><div class="raffle-detail-stat-v">${r.price} ${r.token}</div><div class="raffle-detail-stat-l">Price / Entry</div></div>
        <div class="raffle-detail-stat"><div class="raffle-detail-stat-v live-countdown" data-ends-at="${r.endsAt}" data-value="${formatEndsInValue(r.endsAt, r.endsIn)}">${formatEndsInValue(r.endsAt, r.endsIn)}</div><div class="raffle-detail-stat-l">Ends In</div></div>
      </div>
      <div class="raffle-detail-progress">
        <div class="raffle-detail-prog-bar"><div class="raffle-detail-prog-fill live-progress-fill" data-raffle-id="${r.id}" style="width:${pct}%"></div></div>
        <div class="raffle-detail-prog-text"><span class="live-progress-pct" data-raffle-id="${r.id}">${pct}% full</span><span class="live-progress-ratio" data-raffle-id="${r.id}">${fn(r.currentEntries)} / ${fn(r.maxEntries)}</span></div>
      </div>
      <div class="raffle-detail-buy">
        <input class="raffle-buy-qty" type="number" value="1" min="1" id="raffleDetailBuyQty">
        <button class="raffle-buy-btn" onclick="buyRaffleFromPage(${r.id})">Buy Entry — ${r.price} ${r.token}</button>
      </div>
      <div class="raffle-detail-participants-section">
        <h3 class="raffle-detail-participants-title">Participants (${participantCount})</h3>
        <div class="raffle-detail-participants">${participantsHtml || '<div style="padding:16px;color:var(--t3);font-size:12px;">No participants yet</div>'}</div>
      </div>
    </div>`;
}
// Keep openRaffleModal as alias for backward compat (raffles page still uses it)
async function openRaffleModal(id) { openRafflePage(id); }
async function buyRaffleFromPage(id){if(!sessionToken){toast('Sign in first','error');return;}const q=parseInt(document.getElementById('raffleDetailBuyQty')?.value)||1;const d=await api('/raffles/'+id+'/enter',{method:'POST',body:JSON.stringify({quantity:q})});if(d?.success){toast(d.message,'success');renderTrendingRaffles();}else toast('Failed','error');}
async function buyRaffle(id){if(!sessionToken){toast('Sign in first','error');return;}const q=parseInt(document.getElementById('raffleBuyQty')?.value)||1;const d=await api('/raffles/'+id+'/enter',{method:'POST',body:JSON.stringify({quantity:q})});if(d?.success){toast(d.message,'success');closeModal();renderTrendingRaffles();}else toast('Failed','error');}
function closeModal(){document.querySelectorAll('.modal-overlay').forEach(m=>m.classList.remove('open'));}
document.addEventListener('click',e=>{if(e.target.classList.contains('modal-overlay'))closeModal();});

// ===== NOTIFICATIONS =====
function toggleNotif(){ openRightPanel('rpanelNotif'); }
function toggleSettings() {
  openRightPanel('rpanelSettings');
}
function clearNotifs(){document.getElementById('notifList').innerHTML='<div style="padding:24px;text-align:center;color:var(--t3);font-size:12px;">No notifications</div>';document.getElementById('notifDot').style.display='none';}
function renderNotifs(){const el=document.getElementById('notifList');if(!el)return;el.innerHTML=NOTIFICATIONS.map(n=>`<div class="notif-item"><div class="notif-body"><div class="notif-text">${n.text}</div><div class="notif-time">${n.time}</div></div></div>`).join('');}
function closeAllPanels(){
  const panel = document.getElementById('rightPanel');
  const handle = document.getElementById('rpanelResizeHandle');
  panel?.classList.remove('open');
  if (panel) panel.style.removeProperty('width');
  if (handle) handle.classList.remove('visible');
  document.querySelectorAll('.rpanel-section').forEach(s=>{s.classList.remove('active');s.style.display='none';});
}

// ===== LEADERBOARD V2 =====
let lbFilter = 'all';
let lbTimeFilter = 'all';
let lbCategory = 'staking'; // staking | raffles | collections | coins
let lbSearchQuery = '';
let lbRawData = []; // cached for search

const LB_CATS = [
  { k:'staking',   label:'Staking',     icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>', col1:'NFTs', col2:'Points' },
  { k:'raffles',   label:'Raffles',     icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 0 0-8 0v2"/><line x1="12" y1="11" x2="12" y2="17"/></svg>', col1:'Entries', col2:'Wins' },
  { k:'collections',label:'Collections',icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>', col1:'Staked', col2:'Stakers' },
  { k:'coins',     label:'Coins',       icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>', col1:'Volume', col2:'Change' },
];

function lbSearchFilter(q) {
  lbSearchQuery = q.toLowerCase();
  renderLbTable(lbRawData);
}

async function renderLeaderboardPage() {
  // Chain tabs
  const te = document.getElementById('lbChainTabs');
  te.innerHTML = [{k:'all',l:'All'},{k:'atom',l:'Cosmos'},{k:'megaeth',l:'MegaETH'},{k:'ethereum',l:'Ethereum'}]
    .map(t => `<button class="lb2-chain-tab ${lbFilter===t.k?'active':''}" onclick="lbFilter='${t.k}';renderLeaderboardPage()">${t.l}</button>`).join('');

  // Category tabs
  const ce = document.getElementById('lbCatTabs');
  ce.innerHTML = LB_CATS.map(c =>
    `<button class="lb2-cat-tab ${lbCategory===c.k?'active':''}" onclick="lbCategory='${c.k}';renderLeaderboardPage()">
      ${c.icon} ${c.label}
    </button>`).join('');

  // Time tabs
  const tte = document.getElementById('lbTimeTabs');
  tte.innerHTML = [{k:'all',l:'All Time'},{k:'30d',l:'30d'},{k:'7d',l:'7d'}]
    .map(t => `<button class="lb2-time-tab ${lbTimeFilter===t.k?'active':''}" onclick="lbTimeFilter='${t.k}';renderLeaderboardPage()">${t.l}</button>`).join('');

  // Show loading
  const pe = document.getElementById('lb2Podium');
  const le = document.getElementById('lbPageList');
  pe.innerHTML = '<div class="lb2-loading"><div class="lb2-spinner"></div> Loading...</div>';
  le.innerHTML = '';

  // Fetch data based on category
  let data = [];
  const cat = LB_CATS.find(c => c.k === lbCategory) || LB_CATS[0];

  if (lbCategory === 'staking') {
    data = await api('/leaderboard?chain=' + lbFilter) || [];
    data = data.map(l => ({
      id: l.wallet,
      name: l.displayName || shortAddr(l.wallet),
      avatar: l.avatar || 'https://picsum.photos/seed/' + (l.wallet||'').slice(-6) + '/80/80',
      chain: l.chain,
      col1: l.nftsStaked,
      col2: l.points,
      sub: CHAINS[l.chain]?.name || l.chain,
    }));
  } else if (lbCategory === 'raffles') {
    // Build dummy raffle leaderboard from raffle entries data
    const raffles = await api('/raffles?chain=' + (lbFilter === 'all' ? activeChain : lbFilter)) || [];
    const names = ['CryptoWhale','StarDust','MoonHunter','CosmosKing','NFTLord','DiamondHands','RocketMan','PixelMaster','ChainGuru','TokenBoss','ApeKing','DeFiWiz','MetaTrader','BlockSmith','HashPower','StakeKing','YieldFarmer','GasOptimizer','LunaRider','VaultKeeper'];
    data = names.slice(0, 15).map((name, i) => {
      const entries = Math.floor(Math.random() * 800) + 50 - i * 30;
      const wins = Math.floor(Math.random() * 8);
      return {
        id: 'raffle_' + i,
        name,
        avatar: 'https://picsum.photos/seed/rf' + i + '/80/80',
        chain: ['atom','megaeth','ethereum'][i % 3],
        col1: Math.max(10, entries),
        col2: wins,
        sub: wins + ' wins',
      };
    }).sort((a,b) => b.col1 - a.col1);
  } else if (lbCategory === 'collections') {
    const colls = await api('/collections?chain=' + (lbFilter === 'all' ? activeChain : lbFilter)) || [];
    data = colls.map((c, i) => ({
      id: c.id,
      name: c.name,
      avatar: c.imageUrl || 'https://picsum.photos/seed/' + c.id + '/80/80',
      chain: c.chain,
      col1: c.totalStaked,
      col2: c.totalStakers,
      sub: c.ticker || '',
      isCollection: true,
    })).sort((a,b) => b.col1 - a.col1);
  } else if (lbCategory === 'coins') {
    const coins = COINS_BY_CHAIN[lbFilter === 'all' ? activeChain : lbFilter] || COINS_BY_CHAIN[activeChain] || [];
    data = coins.map((c, i) => ({
      id: c.symbol,
      name: c.name,
      avatar: c.img,
      chain: lbFilter === 'all' ? activeChain : lbFilter,
      col1: c.val,
      col2: c.change,
      sub: c.symbol,
      isCoin: true,
      up: c.up,
    }));
  }

  lbRawData = data;

  // Render podium
  renderLbPodium(data.slice(0, 3), cat);

  // Render table
  renderLbTable(data);
}

function renderLbPodium(top3, cat) {
  const pe = document.getElementById('lb2Podium');
  if (!top3.length) { pe.innerHTML = ''; return; }

  // order: 2nd left, 1st center, 3rd right
  const order  = [top3[1], top3[0], top3[2]];
  const ranks  = [2, 1, 3];
  const delays = ['delay-2', 'delay-1', 'delay-3'];

  const slots = order.map((user, i) => {
    const rank = ranks[i];
    if (!user) return `<div class="lb2-podium-slot ${delays[i]}" style="width:110px;"></div>`;

    const col1 = cat.k === 'coins' ? user.col1 : fn(user.col1);
    const valStyle = cat.k === 'coins' ? (user.up ? 'color:#4ade80' : 'color:#ef4444') : '';

    return `<div class="lb2-podium-slot ${delays[i]}"
        onclick="toast('${user.name.replace(/'/g,"\\'")} — ${col1} ${cat.col1}','info')">
      <div class="lb2-ps-avatar-wrap">
        <img class="lb2-ps-avatar rank-${rank}" src="${user.avatar}"
          alt="" onerror="this.src='https://picsum.photos/seed/pe${i}/80/80'">
        <div class="lb2-ps-badge rank-${rank}">${rank}</div>
      </div>
      <div class="lb2-ps-name">${user.name}</div>
      <div class="lb2-ps-val" style="${valStyle}">${col1}</div>
      <div class="lb2-ps-bar rank-${rank}">
        <span class="lb2-ps-bar-num">${rank}</span>
      </div>
    </div>`;
  });

  pe.innerHTML = `
    <div class="lb2-podium-row">${slots.join('')}</div>
    <div class="lb2-podium-ground"></div>
  `;
}

function renderLbTable(data) {
  const le = document.getElementById('lbPageList');
  const cat = LB_CATS.find(c => c.k === lbCategory) || LB_CATS[0];

  // Filter by search
  let filtered = lbSearchQuery
    ? data.filter(d => d.name.toLowerCase().includes(lbSearchQuery))
    : data;

  if (!filtered.length) {
    le.innerHTML = '<div class="lb2-empty">No results found</div>';
    return;
  }

  const chainBadge = (item) => {
    if (lbFilter !== 'all') return '';
    const ci = CHAINS[item.chain] || {};
    return `<span class="chain-indicator ${item.chain}">${ci.symbol || item.chain}</span>`;
  };

  const col2Display = (item) => {
    if (cat.k === 'coins') return `<span style="${item.up ? 'color:#4ade80' : 'color:#ef4444'}">${item.col2}</span>`;
    return fn(item.col2);
  };

  const col1Display = (item) => {
    if (cat.k === 'coins') return item.col1;
    return fn(item.col1);
  };

  let html = `
    <div class="lb2-thead">
      <span class="lb2-th lb2-th-rank">#</span>
      <span class="lb2-th lb2-th-user">User</span>
      <span class="lb2-th lb2-th-extra">${cat.col1}</span>
      <span class="lb2-th lb2-th-pts">${cat.col2}</span>
    </div>
    <div class="lb2-rows">`;

  html += filtered.map((item, i) => {
    const rank = i + 1;
    const rankClass = rank === 1 ? 'lb2-row-gold' : rank === 2 ? 'lb2-row-silver' : rank === 3 ? 'lb2-row-bronze' : '';
    const rankDisplay = rank <= 3
      ? `<span style="font-size:16px;">${['🥇','🥈','🥉'][rank-1]}</span>`
      : rank;
    const delay = Math.min(i * 35, 500);
    return `<div class="lb2-row ${rankClass}" style="animation-delay:${delay}ms" onclick="toast('${item.name.replace(/'/g,"\\'")} — ${col1Display(item)} ${cat.col1}','info')">
      <span class="lb2-td-rank">${rankDisplay}</span>
      <span class="lb2-td-user">
        <img class="lb2-row-avatar" src="${item.avatar}" alt="" onerror="this.src='https://picsum.photos/seed/err${i}/80/80'">
        <span>
          <div class="lb2-row-name">${item.name}${chainBadge(item)}</div>
          ${item.sub ? `<div class="lb2-row-sub">${item.sub}</div>` : ''}
        </span>
      </span>
      <span class="lb2-td-extra">${col1Display(item)}</span>
      <span class="lb2-td-pts">${col2Display(item)}</span>
    </div>`;
  }).join('');

  html += '</div>';
  le.innerHTML = html;
}

// ===== RAFFLES PAGE =====
let raffleTokenFilter='all';
async function renderRafflesPage(){
  const coins=getCoins(),fe=document.getElementById('raffleCoinFilters');
  fe.innerHTML=`<div class="ticker-track" style="gap:8px;"><div class="ticker-item ${raffleTokenFilter==='all'?'ticker-item-active':''}" style="min-width:60px;cursor:pointer;" onclick="raffleTokenFilter='all';renderRafflesPage()"><span class="ticker-symbol" style="font-size:12px;">All</span></div>`+coins.map(c=>`<div class="ticker-item ${raffleTokenFilter===c.symbol?'ticker-item-active':''}" style="min-width:auto;cursor:pointer;" onclick="raffleTokenFilter='${c.symbol}';renderRafflesPage()"><div class="ticker-avatar" style="width:24px;height:24px;"><img src="${c.img}" alt=""></div><span class="ticker-symbol" style="font-size:12px;">${c.symbol}</span></div>`).join('')+`</div>`;
  const raffles=await api('/raffles?chain='+activeChain);let list=raffles||cachedRaffles[activeChain]||[];if(raffles)cachedRaffles[activeChain]=raffles;
  syncLiveRaffleState(list);
  let filtered=raffleTokenFilter==='all'?list:list.filter(r=>r.token===raffleTokenFilter);
  const ge=document.getElementById('rafflesPageGrid');
  if(!filtered.length){ge.innerHTML='<div style="text-align:center;padding:40px;color:var(--t3);">No raffles</div>';return;}
  filtered = filtered.slice(0, 8); // fixed 4x2 cards for this page
  ge.innerHTML=filtered.map(r=>{
    return `<div class="trending-card" onclick="openRafflePage(${r.id})">
      <div class="trending-img"><img src="${r.imageUrl}" alt="" loading="lazy">
        <div class="trending-name-overlay"><span class="trending-entries"><span class="live-entries" data-raffle-id="${r.id}" data-format="entries">${fn(r.currentEntries)}</span> Entries</span><span class="trending-raffle-name">${r.name} <span class="trending-token">${r.token}</span></span></div>
        <div class="coll-card-overlay"><div class="coll-overlay-name">${r.name}</div><div class="coll-overlay-desc">${r.description||''}</div><button class="coll-overlay-btn stake" onclick="event.stopPropagation();openRafflePage(${r.id})">Enter Raffle</button></div>
      </div>
      <div class="trending-bottom"><span class="trending-live-dot"></span> ${r.endsIn==='Ended'?'Ended':'LIVE · End in '}<span class="live-countdown" data-ends-at="${r.endsAt}" data-value="${formatEndsInValue(r.endsAt, r.endsIn)}">${formatEndsInValue(r.endsAt, r.endsIn)}</span></div>
    </div>`;
  }).join('');
}

// ===== ALL COLLECTIONS =====
async function renderAllCollectionsPage(){
  const ci=CHAINS[activeChain]||{};document.getElementById('collPageChain').textContent=ci.name||'';
  const collections=await api('/collections?chain='+activeChain);const list=collections||cachedCollections[activeChain]||[];if(collections)cachedCollections[activeChain]=collections;
  const descs = ['Stake your NFTs and earn rewards daily. A growing community of collectors.','A community-driven collection for true believers and diamond hands.','Explore rare digital art and earn while you hold. Adventure awaits.','Join the movement. Stake, earn, collect. Built for the community.','Premium NFTs with exclusive staking bonuses and high rewards.','New collection with high reward potential. Early stakers earn more.'];
  const sym = ci.symbol||'TOKEN';
  document.getElementById('allCollGrid').innerHTML=list.slice(0, 8).map((c,i)=>{
    const desc = descs[i % descs.length];
    const hasNft = Math.random()>0.5;
    const hasReward = hasNft && Math.random()>0.4;
    const btnLabel = hasReward ? 'Claim' : hasNft ? 'Stake' : 'Buy';
    const btnClass = hasReward ? 'claim' : hasNft ? 'stake' : 'buy';
    return `<div class="trending-card">
      <div class="trending-img"><img src="${c.imageUrl}" alt="${c.name}" loading="lazy">
        <div class="trending-name-overlay"><span class="trending-entries">${c.name}</span><span class="trending-raffle-name">${c.totalStaked} staked</span></div>
        <div class="coll-card-overlay"><div class="coll-overlay-name">${c.name}</div><div class="coll-overlay-desc">${desc}</div><button class="coll-overlay-btn ${btnClass}" onclick="event.stopPropagation();openCollection('${c.id}')">${btnLabel}</button></div>
      </div>
    </div>`;
  }).join('');
}

// ===== CHAIN PANEL (right sidebar) =====
function toggleChainPanel() {
  openRightPanel('rpanelChain');
}
function selectChainFromPanel(chain) {
  selectChain(chain);
  // Update panel checkmarks
  ['atom','megaeth','ethereum'].forEach(c => {
    const el = document.getElementById('rcheck-'+c);
    if(el) el.style.display = c===chain ? '' : 'none';
    document.querySelector(`.rpanel-chain-opt[data-chain="${c}"]`)?.classList.toggle('active', c===chain);
  });
  closeAllPanels();
}

// ===== PROFILE PANEL =====
function toggleProfilePanel() {
  renderProfilePanel();
  openRightPanel('rpanelProfile');
}
function renderProfilePanel() {
  const body = document.getElementById('rpanelProfileBody');
  if (!currentUser) {
    body.innerHTML = `<div style="text-align:center;padding:40px 20px;">
      <div style="font-size:15px;color:var(--t2);margin-bottom:16px;">Connect your wallet to view profile</div>
      <button class="coll-overlay-btn stake" onclick="demoLogin();renderProfilePanel();" style="width:100%;">Connect Wallet</button>
    </div>`;
    return;
  }
  const dummyBalance = randBetween(500, 8000);
  const dummyStaked = randBetween(3, 20);
  const dummyEarned = randBetween(1000, 15000);
  body.innerHTML = `<div class="rpanel-profile-card">
    <div class="rpanel-profile-avatar"><img src="https://picsum.photos/seed/${currentUser.wallet.slice(-6)}/120/120" alt=""></div>
    <div class="rpanel-profile-wallet">${currentUser.wallet}</div>
    <div class="rpanel-profile-stats">
      <div class="rpanel-profile-stat"><span class="rpanel-profile-stat-l">Chain</span><span class="rpanel-profile-stat-v">${CHAINS[activeChain]?.name || activeChain}</span></div>
      <div class="rpanel-profile-stat"><span class="rpanel-profile-stat-l">Balance</span><span class="rpanel-profile-stat-v">${fn(dummyBalance)} pts</span></div>
      <div class="rpanel-profile-stat"><span class="rpanel-profile-stat-l">NFTs Staked</span><span class="rpanel-profile-stat-v">${dummyStaked}</span></div>
      <div class="rpanel-profile-stat"><span class="rpanel-profile-stat-l">Total Earned</span><span class="rpanel-profile-stat-v">${fn(dummyEarned)} pts</span></div>
    </div>
    <button class="rpanel-disconnect-btn" onclick="logout();renderProfilePanel();">Disconnect</button>
  </div>`;
}

// ===== RIGHT PANEL HELPER =====
function openRightPanel(sectionId) {
  const panel = document.getElementById('rightPanel');
  const handle = document.getElementById('rpanelResizeHandle');
  const target = document.getElementById(sectionId);
  // If same panel is open, close it
  if (panel.classList.contains('open') && target.classList.contains('active')) {
    closeAllPanels(); return;
  }
  // Hide all sections, show target
  document.querySelectorAll('.rpanel-section').forEach(s => { s.classList.remove('active'); s.style.display = 'none'; });
  target.classList.add('active'); target.style.display = 'flex';
  panel.classList.add('open');
  if (handle) handle.classList.add('visible');
  // Restore saved width
  const savedW = localStorage.getItem('rebel-panel-width');
  if (savedW) {
    const w = Math.min(520, Math.max(240, parseInt(savedW, 10) || 300));
    panel.style.width = w + 'px';
  }
}

// ===== CHAIN SELECTOR (old dropdown — now redirects to panel) =====
function toggleChainDropdown() { toggleChainPanel(); }
function selectChain(chain){
  activeChain=chain;selectedTickerCoin='all';const info=CHAINS[chain];document.getElementById('chainBtnLabel').textContent=info.symbol;
  const im={atom:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="1.5"><circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>',megaeth:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',ethereum:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="1.5"><path d="M12 1.5l-7 10.17L12 15l7-3.33L12 1.5z"/><path d="M5 11.67L12 22.5l7-10.83L12 15l-7-3.33z"/></svg>'};
  document.getElementById('chainBtnIcon').innerHTML=im[chain]||im.atom;
  document.getElementById('chainBtnIcon').setAttribute('data-chain', chain);
  ['atom','megaeth','ethereum'].forEach(c=>{document.getElementById('check-'+c).style.display=c===chain?'':'none';document.querySelector(`.chain-option[data-chain="${c}"]`)?.classList.toggle('active',c===chain);});
  document.getElementById('chainSelector').classList.remove('open');
  renderTicker();renderTrendingRaffles();renderCollectionGrid();
  if(document.getElementById('page-topcoins').classList.contains('active'))renderCoinsListFull();
  if(document.getElementById('page-leaderboard').classList.contains('active'))renderLeaderboardPage();
  if(document.getElementById('page-raffles').classList.contains('active')){raffleTokenFilter='all';renderRafflesPage();}
  if(document.getElementById('page-allcollections').classList.contains('active'))renderAllCollectionsPage();
  if(document.getElementById('page-collection').classList.contains('active'))goPage('home');
}

// ============================================================
// ===== LIVE ACTIVITY FEED + TICKER GLOW ON CLAIM ============
// ============================================================

let tickerResetTimer = null;

function glowTickerItem(symbol, claimAmount) {
  const item = document.querySelector(`.ticker-item[data-symbol="${symbol}"]`);
  if (!item) return;

  // 1. Glow + shake
  item.classList.remove('glow-claim');
  void item.offsetWidth;
  item.classList.add('glow-claim');
  setTimeout(() => item.classList.remove('glow-claim'), 2200);

  // 1b. Pulse + scroll into view (balap) — only if ticker visible
  item.classList.remove('race-front'); void item.offsetWidth; item.classList.add('race-front');
  const tickerRect = item.closest('.ticker-track')?.getBoundingClientRect();
  if (tickerRect && tickerRect.top < window.innerHeight && tickerRect.bottom > 0) {
    item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
  setTimeout(() => item.classList.remove('race-front'), 600);

  // 1c. Auto-reset to start after 3s idle — only if ticker is visible
  clearTimeout(tickerResetTimer);
  tickerResetTimer = setTimeout(() => {
    const track = document.getElementById('tickerTrack');
    if (track) {
      const rect = track.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible) track.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, 3000);

  // 2. Bump the value up (simulate circulation increase)
  const valEl = item.querySelector('.ticker-val');
  if (valEl) {
    let raw = parseFloat(valEl.dataset.raw) || 0;
    raw += claimAmount * (0.8 + Math.random() * 0.4); // price impact
    valEl.dataset.raw = raw;
    valEl.textContent = fmtVal(raw);
    valEl.classList.remove('bump');
    void valEl.offsetWidth;
    valEl.classList.add('bump');
    setTimeout(() => valEl.classList.remove('bump'), 500);

    // Also update the source data so it persists
    const coins = getCoins();
    const coin = coins.find(c => c.symbol === symbol);
    if (coin) { coin.rawVal = raw; coin.val = fmtVal(raw); }
  }

  // 3. Show floating claim amount — inside card, follows scroll
  const existingFloat = item.querySelector('.ticker-claim-float');
  if (existingFloat) existingFloat.remove();
  const float = document.createElement('div');
  float.className = 'ticker-claim-float';
  float.textContent = '+' + fn(claimAmount) + ' ' + symbol;
  item.appendChild(float);
  setTimeout(() => float.remove(), 2300);
}

function glowRandomCard() {
  const cards = document.querySelectorAll('.coll-card');
  if (!cards.length) return;
  const card = cards[Math.floor(Math.random() * cards.length)];
  // Glow
  card.classList.remove('glow-stake'); void card.offsetWidth; card.classList.add('glow-stake');
  // Shake
  card.classList.remove('shake-stake'); void card.offsetWidth; card.classList.add('shake-stake');
  setTimeout(() => card.classList.remove('shake-stake'), 500);
  const existing = card.querySelector('.coll-card-activity');
  if (!existing) {
    const badge = document.createElement('div');
    badge.className = 'coll-card-activity';
    badge.innerHTML = '<span class="live-dot"></span> Staking';
    card.querySelector('.coll-card-img')?.appendChild(badge);
    setTimeout(() => badge.remove(), 3000);
  }
}

// ===== BACKGROUND EFFECTS (no popup, just glow/shake) =====
function startBackgroundEffects() {
  function doEffect() {
    const roll = Math.random();
    if (roll < 0.4) {
      // Ticker glow — random coin claim
      const coins = getCoins();
      const c = pickRandom(coins);
      if (c) glowTickerItem(c.symbol, randBetween(50, 800));
    } else if (roll < 0.7) {
      // Collection card glow + shake
      glowRandomCard();
    } else {
      // Raffle card shake + entry float
      const trendCards = document.querySelectorAll('.trending-card');
      const gridCards = document.querySelectorAll('.raffle-grid-card');
      const allCards = [...trendCards, ...gridCards];
      if (allCards.length) {
        const card = pickRandom(allCards);
        card.classList.remove('shake-buy'); void card.offsetWidth; card.classList.add('shake-buy');
        setTimeout(() => card.classList.remove('shake-buy'), 500);
        const imgWrap = card.querySelector('.trending-img') || card.querySelector('.raffle-grid-card-img');
        if (imgWrap && !imgWrap.querySelector('.raffle-entry-float')) {
          const float = document.createElement('div');
          float.className = 'raffle-entry-float';
          float.textContent = '+' + randBetween(1, 5);
          imgWrap.appendChild(float);
          setTimeout(() => float.remove(), 1900);
        }
      }
    }
    // Next effect — 5-10 seconds, no bursts
    setTimeout(doEffect, randBetween(5000, 10000));
  }
  setTimeout(doEffect, 3000);
}

// ===== THEME TOGGLE =====
function toggleTheme() {
  const themes = ['dark','system','light'];
  const current = document.documentElement.getAttribute('data-theme') || 'system';
  const next = themes[(themes.indexOf(current) + 1) % themes.length];
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('rebel-theme', next);
}

// ===== RESIZABLE RIGHT PANEL =====
function initResizeHandle() {
  const handle = document.getElementById('rpanelResizeHandle');
  const panel = document.getElementById('rightPanel');
  if (!handle || !panel) return;

  const MIN_W = 240;
  const MAX_W = 520;

  handle.addEventListener('mousedown', function(e) {
    e.preventDefault();
    handle.classList.add('dragging');
    panel.classList.add('resizing');

    const startX = e.clientX;
    const startW = panel.offsetWidth;

    function onMove(ev) {
      const delta = startX - ev.clientX; // dragging left = wider
      const newW = Math.min(MAX_W, Math.max(MIN_W, startW + delta));
      panel.style.width = newW + 'px';
    }

    function onUp() {
      handle.classList.remove('dragging');
      panel.classList.remove('resizing');
      localStorage.setItem('rebel-panel-width', panel.offsetWidth);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  // Double-click to reset to default width
  handle.addEventListener('dblclick', function() {
    panel.style.width = '300px';
    localStorage.removeItem('rebel-panel-width');
  });
}

function setSetting(type, val, btn) {
  if (btn) {
    btn.closest('.settings-options').querySelectorAll('.settings-opt').forEach(o => o.classList.remove('active'));
    btn.classList.add('active');
  }
  if (type === 'theme') document.documentElement.setAttribute('data-theme', val);
  if (type === 'corners') {} // handled by radius slider now
  if (type === 'font') {} // handled by setFont
  if (type === 'density') document.documentElement.setAttribute('data-density', val);
  if (type === 'anim') document.documentElement.setAttribute('data-anim', val);
  if (type === 'bgtype') {} // handled by toggleGradientUI
  if (type === 'pattern') applyPattern();
}

function setFont(fontKey, btn) {
  document.querySelectorAll('.settings-font-opt').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.documentElement.setAttribute('data-font', fontKey);
  localStorage.setItem('rebel-font', fontKey);
}

function setRadius(val) {
  const v = parseInt(val);
  document.documentElement.style.setProperty('--radius', v + 'px');
  document.documentElement.style.setProperty('--radius-sm', Math.max(0, v - 4) + 'px');
  document.documentElement.style.setProperty('--radius-lg', Math.min(24, v + 4) + 'px');
  // Logo icon rx: scale 0–24px slider → 0–122 SVG units
  const logoRx = Math.round((v / 24) * 122);
  document.documentElement.style.setProperty('--logo-rx', logoRx);
  const badge = document.getElementById('radiusVal');
  if (badge) badge.textContent = v + 'px';
}

function setFontSize(val) {
  const safeVal = Math.min(20, Math.max(10, parseInt(val, 10) || 15));
  // Convert px to rem ratio — base is 16px
  const rem = (safeVal / 16).toFixed(4);
  document.documentElement.style.setProperty('--fs', rem + 'rem');
  document.documentElement.style.setProperty('--font-size-base', safeVal + 'px');
  const badge = document.getElementById('fontSizeVal');
  if (badge) badge.textContent = safeVal + 'px';
}

function setLetterSpacing(val) {
  const safeVal = Math.min(3, Math.max(-1, parseFloat(val) || 0));
  document.documentElement.style.setProperty('--letter-spacing', safeVal + 'px');
  document.body.style.letterSpacing = safeVal + 'px';
  const badge = document.getElementById('letterSpacingVal');
  if (badge) badge.textContent = safeVal + 'px';
}

function setAccentColor(color, swatchEl, isCustom) {
  if (!color || !/^#[0-9a-fA-F]{3,6}$/.test(color)) return;
  // Darken for accent-d
  const darken = (hex) => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return '#' + [Math.max(0,r-20), Math.max(0,g-20), Math.max(0,b-20)].map(v=>v.toString(16).padStart(2,'0')).join('');
  };
  document.documentElement.style.setProperty('--accent', color);
  document.documentElement.style.setProperty('--accent-d', darken(color));
  // Sync logo hue-rotate to match accent color
  const r = parseInt(color.slice(1,3),16), g = parseInt(color.slice(3,5),16), b = parseInt(color.slice(5,7),16);
  const hue = Math.round(Math.atan2(Math.sqrt(3)*(g-b), 2*r-g-b) * 180 / Math.PI + 360) % 360;
  // sepia base is ~30deg, so offset by subtracting 30
  const logoHue = (hue - 30 + 360) % 360;
  document.documentElement.style.setProperty('--logo-hue', logoHue + 'deg');
  document.querySelectorAll('.accent-swatch').forEach(s => s.classList.toggle('active', s.dataset.color === color.toLowerCase()));
  if (swatchEl) swatchEl.classList.add('active');
  const hexInput = document.getElementById('accentColorHex');
  if (hexInput) hexInput.value = color;
  const preview = document.getElementById('accentColorPreview');
  if (preview) preview.value = color;
  const custom = document.getElementById('accentCustom');
  if (custom) custom.value = color;
  localStorage.setItem('rebel-accent', color);
}

async function pickAccentFromScreen() {
  try {
    if ('EyeDropper' in window) {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      if (result?.sRGBHex) {
        setAccentColor(result.sRGBHex, null, true);
        return;
      }
    }
    // Fallback for browsers without EyeDropper support.
    document.getElementById('accentColorPreview')?.click();
  } catch (_) {
    // User may cancel eyedropper; no action needed.
  }
}

async function pickColorFromScreen(applyColor, fallbackInputId) {
  try {
    if ('EyeDropper' in window) {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      if (result?.sRGBHex) {
        applyColor(result.sRGBHex);
        return;
      }
    }
    document.getElementById(fallbackInputId)?.click();
  } catch (_) {
    // User cancel is expected.
  }
}
async function pickBgFromScreen() { await pickColorFromScreen(setCustomBg, 'colorPreview'); }
async function pickCardFromScreen() { await pickColorFromScreen(setCardColor, 'cardColorPreview'); }
async function pickSidebarFromScreen() { await pickColorFromScreen(setSidebarColor, 'sidebarColorPreview'); }

function setCardColor(color) {
  if (!color || color.length < 4) return;
  document.documentElement.style.setProperty('--bg-s', color);
  document.documentElement.style.setProperty('--bg-hover', color);
  const hexInput = document.getElementById('cardColorHex');
  if (hexInput) hexInput.value = color;
  const picker = document.getElementById('cardColorPreview');
  if (picker) picker.value = color;
}

// Discord-style gradient presets
const GRADIENT_PRESETS = [
  { name:'Midnight', c1:'#0f0c29', c2:'#302b63', dir:'135deg' },
  { name:'Ocean', c1:'#0575e6', c2:'#021b79', dir:'135deg' },
  { name:'Sunset', c1:'#f7971e', c2:'#ffd200', dir:'135deg' },
  { name:'Rose', c1:'#f953c6', c2:'#b91d73', dir:'135deg' },
  { name:'Forest', c1:'#134e5e', c2:'#71b280', dir:'135deg' },
  { name:'Candy', c1:'#d3959b', c2:'#bfe6ba', dir:'135deg' },
  { name:'Cosmic', c1:'#2c3e50', c2:'#4ca1af', dir:'135deg' },
  { name:'Ember', c1:'#eb3349', c2:'#f45c43', dir:'135deg' },
  { name:'Aurora', c1:'#00c3ff', c2:'#ffff1c', dir:'135deg' },
  { name:'Void', c1:'#200122', c2:'#6f0000', dir:'135deg' },
  { name:'Mint', c1:'#00b09b', c2:'#96c93d', dir:'135deg' },
  { name:'Dusk', c1:'#2c3e50', c2:'#fd746c', dir:'135deg' },
];

function initCardGradPresets() {
  const grid = document.getElementById('cardGradPresets');
  if (!grid) return;
  grid.innerHTML = GRADIENT_PRESETS.map((p, i) => `
    <div class="gradient-preset-swatch" 
      style="background:linear-gradient(${p.dir},${p.c1},${p.c2})"
      onclick="applyCardGradPreset(${i})"
      title="${p.name}">
      <span>${p.name}</span>
    </div>`).join('');
}

function applyCardGradPreset(i) {
  const p = GRADIENT_PRESETS[i];
  document.getElementById('cardGradColor1').value = p.c1;
  document.getElementById('cardGradColor2').value = p.c2;
  document.getElementById('cardGradDirection').value = p.dir;
  document.querySelectorAll('.gradient-preset-swatch').forEach((s, idx) =>
    s.classList.toggle('active', idx === i));
  updateCardGradient();
}

function updateCardGradient() {
  const c1 = document.getElementById('cardGradColor1')?.value || '#222226';
  const c2 = document.getElementById('cardGradColor2')?.value || '#2d1b69';
  const dir = document.getElementById('cardGradDirection')?.value || '135deg';
  const grad = `linear-gradient(${dir}, ${c1}, ${c2})`;
  document.documentElement.style.setProperty('--bg-s', grad);
  document.documentElement.style.setProperty('--bg-hover', grad);
  const preview = document.getElementById('cardGradientPreview');
  if (preview) preview.style.background = grad;
  localStorage.setItem('rebel-card-gradient', JSON.stringify({c1, c2, dir}));
}

function toggleCardGradientUI(showGrad) {
  const solid = document.getElementById('cardSolidPicker');
  const grad = document.getElementById('cardGradientPicker');
  if (solid) solid.style.display = showGrad ? 'none' : 'block';
  if (grad) {
    grad.style.display = showGrad ? 'block' : 'none';
    if (showGrad) initCardGradPresets();
  }
}

function resetCardColor() {
  document.documentElement.style.removeProperty('--bg-s');
  const theme = document.documentElement.getAttribute('data-theme') || 'system';
  const defaults = { dark:'#111114', system:'#222226', light:'#f8f8fa' };
  const def = defaults[theme] || '#222226';
  const picker = document.getElementById('cardColorPreview');
  const hexInput = document.getElementById('cardColorHex');
  if (picker) picker.value = def;
  if (hexInput) hexInput.value = def;
  localStorage.removeItem('rebel-card-color');
}

function setGlass(on) {
  document.documentElement.setAttribute('data-glass', on ? 'on' : 'off');
}

function setBlur(val) {
  const safeVal = Math.min(32, Math.max(4, parseInt(val, 10) || 12));
  document.documentElement.style.setProperty('--blur-intensity', safeVal + 'px');
  const badge = document.getElementById('blurVal');
  if (badge) badge.textContent = safeVal + 'px';
}

function setCardBorder(on) {
  document.documentElement.setAttribute('data-card-border', on ? 'on' : 'off');
}

function setSidebarColor(color) {
  if (!color || color.length < 4) return;
  document.querySelector('.sidebar').style.background = color;
  const hexInput = document.getElementById('sidebarColorHex');
  if (hexInput) hexInput.value = color;
  const picker = document.getElementById('sidebarColorPreview');
  if (picker) picker.value = color;
}

function resetSidebarColor() {
  document.querySelector('.sidebar').style.background = '';
  localStorage.removeItem('rebel-sidebar-color');
  const theme = document.documentElement.getAttribute('data-theme') || 'system';
  const defaults = { dark:'#09090b', system:'#1a1a1e', light:'#ffffff' };
  const def = defaults[theme] || '#1a1a1e';
  const picker = document.getElementById('sidebarColorPreview');
  const hexInput = document.getElementById('sidebarColorHex');
  if (picker) picker.value = def;
  if (hexInput) hexInput.value = def;
}

function setCompactNav(on) {
  document.documentElement.setAttribute('data-compact-nav', on ? 'on' : 'off');
}

function setTickerSpeed(val) {
  const safeVal = Math.min(5, Math.max(1, parseInt(val, 10) || 3));
  const labels = ['', 'Very Slow', 'Slow', 'Normal', 'Fast', 'Very Fast'];
  const badge = document.getElementById('tickerSpeedVal');
  if (badge) badge.textContent = labels[safeVal] || 'Normal';
  // Adjust background effects interval
  window._tickerSpeedVal = safeVal;
}

function setPageTrans(on) {
  document.documentElement.setAttribute('data-page-trans', on ? 'on' : 'off');
}

function setHoverFx(on) {
  document.documentElement.setAttribute('data-hover-fx', on ? 'on' : 'off');
}

function setGlowFx(on) {
  document.documentElement.setAttribute('data-glow-fx', on ? 'on' : 'off');
}

function toggleAccordion(btn) {
  const body = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  btn.classList.toggle('open', !isOpen);
  body.style.display = isOpen ? 'none' : 'block';
}

function setPattern(on) {
  const opts = document.getElementById('patternOptions');
  if (opts) opts.style.display = on ? 'block' : 'none';
  if (!on) {
    document.documentElement.removeAttribute('data-pattern');
  } else {
    applyPattern();
  }
}

function applyPattern() {
  const active = document.querySelector('[data-setting="pattern"].active');
  if (active) document.documentElement.setAttribute('data-pattern', active.dataset.val);
}

function toggleGradientUI(showGrad) {
  const solid = document.getElementById('solidColorPicker');
  const grad = document.getElementById('gradientColorPicker');
  if (solid) solid.style.display = showGrad ? 'none' : 'block';
  if (grad) grad.style.display = showGrad ? 'block' : 'none';
}

function updateGradient() {
  const c1 = document.getElementById('gradColor1')?.value || '#1a1a1e';
  const c2 = document.getElementById('gradColor2')?.value || '#2d1b69';
  const dir = document.getElementById('gradDirection')?.value || '135deg';
  const grad = `linear-gradient(${dir}, ${c1}, ${c2})`;
  document.body.style.background = grad;
  const preview = document.getElementById('gradientPreview');
  if (preview) preview.style.background = grad;
  localStorage.setItem('rebel-gradient', JSON.stringify({c1, c2, dir}));
}

function saveSettings() {
  const theme = document.querySelector('[data-setting="theme"].active')?.dataset.val || 'system';
  localStorage.setItem('rebel-theme', theme);
  const font = document.querySelector('.settings-font-opt.active')?.dataset.font || 'inter';
  localStorage.setItem('rebel-font', font);
  const density = document.querySelector('[data-setting="density"].active')?.dataset.val || 'normal';
  localStorage.setItem('rebel-density', density);
  const anim = document.querySelector('[data-setting="anim"].active')?.dataset.val || 'normal';
  localStorage.setItem('rebel-anim', anim);
  const radius = document.getElementById('radiusSlider')?.value || '8';
  localStorage.setItem('rebel-radius', radius);
  const fontSize = document.getElementById('fontSizeSlider')?.value || '15';
  localStorage.setItem('rebel-fontsize', fontSize);
  const ls = document.getElementById('letterSpacingSlider')?.value || '0';
  localStorage.setItem('rebel-letterspacing', ls);
  const customBg = document.getElementById('bgColorHex')?.value;
  if (customBg) localStorage.setItem('rebel-custom-bg', customBg);
  const cardColor = document.getElementById('cardColorPreview')?.value;
  if (cardColor) localStorage.setItem('rebel-card-color', cardColor);
  const glass = document.getElementById('glassToggle')?.checked;
  localStorage.setItem('rebel-glass', glass ? 'on' : 'off');
  const blur = document.getElementById('blurSlider')?.value || '12';
  localStorage.setItem('rebel-blur', blur);
  const cardBorder = document.getElementById('cardBorderToggle')?.checked !== false;
  localStorage.setItem('rebel-card-border', cardBorder ? 'on' : 'off');
  const patternOn = document.getElementById('patternToggle')?.checked;
  localStorage.setItem('rebel-pattern-on', patternOn ? 'on' : 'off');
  const patternType = document.querySelector('[data-setting="pattern"].active')?.dataset.val || 'dots';
  localStorage.setItem('rebel-pattern', patternType);
  const bgtype = document.querySelector('[data-setting="bgtype"].active')?.dataset.val || 'solid';
  localStorage.setItem('rebel-bgtype', bgtype);
  const sidebarColor = document.querySelector('.sidebar')?.style.background;
  if (sidebarColor) localStorage.setItem('rebel-sidebar-color', sidebarColor);
  const compactNav = document.getElementById('compactNavToggle')?.checked;
  localStorage.setItem('rebel-compact-nav', compactNav ? 'on' : 'off');
  const tickerSpeed = document.getElementById('tickerSpeedSlider')?.value || '3';
  localStorage.setItem('rebel-ticker-speed', tickerSpeed);
  const pageTrans = document.getElementById('pageTransToggle')?.checked !== false;
  localStorage.setItem('rebel-page-trans', pageTrans ? 'on' : 'off');
  const hoverFx = document.getElementById('hoverFxToggle')?.checked !== false;
  localStorage.setItem('rebel-hover-fx', hoverFx ? 'on' : 'off');
  const glowFx = document.getElementById('glowFxToggle')?.checked !== false;
  localStorage.setItem('rebel-glow-fx', glowFx ? 'on' : 'off');
  toast('Settings saved', 'success');
}

function exportSettings() {
  const keys = ['rebel-theme','rebel-font','rebel-density','rebel-anim','rebel-radius','rebel-fontsize',
    'rebel-letterspacing','rebel-custom-bg','rebel-card-color','rebel-glass','rebel-pattern-on',
    'rebel-pattern','rebel-bgtype','rebel-accent','rebel-gradient'];
  const data = {};
  keys.forEach(k => { const v = localStorage.getItem(k); if (v) data[k] = v; });
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'rebel-settings.json';
  a.click();
  toast('Settings exported', 'success');
}

function importSettings(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v));
      restoreSettings();
      toast('Settings imported', 'success');
    } catch { toast('Invalid settings file', 'error'); }
  };
  reader.readAsText(file);
}

function resetAllSettings() {
  const keys = ['rebel-theme','rebel-font','rebel-density','rebel-anim','rebel-radius','rebel-fontsize',
    'rebel-letterspacing','rebel-custom-bg','rebel-card-color','rebel-glass','rebel-blur','rebel-card-border',
    'rebel-pattern-on','rebel-pattern','rebel-bgtype','rebel-accent','rebel-gradient',
    'rebel-sidebar-color','rebel-compact-nav','rebel-ticker-speed','rebel-page-trans',
    'rebel-hover-fx','rebel-glow-fx'];
  keys.forEach(k => localStorage.removeItem(k));
  ['--bg','--bg-s','--accent','--accent-d','--radius','--radius-sm','--radius-lg','--blur-intensity'].forEach(v =>
    document.documentElement.style.removeProperty(v));
  document.body.style.fontSize = '';
  document.body.style.letterSpacing = '';
  document.body.style.background = '';
  const sb = document.querySelector('.sidebar');
  if (sb) sb.style.background = '';
  restoreSettings();
  toast('Settings reset to defaults', 'success');
}

// ===== PRESETS =====
function loadPresets() {
  const presets = JSON.parse(localStorage.getItem('rebel-presets') || '[]');
  const container = document.getElementById('settingsPresets');
  if (!container) return;
  if (presets.length === 0) {
    container.innerHTML = '<span style="font-size:12px;color:var(--t3)">No saved presets yet</span>';
    return;
  }
  container.innerHTML = presets.map((p, i) => `
    <div class="settings-preset-chip" onclick="loadPreset(${i})">
      ${p.name}
      <span class="preset-del" onclick="event.stopPropagation();deletePreset(${i})">×</span>
    </div>`).join('');
}

function savePreset() {
  const name = document.getElementById('presetNameInput')?.value.trim();
  if (!name) { toast('Enter a preset name', 'error'); return; }
  const keys = ['rebel-theme','rebel-font','rebel-density','rebel-anim','rebel-radius','rebel-fontsize',
    'rebel-letterspacing','rebel-custom-bg','rebel-card-color','rebel-glass','rebel-pattern-on',
    'rebel-pattern','rebel-bgtype','rebel-accent','rebel-gradient'];
  const data = {};
  keys.forEach(k => { const v = localStorage.getItem(k); if (v) data[k] = v; });
  const presets = JSON.parse(localStorage.getItem('rebel-presets') || '[]');
  presets.push({ name, data });
  localStorage.setItem('rebel-presets', JSON.stringify(presets));
  document.getElementById('presetNameInput').value = '';
  loadPresets();
  toast(`Preset "${name}" saved`, 'success');
}

function loadPreset(index) {
  const presets = JSON.parse(localStorage.getItem('rebel-presets') || '[]');
  const preset = presets[index];
  if (!preset) return;
  Object.entries(preset.data).forEach(([k, v]) => localStorage.setItem(k, v));
  restoreSettings();
  toast(`Preset "${preset.name}" loaded`, 'success');
}

function deletePreset(index) {
  const presets = JSON.parse(localStorage.getItem('rebel-presets') || '[]');
  const name = presets[index]?.name;
  presets.splice(index, 1);
  localStorage.setItem('rebel-presets', JSON.stringify(presets));
  loadPresets();
  toast(`Preset "${name}" deleted`, 'success');
}

function restoreSettings() {
  const clampInt = (v, min, max, fallback) => {
    const n = parseInt(v, 10);
    if (Number.isNaN(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  };
  const clampFloat = (v, min, max, fallback) => {
    const n = parseFloat(v);
    if (Number.isNaN(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  };

  const theme = localStorage.getItem('rebel-theme') || 'system';
  const font = localStorage.getItem('rebel-font') || 'inter';
  const density = localStorage.getItem('rebel-density') || 'normal';
  const anim = localStorage.getItem('rebel-anim') || 'normal';
  const radius = String(clampInt(localStorage.getItem('rebel-radius'), 0, 24, 8));
  const fontSize = String(clampInt(localStorage.getItem('rebel-fontsize'), 10, 20, 15));
  const ls = String(clampFloat(localStorage.getItem('rebel-letterspacing'), -1, 3, 0));
  const glass = localStorage.getItem('rebel-glass') || 'off';
  const blur = String(clampInt(localStorage.getItem('rebel-blur'), 4, 32, 12));
  const cardBorder = localStorage.getItem('rebel-card-border') || 'on';
  const patternOn = localStorage.getItem('rebel-pattern-on') || 'off';
  const pattern = localStorage.getItem('rebel-pattern') || 'dots';
  const bgtype = localStorage.getItem('rebel-bgtype') || 'solid';
  const accent = localStorage.getItem('rebel-accent');
  const cardColor = localStorage.getItem('rebel-card-color');
  const customBg = localStorage.getItem('rebel-custom-bg');
  const gradientData = localStorage.getItem('rebel-gradient');
  const sidebarColor = localStorage.getItem('rebel-sidebar-color');
  const compactNav = localStorage.getItem('rebel-compact-nav') || 'off';
  const tickerSpeed = String(clampInt(localStorage.getItem('rebel-ticker-speed'), 1, 5, 3));
  const pageTrans = localStorage.getItem('rebel-page-trans') || 'on';
  const hoverFx = localStorage.getItem('rebel-hover-fx') || 'on';
  const glowFx = localStorage.getItem('rebel-glow-fx') || 'on';

  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-font', font);
  document.documentElement.setAttribute('data-density', density);
  document.documentElement.setAttribute('data-anim', anim);
  document.documentElement.setAttribute('data-glass', glass);
  document.documentElement.setAttribute('data-card-border', cardBorder);
  document.documentElement.setAttribute('data-compact-nav', compactNav);
  document.documentElement.setAttribute('data-page-trans', pageTrans);
  document.documentElement.setAttribute('data-hover-fx', hoverFx);
  document.documentElement.setAttribute('data-glow-fx', glowFx);

  setRadius(radius);
  setFontSize(fontSize);
  setLetterSpacing(ls);
  setBlur(blur);

  if (accent) setAccentColor(accent, null);
  if (cardColor) setCardColor(cardColor);
  // Card gradient
  const cardGradData = localStorage.getItem('rebel-card-gradient');
  const cardBgType = localStorage.getItem('rebel-cardbgtype') || 'solid';
  if (cardGradData && cardBgType === 'gradient') {
    try {
      const g = JSON.parse(cardGradData);
      document.documentElement.style.setProperty('--bg-s', `linear-gradient(${g.dir},${g.c1},${g.c2})`);
    } catch {}
  }
  if (customBg && bgtype === 'solid') setCustomBg(customBg);  if (gradientData && bgtype === 'gradient') {
    try {
      const g = JSON.parse(gradientData);
      document.body.style.background = `linear-gradient(${g.dir}, ${g.c1}, ${g.c2})`;
    } catch {}
  }
  if (patternOn === 'on') document.documentElement.setAttribute('data-pattern', pattern);
  if (sidebarColor) {
    const sb = document.querySelector('.sidebar');
    if (sb) sb.style.background = sidebarColor;
  }
  window._tickerSpeedVal = parseInt(tickerSpeed);

  // Sync UI controls
  document.querySelectorAll('.settings-opt').forEach(btn => {
    const s = btn.dataset.setting, v = btn.dataset.val;
    if (s === 'theme') btn.classList.toggle('active', v === theme);
    if (s === 'density') btn.classList.toggle('active', v === density);
    if (s === 'anim') btn.classList.toggle('active', v === anim);
    if (s === 'bgtype') btn.classList.toggle('active', v === bgtype);
    if (s === 'cardbgtype') btn.classList.toggle('active', v === cardBgType);
    if (s === 'pattern') btn.classList.toggle('active', v === pattern);
  });
  document.querySelectorAll('.settings-font-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.font === font);
  });

  const sync = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  sync('radiusSlider', radius);
  sync('fontSizeSlider', fontSize);
  sync('letterSpacingSlider', ls);
  sync('blurSlider', blur);
  sync('tickerSpeedSlider', tickerSpeed);

  const syncCheck = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val === 'on'; };
  syncCheck('glassToggle', glass);
  syncCheck('cardBorderToggle', cardBorder);
  syncCheck('patternToggle', patternOn);
  syncCheck('compactNavToggle', compactNav);
  syncCheck('pageTransToggle', pageTrans);
  syncCheck('hoverFxToggle', hoverFx);
  syncCheck('glowFxToggle', glowFx);

  const patternOpts = document.getElementById('patternOptions');
  if (patternOpts) patternOpts.style.display = patternOn === 'on' ? 'block' : 'none';
  toggleGradientUI(bgtype === 'gradient');

  if (accent) {
    document.querySelectorAll('.accent-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.color === accent);
    });
  }

  // Ticker speed badge
  const labels = ['', 'Very Slow', 'Slow', 'Normal', 'Fast', 'Very Fast'];
  const tsBadge = document.getElementById('tickerSpeedVal');
  if (tsBadge) tsBadge.textContent = labels[tickerSpeed] || 'Normal';

  loadPresets();
}

// ===== GENERIC SPECTRUM PICKER FACTORY =====
function createSpectrumPicker(spectrumId, hueBarId, previewId, hexInputId, onColorChange) {
  let hue = 220;
  let px = 0.15, py = 0.85; // normalized dot position

  function drawAll() {
    const spectrum = document.getElementById(spectrumId);
    const hueBar = document.getElementById(hueBarId);
    if (!spectrum || !hueBar) return;

    // Spectrum
    const ctx = spectrum.getContext('2d');
    const w = spectrum.width, h = spectrum.height;
    ctx.fillStyle = `hsl(${hue},100%,50%)`;
    ctx.fillRect(0, 0, w, h);
    const wg = ctx.createLinearGradient(0,0,w,0);
    wg.addColorStop(0,'rgba(255,255,255,1)'); wg.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle = wg; ctx.fillRect(0,0,w,h);
    const bg = ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0,'rgba(0,0,0,0)'); bg.addColorStop(1,'rgba(0,0,0,1)');
    ctx.fillStyle = bg; ctx.fillRect(0,0,w,h);
    // Crosshair dot
    const cx = px*w, cy = py*h;
    ctx.beginPath(); ctx.arc(cx,cy,7,0,Math.PI*2);
    ctx.strokeStyle='rgba(0,0,0,.5)'; ctx.lineWidth=3; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy,7,0,Math.PI*2);
    ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.stroke();

    // Hue bar
    const hctx = hueBar.getContext('2d');
    const hw = hueBar.width, hh = hueBar.height;
    const grad = hctx.createLinearGradient(0,0,hw,0);
    for (let i=0;i<=360;i+=30) grad.addColorStop(i/360,`hsl(${i},100%,50%)`);
    hctx.fillStyle = grad; hctx.fillRect(0,0,hw,hh);
    const hx = (hue/360)*hw;
    hctx.beginPath(); hctx.arc(hx,hh/2,6,0,Math.PI*2);
    hctx.strokeStyle='rgba(0,0,0,.4)'; hctx.lineWidth=3; hctx.stroke();
    hctx.beginPath(); hctx.arc(hx,hh/2,6,0,Math.PI*2);
    hctx.strokeStyle='#fff'; hctx.lineWidth=2; hctx.stroke();
  }

  function pickFromSpectrum(ex, ey) {
    const spectrum = document.getElementById(spectrumId);
    if (!spectrum) return;
    const rect = spectrum.getBoundingClientRect();
    const x = Math.max(0, Math.min(ex - rect.left, rect.width));
    const y = Math.max(0, Math.min(ey - rect.top, rect.height));
    px = x / rect.width; py = y / rect.height;
    const sx = Math.round(x * (spectrum.width / rect.width));
    const sy = Math.round(y * (spectrum.height / rect.height));
    const pixel = spectrum.getContext('2d').getImageData(sx, sy, 1, 1).data;
    const hex = '#' + [pixel[0],pixel[1],pixel[2]].map(v=>v.toString(16).padStart(2,'0')).join('');
    const hexInput = document.getElementById(hexInputId);
    if (hexInput) hexInput.value = hex;
    const preview = document.getElementById(previewId);
    if (preview) { preview.style.background = hex; if (preview.type === 'color') preview.value = hex; }
    onColorChange(hex);
    drawAll();
  }

  function init() {
    const spectrum = document.getElementById(spectrumId);
    const hueBar = document.getElementById(hueBarId);
    if (!spectrum || !hueBar) return;

    // Use ResizeObserver to redraw when canvas becomes visible
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => {
        if (spectrum.offsetWidth > 0) drawAll();
      });
      ro.observe(spectrum);
    }

    drawAll();

    hueBar.addEventListener('mousedown', e => {
      const pick = ev => {
        const rect = hueBar.getBoundingClientRect();
        const x = Math.max(0, Math.min(ev.clientX - rect.left, rect.width));
        hue = Math.round((x / rect.width) * 360);
        drawAll();
      };
      pick(e);
      document.addEventListener('mousemove', pick);
      document.addEventListener('mouseup', () => document.removeEventListener('mousemove', pick), { once: true });
    });

    spectrum.addEventListener('mousedown', e => {
      pickFromSpectrum(e.clientX, e.clientY);
      const move = ev => pickFromSpectrum(ev.clientX, ev.clientY);
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', () => document.removeEventListener('mousemove', move), { once: true });
    });
  }

  return { init, draw: drawAll };
}

// ===== COLOR PICKER INSTANCES =====
let _bgPicker = null, _cardPicker = null, _sidebarPicker = null, _accentPicker = null;

function initColorPicker() {
  if (!_bgPicker) _bgPicker = createSpectrumPicker('colorSpectrum','colorHueBar','colorPreview','bgColorHex', setCustomBg);
  _bgPicker.init();
}
function initCardColorPicker() {
  if (!_cardPicker) {
    _cardPicker = createSpectrumPicker('cardColorSpectrum','cardColorHueBar','cardColorPreview','cardColorHex', setCardColor);
    _cardPicker.init();
  } else {
    _cardPicker.draw();
  }
}
function initSidebarColorPicker() {
  if (!_sidebarPicker) {
    _sidebarPicker = createSpectrumPicker('sidebarColorSpectrum','sidebarColorHueBar','sidebarColorPreview','sidebarColorHex', setSidebarColor);
    _sidebarPicker.init();
  } else {
    _sidebarPicker.draw();
  }
}
function initAccentColorPicker() {
  if (!_accentPicker) _accentPicker = createSpectrumPicker('accentColorSpectrum','accentColorHueBar','accentColorPreview','accentColorHex', (hex) => setAccentColor(hex, null, true));
  _accentPicker.init();
}

function setCustomBg(color) {
  if (!color || !/^#[0-9a-fA-F]{6}$/.test(color)) return;
  document.documentElement.style.setProperty('--bg', color);
  const hexInput = document.getElementById('bgColorHex');
  if (hexInput) hexInput.value = color;
  const prev = document.getElementById('colorPreview');
  if (prev) { prev.style.background = color; if (prev.type === 'color') prev.value = color; }
}

function resetCustomBg() {
  document.documentElement.style.removeProperty('--bg');
  localStorage.removeItem('rebel-custom-bg');
  const theme = document.documentElement.getAttribute('data-theme') || 'system';
  const defaults = { dark:'#09090b', system:'#1a1a1e', light:'#ffffff' };
  const def = defaults[theme] || '#1a1a1e';
  const hexInput = document.getElementById('bgColorHex');
  if (hexInput) hexInput.value = def;
  const prev = document.getElementById('colorPreview');
  if (prev) prev.style.background = def;
}

// ===== SIDEBAR TOGGLE =====
function toggleSidebar() {
  document.querySelector('.app').classList.toggle('sidebar-collapsed');
}

// ===== SEARCH AI ASSISTANT =====
const AI_KB = [
  {keys:['stake','staking','how to stake','soft stake'],answer:'Great question! Here\'s how to stake your NFTs:<br><br><b>1.</b> Connect your wallet by clicking Sign In<br><b>2.</b> Browse collections in Explore Collection<br><b>3.</b> Hover over a collection and click <b>Stake</b><br><b>4.</b> That\'s it! Your NFT stays safely in your wallet — no on-chain transaction needed<br><br>You\'ll start earning points every hour based on the collection\'s reward rate. Keep your NFTs\' HP high by feeding them regularly!'},
  {keys:['raffle','raffles','how raffle','enter raffle','buy raffle'],answer:'Raffles are a fun way to win prizes! Here\'s how they work:<br><br><b>1.</b> Browse Trending Raffles on the home page or visit the Raffles page<br><b>2.</b> Click any raffle to see the details<br><b>3.</b> Choose how many entries you want to buy<br><b>4.</b> When the timer runs out, a random winner is picked automatically<br><br>Each raffle shows the <b>entry price</b>, <b>total entries</b>, <b>time left</b>, and <b>prize pool</b>. Good luck!'},
  {keys:['claim','rewards','how to claim','earn'],answer:'Here\'s how to claim your hard-earned rewards:<br><br><b>1.</b> Go to any collection where you have staked NFTs<br><b>2.</b> You\'ll see your <b>Balance</b>, <b>Total Earned</b>, and <b>Pending</b> rewards at the top<br><b>3.</b> Hit the <b>Claim</b> button to collect your pending rewards<br><br>Rewards are calculated every hour. The higher your NFTs\' HP, the more you earn. Don\'t forget to feed them!'},
  {keys:['hp','health','feed','feeding','decay'],answer:'HP (Health Points) is your NFT\'s energy level. Here\'s what you need to know:<br><br>• Every staked NFT starts at <b>100 HP</b><br>• HP <b>decays by 2 points</b> every 30 minutes<br>• When HP hits <b>0</b>, your NFT stops earning<br>• <b>Feed</b> your NFT to restore +25 HP instantly<br><br>Think of it like a virtual pet — keep it fed and it keeps earning for you!'},
  {keys:['chain','chains','supported','network','atom','megaeth','ethereum'],answer:'We support <b>3 awesome chains</b>:<br><br>• <b>Cosmos (ATOM)</b> — Home to Stargaze Punks, Bad Kids, Cosmos Apes and more<br>• <b>MegaETH (METH)</b> — Featuring Doge Uprising, SolCat, HelpPaws, PixelPunk<br>• <b>Ethereum (ETH)</b> — The classics: Bored Apes, CryptoPunks, Azuki, Pudgy Penguins<br><br>Switch between chains using the <b>ATOM</b> button in the top bar!'},
  {keys:['collection','collections','all collections','explore'],answer:'Here are all the collections you can explore:<br><br><b>Cosmos:</b> Stargaze Punks, Bad Kids, Cosmos Apes, Celestine Sloths, Passage3D, ION Sword<br><br><b>MegaETH:</b> Doge Uprising, SolCat, HelpPaws, PixelPunk, RocketDog<br><br><b>Ethereum:</b> Bored Apes, CryptoPunks, Azuki, Pudgy Penguins, Art Blocks<br><br>Head to the <b>Collections</b> page or scroll down on the home page to explore them all!'},
  {keys:['token','coin','coins','price','market'],answer:'Here are the top coins across our supported chains:<br><br><b>Cosmos:</b> $ATOM ($1.5M), $OSMO ($890K), $STARS ($156K), $INJ ($3.2M), $TIA ($2.8M)<br><b>MegaETH:</b> $METH ($4.8M), $REBEL ($2.1M), $TURBO ($890K)<br><b>Ethereum:</b> $ETH ($12.3M), $UNI ($8.9M), $AAVE ($5.6M)<br><br>Check out the <b>Top Coins</b> ticker on the home page for live updates!'},
  {keys:['leaderboard','rank','ranking','points','top'],answer:'The Leaderboard shows who\'s on top! Here\'s how it works:<br><br>• You earn <b>10 points</b> every time you stake an NFT<br>• Plus <b>hourly rewards</b> based on your collection\'s rate and your NFTs\' HP<br>• Filter by chain or time period (All Time, 7d, 30d)<br><br>Head to the <b>Leaderboard</b> page from the sidebar to see where you rank!'},
  {keys:['wallet','connect','sign in','login','profile'],answer:'Getting started is easy!<br><br><b>1.</b> Click <b>Sign In</b> in the top right<br><b>2.</b> A demo wallet will be created for you instantly<br><b>3.</b> Click your wallet address to open your <b>Profile</b><br><br>Your profile shows your wallet address, active chain, balance, staked NFTs count, and total earnings. You can disconnect anytime from there.'},
  {keys:['settings','theme','dark','light','font','corner'],answer:'Make Rebel.fun yours! Click the <b>gear icon</b> to open Settings:<br><br>• <b>Theme:</b> Dark (pure black), System (charcoal), or Bright (white)<br>• <b>Corners:</b> Rounded or Sharp edges<br>• <b>Font:</b> Sans-serif, Serif, or Pixel style<br>• <b>Background Color:</b> Pick any color with the spectrum picker<br><br>Hit <b>Save</b> and your preferences stick around!'},
  {keys:['stargaze','sgpk','punks'],answer:'<b>Stargaze Punks (SGPK)</b> is one of the OG Cosmos collections!<br><br>• Chain: Cosmos<br>• Floor: 1.2 ATOM<br>• Reward: 5.5 pts/day<br>• A beloved community collection on Stargaze'},
  {keys:['bad kids','bkids'],answer:'<b>Bad Kids (BKIDS)</b> — the premium Cosmos collection!<br><br>• Chain: Cosmos<br>• Floor: 3.8 ATOM<br>• Reward: 8.2 pts/day<br>• Known for high rewards and strong community'},
  {keys:['bored ape','bayc'],answer:'<b>Bored Apes (BAYC)</b> — the blue chip of blue chips!<br><br>• Chain: Ethereum<br>• Floor: 15.2 ETH<br>• Reward: 25 pts/day<br>• The most iconic NFT collection in crypto'},
  {keys:['hello','hi','hey','sup','yo','halo','hai'],answer:'Hey there! 👋 Welcome to Rebel.fun! I\'m your assistant — ask me anything about staking, raffles, collections, or just chat! What\'s on your mind?'},
  {keys:['thanks','thank','thx','ty','makasih','terima kasih'],answer:'You\'re welcome! 😊 Glad I could help. Feel free to ask anything else!'},
  {keys:['help','what can you do','commands','apa aja'],answer:'I can help you with lots of things! Here are some ideas:<br><br>• <b>"How to stake"</b> — step-by-step guide<br>• <b>"Raffles"</b> — how they work<br>• <b>"Collections"</b> — browse all NFT collections<br>• <b>"Claim rewards"</b> — collect your earnings<br>• <b>"Chains"</b> — supported networks<br>• <b>"Settings"</b> — customize your experience<br>• Or just say <b>hi</b> and chat! 😄'},
  {keys:['good','great','nice','cool','awesome','keren','bagus'],answer:'Thanks! 🎉 Glad you\'re enjoying it. Anything else you\'d like to know?'},
  {keys:['bye','goodbye','see you','later'],answer:'See you later! 👋 Come back anytime. Happy staking!'},
  {keys:['who are you','what are you','siapa'],answer:'I\'m Rebel Assistant — your friendly AI helper for Rebel.fun! I know everything about the platform and I\'m always happy to chat. Ask me anything! 🤖'},
  {keys:['how are you','apa kabar','gimana'],answer:'I\'m doing great, thanks for asking! 😊 Ready to help you with anything on Rebel.fun. What would you like to know?'},
];

function openSearchAI() {
  document.getElementById('searchAIOverlay').classList.add('open');
  setTimeout(() => document.getElementById('searchAIInput').focus(), 100);
}
function closeSearchAI() {
  document.getElementById('searchAIOverlay').classList.remove('open');
}
function askAIPreset(q) {
  document.getElementById('searchAIInput').value = q;
  askAI();
}
let aiSessionId = 'session_' + Math.random().toString(36).slice(2,10);

function askAI() {
  const inputEl = document.getElementById('searchAIInput');
  const input = inputEl.value.trim();
  if (!input) return;
  const chat = document.getElementById('searchAIResponse');
  const welcome = document.getElementById('searchAIWelcome');
  if (welcome) welcome.style.display = 'none';

  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg chat-msg-user chat-animate';
  userMsg.textContent = input;
  chat.appendChild(userMsg);
  chat.scrollTop = chat.scrollHeight;
  inputEl.value = '';

  // Show typing indicator
  const typing = document.createElement('div');
  typing.className = 'chat-msg chat-msg-bot chat-typing';
  typing.textContent = 'Thinking...';
  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;

  // Call AI API
  fetch(API_BASE + '/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: input, sessionId: aiSessionId }),
  })
  .then(r => r.json())
  .then(data => {
    typing.remove();
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-msg chat-msg-bot chat-animate';
    let reply = (data.reply || '').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
    if (!reply || reply.includes('trouble') || reply.includes('quota') || reply.includes('not configured')) {
      reply = getLocalAnswer(input);
    }
    botMsg.innerHTML = reply;
    chat.appendChild(botMsg);
    addMiniCardsToChat(chat, input + ' ' + reply);
    // Action icons
    const actions = document.createElement('div');
    actions.className = 'chat-msg-actions';
    actions.innerHTML = `<button class="chat-action-btn" title="Copy" onclick="navigator.clipboard.writeText(this.closest('.chat-msg-actions').previousElementSibling.textContent);toast('Copied!','success')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button><button class="chat-action-btn" title="Like" onclick="toast('Thanks for the feedback!','success')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg></button><button class="chat-action-btn" title="Dislike" onclick="toast('Noted, will improve!','info')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 15V19a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg></button>`;
    chat.appendChild(actions);
    chat.scrollTop = chat.scrollHeight;
  })
  .catch(() => {
    typing.remove();
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-msg chat-msg-bot chat-animate';
    botMsg.innerHTML = getLocalAnswer(input);
    chat.appendChild(botMsg);
    const actions2 = document.createElement('div');
    actions2.className = 'chat-msg-actions';
    actions2.innerHTML = `<button class="chat-action-btn" title="Copy" onclick="navigator.clipboard.writeText(this.closest('.chat-msg-actions').previousElementSibling.textContent);toast('Copied!','success')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>`;
    chat.appendChild(actions2);
    chat.scrollTop = chat.scrollHeight;
  });
}

function getLocalAnswer(input) {
  const q = input.toLowerCase();
  let best = null, bestScore = 0;
  for (const kb of AI_KB) {
    for (const key of kb.keys) {
      if (q.includes(key) || key.includes(q)) {
        const score = key.length;
        if (score > bestScore) { bestScore = score; best = kb; }
      }
    }
  }
  return best ? best.answer : 'Hmm, I\'m not sure about that one! Try asking about <b>staking</b>, <b>raffles</b>, <b>collections</b>, <b>rewards</b>, <b>chains</b>, or <b>leaderboard</b>. You can also say <b>hi</b> or ask for <b>help</b>!';
}
// Close on Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearchAI(); });

// ===== AUTOCOMPLETE =====
let acCollections = [];
async function loadAutocompleteData() {
  const colls = await api('/collections?chain=' + activeChain);
  if (colls) acCollections = colls;
}
function showAutocomplete(val) {
  const ac = document.getElementById('searchAIAutocomplete');
  if (!val || val.length < 2) { ac.classList.remove('open'); return; }
  const q = val.toLowerCase();
  const matches = acCollections.filter(c => c.name.toLowerCase().includes(q) || c.ticker.toLowerCase().includes(q)).slice(0, 5);
  if (!matches.length) { ac.classList.remove('open'); return; }
  ac.innerHTML = matches.map(c => `<div class="search-ac-item" onclick="closeSearchAI();openCollection('${c.id}')">
    <div class="search-ac-item-img"><img src="${c.imageUrl}" alt=""></div>
    <div><div class="search-ac-item-name">${c.name}</div><div class="search-ac-item-sub">${c.ticker} · ${c.totalStaked} staked</div></div>
  </div>`).join('');
  ac.classList.add('open');
}
function hideAutocomplete() { document.getElementById('searchAIAutocomplete')?.classList.remove('open'); }

// ===== MINI CARDS IN CHAT =====
function addMiniCardsToChat(chat, text) {
  const q = text.toLowerCase();
  const matchedColls = acCollections.filter(c => q.includes(c.name.toLowerCase()) || q.includes(c.ticker.toLowerCase())).slice(0, 3);
  if (!matchedColls.length) return;
  const cardsDiv = document.createElement('div');
  cardsDiv.className = 'chat-mini-cards';
  cardsDiv.innerHTML = matchedColls.map(c => `<div class="chat-mini-card" onclick="closeSearchAI();openCollection('${c.id}')">
    <div class="chat-mini-card-img"><img src="${c.imageUrl}" alt=""></div>
    <div class="chat-mini-card-info"><div class="chat-mini-card-name">${c.name}</div><div class="chat-mini-card-sub">${c.ticker} · ${c.totalStaked} staked</div></div>
  </div>`).join('');
  chat.appendChild(cardsDiv);
}

// ===== CREATE MODAL =====

// Dummy owned NFTs and collections per chain
const DUMMY_OWNED = {
  atom: {
    collections: [
      { id:'own1', name:'Stargaze Punks', ticker:'SGPK', contract:'stars1abc...def', image:'https://picsum.photos/seed/sgpk/300/300', count:12 },
      { id:'own2', name:'Bad Kids', ticker:'BKIDS', contract:'stars1xyz...789', image:'https://picsum.photos/seed/bkids/300/300', count:5 },
    ],
    nfts: [
      { id:'n1', name:'SGPK #1042', image:'https://picsum.photos/seed/sgpk1042/300/300', collection:'Stargaze Punks', rarity:'rare' },
      { id:'n2', name:'SGPK #0337', image:'https://picsum.photos/seed/sgpk337/300/300', collection:'Stargaze Punks', rarity:'common' },
      { id:'n3', name:'BKIDS #0088', image:'https://picsum.photos/seed/bkids88/300/300', collection:'Bad Kids', rarity:'epic' },
      { id:'n4', name:'SGPK #2201', image:'https://picsum.photos/seed/sgpk2201/300/300', collection:'Stargaze Punks', rarity:'legendary' },
      { id:'n5', name:'BKIDS #0412', image:'https://picsum.photos/seed/bkids412/300/300', collection:'Bad Kids', rarity:'common' },
    ]
  },
  megaeth: {
    collections: [
      { id:'own3', name:'Doge Uprising', ticker:'DOGE', contract:'0xDoge...1234', image:'https://picsum.photos/seed/doge/300/300', count:8 },
    ],
    nfts: [
      { id:'n6', name:'DOGE #0042', image:'https://picsum.photos/seed/doge42/300/300', collection:'Doge Uprising', rarity:'rare' },
      { id:'n7', name:'DOGE #1337', image:'https://picsum.photos/seed/doge1337/300/300', collection:'Doge Uprising', rarity:'epic' },
    ]
  },
  ethereum: {
    collections: [
      { id:'own4', name:'Bored Apes', ticker:'BAYC', contract:'0xBC4C...A1B2', image:'https://picsum.photos/seed/bayc/300/300', count:2 },
    ],
    nfts: [
      { id:'n8', name:'BAYC #8888', image:'https://picsum.photos/seed/bayc8888/300/300', collection:'Bored Apes', rarity:'legendary' },
    ]
  }
};

let selectedPrizeNft = null;

function openCreateModal() {
  const overlay = document.getElementById('createOverlay');
  overlay.classList.add('open');
  // Check if wallet connected
  if (currentUser) {
    startOwnershipScan();
  } else {
    showCreateStep('createStepConnect');
  }
}

function closeCreateModal() {
  document.getElementById('createOverlay').classList.remove('open');
  selectedPrizeNft = null;
}

function showCreateStep(stepId) {
  document.querySelectorAll('.create-step').forEach(s => s.style.display = 'none');
  document.getElementById(stepId).style.display = 'flex';
}

async function connectAndCreate() {
  await demoLogin();
  if (currentUser) startOwnershipScan();
}

function startOwnershipScan() {
  showCreateStep('createStepScanning');
  const statuses = [
    'Checking NFT collections in your wallet...',
    'Verifying contract ownership...',
    'Scanning NFT holdings...',
    'Almost done...'
  ];
  let i = 0;
  const el = document.getElementById('createScanStatus');
  const interval = setInterval(() => {
    if (el && i < statuses.length) { el.textContent = statuses[i++]; }
  }, 600);
  setTimeout(() => {
    clearInterval(interval);
    showChooseStep();
  }, 2800);
}

function showChooseStep() {
  showCreateStep('createStepChoose');
  const owned = DUMMY_OWNED[activeChain] || { collections: [], nfts: [] };
  // Wallet badge
  const badge = document.getElementById('createWalletBadge');
  if (badge) badge.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 0 0-8 0v2"/></svg>
    Connected: ${shortAddr(currentUser?.wallet || '')} &nbsp;·&nbsp; ${CHAINS[activeChain]?.name || activeChain}
  `;
  // Owned counts
  const collCount = document.getElementById('ownedCollCount');
  if (collCount) collCount.textContent = `${owned.collections.length} collection${owned.collections.length !== 1 ? 's' : ''} owned`;
  const nftCount = document.getElementById('ownedNftCount');
  if (nftCount) nftCount.textContent = `${owned.nfts.length} NFT${owned.nfts.length !== 1 ? 's' : ''} in wallet`;
}

function showCreateForm(type) {
  const owned = DUMMY_OWNED[activeChain] || { collections: [], nfts: [] };
  if (type === 'collection') {
    showCreateStep('createStepCollection');
    // Render owned collections as reference
    const list = document.getElementById('ownedCollectionsList');
    if (list) {
      list.innerHTML = owned.collections.map(c => `
        <div class="create-owned-nft" onclick="prefillCollection('${c.id}')">
          <img src="${c.image}" alt="">
          <div class="create-owned-nft-name">${c.ticker}</div>
        </div>`).join('') || '<span style="font-size:12px;color:var(--t3);padding:8px 0">No collections found in wallet</span>';
    }
  } else {
    showCreateStep('createStepRaffle');
    // Render owned NFTs as prize selector
    const list = document.getElementById('ownedNftsList');
    if (list) {
      list.innerHTML = owned.nfts.map(n => `
        <div class="create-owned-nft" id="nft-${n.id}" onclick="selectPrizeNft('${n.id}')">
          <img src="${n.image}" alt="">
          <div class="create-owned-nft-name">${n.name}</div>
        </div>`).join('') || '<span style="font-size:12px;color:var(--t3);padding:8px 0">No NFTs found in wallet</span>';
    }
  }
}

function prefillCollection(id) {
  const owned = DUMMY_OWNED[activeChain]?.collections || [];
  const c = owned.find(x => x.id === id);
  if (!c) return;
  const nameEl = document.getElementById('collName');
  const contractEl = document.getElementById('collContract');
  if (nameEl) nameEl.value = c.name;
  if (contractEl) contractEl.value = c.contract;
}

function selectPrizeNft(id) {
  selectedPrizeNft = id;
  document.querySelectorAll('.create-owned-nft').forEach(el => el.classList.remove('selected'));
  document.getElementById('nft-' + id)?.classList.add('selected');
  // Prefill image
  const owned = DUMMY_OWNED[activeChain]?.nfts || [];
  const nft = owned.find(n => n.id === id);
  if (nft) {
    const imgEl = document.getElementById('raffleImage');
    if (imgEl && !imgEl.value) imgEl.value = nft.image;
    const nameEl = document.getElementById('raffleName');
    if (nameEl && !nameEl.value) nameEl.value = nft.name + ' Raffle';
  }
}

function submitAddCollection(e) {
  e.preventDefault();
  const name = document.getElementById('collName').value.trim();
  const contract = document.getElementById('collContract').value.trim();
  const token = document.getElementById('collToken').value.trim();
  const rate = document.getElementById('collRate').value;
  if (!name || !contract || !token || !rate) { toast('Fill all required fields', 'error'); return; }

  // Simulate adding to collections
  toast(`Collection "${name}" added!`, 'success');
  document.getElementById('createSuccessTitle').textContent = 'Collection Added!';
  document.getElementById('createSuccessDesc').textContent = `"${name}" is now live on ${CHAINS[activeChain]?.name}. Holders can start staking their NFTs.`;
  showCreateStep('createStepSuccess');
  // Refresh collections
  renderCollectionGrid();
  renderAllCollectionsPage();
}

function submitCreateRaffle(e) {
  e.preventDefault();
  const name = document.getElementById('raffleName').value.trim();
  const price = document.getElementById('rafflePrice').value;
  const token = document.getElementById('raffleToken').value.trim();
  const max = document.getElementById('raffleMax').value;
  const duration = document.getElementById('raffleDuration').value;
  if (!name || !price || !token || !max || !duration) { toast('Fill all required fields', 'error'); return; }

  toast(`Raffle "${name}" launched!`, 'success');
  document.getElementById('createSuccessTitle').textContent = 'Raffle Launched!';
  document.getElementById('createSuccessDesc').textContent = `"${name}" is now live! ${max} tickets at ${price} ${token} each. Ends in ${duration}h.`;
  showCreateStep('createStepSuccess');
  // Refresh raffles
  renderTrendingRaffles();
  renderRafflesPage();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async function() {
  // Restore settings
  restoreSettings();
  // Restore custom bg
  const customBg = localStorage.getItem('rebel-custom-bg');
  if (customBg) setCustomBg(customBg);
  updateAuthUI();
  // Initialize chain button with default chain (MegaETH)
  const chainInfo = CHAINS[activeChain];
  if (chainInfo) {
    document.getElementById('chainBtnLabel').textContent = chainInfo.symbol;
  }
  renderTicker();
  document.getElementById('chainBtnIcon')?.setAttribute('data-chain', activeChain);
  renderCharityCoins();
  renderExploreTabs();
  renderNotifs();
  renderTrendingRaffles();
  renderCollectionGrid();
  initColorPicker();
  initCardColorPicker();
  initSidebarColorPicker();
  initAccentColorPicker();
  initResizeHandle();
  loadAutocompleteData();
  startBackgroundEffects();
  startLiveRaffleTicker();
  // Restore page from hash
  const hash = window.location.hash.replace('#','');
  if(hash && document.getElementById('page-'+hash)) goPage(hash);
  // Global image error fallback
  document.addEventListener('error', e => {
    if (e.target.tagName === 'IMG') e.target.src = 'https://placehold.co/300x300/222/666?text=NFT';
  }, true);
  const h = await api('/health');
  if (h) console.log('Backend connected:', h);
});
