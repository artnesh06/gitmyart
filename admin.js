// ===== ADMIN PANEL JS =====
const ADMIN_CREDS = { username: 'admin', password: 'rebel2024' };
const API = window.location.origin + '/api';

let adminLoggedIn = sessionStorage.getItem('admin_auth') === 'true';

// ===== AUTH =====
function adminLogin(e) {
  e.preventDefault();
  const user = document.getElementById('adminUser').value.trim();
  const pass = document.getElementById('adminPass').value;
  const err = document.getElementById('loginError');
  if (user === ADMIN_CREDS.username && pass === ADMIN_CREDS.password) {
    sessionStorage.setItem('admin_auth', 'true');
    document.getElementById('loginWrap').style.display = 'none';
    document.getElementById('adminApp').style.display = 'grid';
    initAdminDashboard();
  } else {
    err.textContent = 'Invalid username or password.';
    setTimeout(() => err.textContent = '', 3000);
  }
}

function adminLogout() {
  sessionStorage.removeItem('admin_auth');
  document.getElementById('adminApp').style.display = 'none';
  document.getElementById('loginWrap').style.display = 'flex';
  document.getElementById('adminUser').value = '';
  document.getElementById('adminPass').value = '';
}

// ===== NAVIGATION =====
function adminGoPage(page, navEl) {
  document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
  document.getElementById('apage-' + page)?.classList.add('active');
  document.querySelectorAll('.admin-nav-item').forEach(n => n.classList.remove('active'));
  if (navEl) navEl.classList.add('active');
  else document.querySelectorAll('.admin-nav-item')[['dashboard','analytics','collections','raffles','users','financial','risk','config','logs'].indexOf(page)]?.classList.add('active');
  const titles = { dashboard:'Dashboard', analytics:'Analytics', collections:'Collections', raffles:'Raffles', users:'Users', financial:'Financial Controls', risk:'Risk Management', config:'Platform Config', logs:'Audit Logs' };
  document.getElementById('adminPageTitle').textContent = titles[page] || page;
  if (page === 'collections') renderAdminCollections();
  if (page === 'raffles') renderAdminRaffles();
  if (page === 'users') renderAdminUsers();
  if (page === 'logs') renderAdminLogs();
}

// ===== INIT =====
async function initAdminDashboard() {
  await renderAdminStats();
  renderAdminRecentCollections();
  renderAdminActiveRaffles();
  renderAdminActivityFeed();
}

// ===== STATS =====
async function renderAdminStats() {
  const chains = ['atom','megaeth','ethereum'];
  let totalStaked = 0, totalCollections = 0, totalRaffles = 0, totalUsers = 0;
  for (const chain of chains) {
    const stats = await fetch(`${API}/stats?chain=${chain}`).then(r=>r.json()).catch(()=>null);
    if (stats) { totalStaked += stats.totalStaked||0; totalCollections += stats.totalCollections||0; totalRaffles += stats.activeRaffles||0; totalUsers += stats.totalUsers||0; }
  }
  const lb = await fetch(`${API}/leaderboard?chain=all`).then(r=>r.json()).catch(()=>[]);
  totalUsers = lb.length || totalUsers;

  const grid = document.getElementById('adminStatsGrid');
  const stats = [
    { label:'Total NFTs Staked', val: totalStaked, change:'+12%', up:true },
    { label:'Active Collections', val: totalCollections, change:'+3', up:true },
    { label:'Active Raffles', val: totalRaffles, change:'+5', up:true },
    { label:'Total Users', val: totalUsers, change:'+8%', up:true },
  ];
  grid.innerHTML = stats.map(s => `
    <div class="admin-stat-card">
      <div class="admin-stat-label">${s.label}</div>
      <div class="admin-stat-val">${s.val.toLocaleString()}</div>
      <div class="admin-stat-change ${s.up?'up':'down'}">${s.change} this week</div>
    </div>`).join('');
}

// ===== RECENT COLLECTIONS =====
async function renderAdminRecentCollections() {
  const data = await fetch(`${API}/collections?chain=atom`).then(r=>r.json()).catch(()=>[]);
  const el = document.getElementById('adminRecentCollections');
  el.innerHTML = '<div class="admin-mini-list">' + (data.slice(0,5).map(c => `
    <div class="admin-mini-item">
      <img class="admin-mini-img" src="${c.imageUrl||'https://picsum.photos/seed/'+c.id+'/80/80'}" alt="">
      <div class="admin-mini-info">
        <div class="admin-mini-name">${c.name}</div>
        <div class="admin-mini-sub">${c.ticker} · ${c.totalStaked||0} staked</div>
      </div>
      <div class="admin-mini-val">${c.rewardRate||0} pts/day</div>
    </div>`).join('') || '<div style="padding:20px;text-align:center;color:var(--t3)">No collections</div>') + '</div>';
}

// ===== ACTIVE RAFFLES =====
async function renderAdminActiveRaffles() {
  const data = await fetch(`${API}/raffles?chain=atom`).then(r=>r.json()).catch(()=>[]);
  const el = document.getElementById('adminActiveRaffles');
  const live = data.filter(r => r.endsIn !== 'Ended').slice(0,5);
  el.innerHTML = '<div class="admin-mini-list">' + (live.map(r => `
    <div class="admin-mini-item">
      <img class="admin-mini-img" src="${r.imageUrl||'https://picsum.photos/seed/'+r.id+'/80/80'}" alt="">
      <div class="admin-mini-info">
        <div class="admin-mini-name">${r.name}</div>
        <div class="admin-mini-sub">${r.currentEntries}/${r.maxEntries} entries · ${r.token}</div>
      </div>
      <span class="admin-badge live">Live</span>
    </div>`).join('') || '<div style="padding:20px;text-align:center;color:var(--t3)">No active raffles</div>') + '</div>';
}

// ===== ACTIVITY FEED =====
function renderAdminActivityFeed() {
  const activities = [
    { type:'stake', text:'<b>CryptoWhale</b> staked 3 NFTs in <b>Stargaze Punks</b>', time:'2m ago' },
    { type:'claim', text:'<b>MoonHunter</b> claimed <b>2,500 $REBEL</b>', time:'5m ago' },
    { type:'raffle', text:'<b>DiamondHands</b> bought 5 tickets for <b>Legendary Shiro</b>', time:'8m ago' },
    { type:'stake', text:'<b>TokenBoss</b> staked 1 NFT in <b>Bad Kids</b>', time:'12m ago' },
    { type:'unstake', text:'<b>StarDust</b> unstaked 2 NFTs from <b>Cosmos Apes</b>', time:'18m ago' },
    { type:'claim', text:'<b>RocketMan</b> claimed <b>800 $ATOM</b>', time:'24m ago' },
    { type:'raffle', text:'<b>ApeKing</b> won the <b>Onigiri Ocean Drop</b> raffle!', time:'1h ago' },
    { type:'stake', text:'<b>HashPower</b> staked 5 NFTs in <b>ION Sword</b>', time:'1h ago' },
  ];
  const el = document.getElementById('adminRecentActivity');
  el.innerHTML = '<div class="admin-activity-list">' + activities.map(a => `
    <div class="admin-activity-item">
      <div class="admin-activity-dot ${a.type}"></div>
      <div class="admin-activity-text">${a.text}</div>
      <div class="admin-activity-time">${a.time}</div>
    </div>`).join('') + '</div>';
}

// ===== COLLECTIONS TABLE =====
async function renderAdminCollections() {
  const chains = ['atom','megaeth','ethereum'];
  let all = [];
  for (const chain of chains) {
    const data = await fetch(`${API}/collections?chain=${chain}`).then(r=>r.json()).catch(()=>[]);
    data.forEach(c => all.push({...c, chain}));
  }
  const tbody = document.getElementById('collTableBody');
  tbody.innerHTML = all.map(c => `
    <tr data-search="${(c.name+c.ticker+c.chain).toLowerCase()}">
      <td><div class="admin-table-cell-flex">
        <img class="admin-table-img" src="${c.imageUrl||'https://picsum.photos/seed/'+c.id+'/80/80'}" alt="">
        <div><div class="admin-table-name">${c.name}</div><div class="admin-table-sub">${c.ticker}</div></div>
      </div></td>
      <td><span class="admin-badge active">${c.chain}</span></td>
      <td style="font-family:monospace;font-size:12px">${shortAddr(c.creatorWallet||'0x???')}</td>
      <td>${c.totalStaked||0}</td>
      <td>${c.rewardToken||'$REBEL'}</td>
      <td>${c.rewardRate||0}/day</td>
      <td><span class="admin-badge live">Active</span></td>
      <td><div class="admin-action-btns">
        <button class="admin-btn-sm" onclick="adminEditCollection(${c.id})">Edit</button>
        <button class="admin-btn-sm danger" onclick="adminDeleteCollection(${c.id},'${c.name}')">Delete</button>
      </div></td>
    </tr>`).join('') || '<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--t3)">No collections found</td></tr>';
}

// ===== RAFFLES TABLE =====
async function renderAdminRaffles() {
  const chains = ['atom','megaeth','ethereum'];
  let all = [];
  for (const chain of chains) {
    const data = await fetch(`${API}/raffles?chain=${chain}`).then(r=>r.json()).catch(()=>[]);
    data.forEach(r => all.push({...r, chain}));
  }
  const tbody = document.getElementById('raffleTableBody');
  tbody.innerHTML = all.map(r => {
    const isLive = r.endsIn !== 'Ended';
    return `<tr data-search="${(r.name+r.chain).toLowerCase()}">
      <td><div class="admin-table-cell-flex">
        <img class="admin-table-img" src="${r.imageUrl||'https://picsum.photos/seed/'+r.id+'/80/80'}" alt="">
        <div><div class="admin-table-name">${r.name}</div><div class="admin-table-sub">${r.description?.slice(0,40)||''}</div></div>
      </div></td>
      <td><span class="admin-badge active">${r.chain}</span></td>
      <td style="font-family:monospace;font-size:12px">${shortAddr(r.creatorWallet||'0x???')}</td>
      <td>${r.currentEntries}/${r.maxEntries}</td>
      <td>${r.price} ${r.token}</td>
      <td>${isLive ? r.endsIn : '—'}</td>
      <td><span class="admin-badge ${isLive?'live':'ended'}">${isLive?'Live':'Ended'}</span></td>
      <td><div class="admin-action-btns">
        ${isLive ? `<button class="admin-btn-sm danger" onclick="adminEndRaffle(${r.id},'${r.name}')">End</button>` : ''}
        <button class="admin-btn-sm danger" onclick="adminDeleteRaffle(${r.id},'${r.name}')">Delete</button>
      </div></td>
    </tr>`;
  }).join('') || '<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--t3)">No raffles found</td></tr>';
}

// ===== USERS TABLE =====
async function renderAdminUsers() {
  const data = await fetch(`${API}/leaderboard?chain=all`).then(r=>r.json()).catch(()=>[]);
  const tbody = document.getElementById('userTableBody');
  tbody.innerHTML = data.map((u,i) => `
    <tr data-search="${(u.wallet+u.chain).toLowerCase()}">
      <td style="font-family:monospace;font-size:12px">${u.wallet}</td>
      <td><span class="admin-badge active">${u.chain}</span></td>
      <td>${u.nftsStaked}</td>
      <td style="color:var(--green);font-weight:600">${(u.points||0).toLocaleString()}</td>
      <td style="color:var(--t3)">—</td>
      <td><span class="admin-badge active">Active</span></td>
      <td><div class="admin-action-btns">
        <button class="admin-btn-sm" onclick="adminViewUser('${u.wallet}')">View</button>
        <button class="admin-btn-sm danger" onclick="adminBanUser('${u.wallet}')">Ban</button>
      </div></td>
    </tr>`).join('') || '<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--t3)">No users found</td></tr>';
}

// ===== LOGS TABLE =====
async function renderAdminLogs() {
  const DUMMY_LOGS = [
    { time:'2026-05-01 17:42', wallet:'cosmos1abc...1234', action:'stake', details:'3 NFTs in Stargaze Punks', chain:'atom' },
    { time:'2026-05-01 17:38', wallet:'cosmos1def...5678', action:'claim', details:'2,500 $REBEL claimed', chain:'atom' },
    { time:'2026-05-01 17:35', wallet:'0xabc...def1', action:'raffle', details:'5 tickets for Legendary Shiro', chain:'megaeth' },
    { time:'2026-05-01 17:30', wallet:'cosmos1ghi...9012', action:'unstake', details:'2 NFTs from Cosmos Apes', chain:'atom' },
    { time:'2026-05-01 17:25', wallet:'0x123...456a', action:'stake', details:'1 NFT in Doge Uprising', chain:'megaeth' },
    { time:'2026-05-01 17:20', wallet:'cosmos1jkl...3456', action:'claim', details:'800 $ATOM claimed', chain:'atom' },
    { time:'2026-05-01 17:15', wallet:'0xdef...789b', action:'raffle', details:'Won Onigiri Ocean Drop', chain:'ethereum' },
    { time:'2026-05-01 17:10', wallet:'cosmos1mno...7890', action:'stake', details:'5 NFTs in ION Sword', chain:'atom' },
  ];
  const tbody = document.getElementById('logTableBody');
  tbody.innerHTML = DUMMY_LOGS.map(l => `
    <tr data-search="${(l.wallet+l.action+l.details).toLowerCase()}" data-type="${l.action}">
      <td style="color:var(--t3);font-size:12px;white-space:nowrap">${l.time}</td>
      <td style="font-family:monospace;font-size:12px">${l.wallet}</td>
      <td><span class="admin-badge ${l.action==='stake'?'active':l.action==='claim'?'live':l.action==='raffle'?'pending':'ended'}">${l.action}</span></td>
      <td style="color:var(--t2)">${l.details}</td>
      <td><span class="admin-badge active">${l.chain}</span></td>
    </tr>`).join('');
}

// ===== ACTIONS =====
function adminEditCollection(id) { adminToast('Edit collection #' + id + ' — coming soon', 'info'); }
function adminDeleteCollection(id, name) {
  if (confirm(`Delete collection "${name}"? This cannot be undone.`)) adminToast(`Collection "${name}" deleted`, 'success');
}
function adminEndRaffle(id, name) {
  if (confirm(`Force-end raffle "${name}" and pick a winner?`)) adminToast(`Raffle "${name}" ended — winner picked!`, 'success');
}
function adminDeleteRaffle(id, name) {
  if (confirm(`Delete raffle "${name}"?`)) adminToast(`Raffle "${name}" deleted`, 'success');
}
function adminViewUser(wallet) { adminToast('User profile: ' + wallet, 'info'); }
function adminBanUser(wallet) {
  if (confirm(`Ban user ${wallet}?`)) adminToast('User banned: ' + wallet, 'success');
}
function adminAction(action) {
  const msgs = { pause_staking:'All staking paused', end_raffles:'All raffles ended', reset_lb:'Leaderboard reset' };
  if (confirm('Are you sure? This action affects all users.')) adminToast(msgs[action] || 'Done', 'success');
}
function saveConfig() { adminToast('Config saved successfully', 'success'); }

// ===== FILTER =====
function filterAdminTable(tableId, query) {
  const q = query.toLowerCase();
  document.querySelectorAll(`#${tableId} tbody tr`).forEach(tr => {
    tr.style.display = tr.dataset.search?.includes(q) ? '' : 'none';
  });
}
function filterAdminTableByChain(tableId, chain) {
  document.querySelectorAll(`#${tableId} tbody tr`).forEach(tr => {
    tr.style.display = (!chain || tr.dataset.search?.includes(chain)) ? '' : 'none';
  });
}
function filterAdminTableByType(tableId, type) {
  document.querySelectorAll(`#${tableId} tbody tr`).forEach(tr => {
    tr.style.display = (!type || tr.dataset.type === type) ? '' : 'none';
  });
}

// ===== TOAST =====
function adminToast(msg, type='info') {
  const container = document.getElementById('adminToastContainer');
  const t = document.createElement('div');
  t.className = 'admin-toast ' + type;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
}

// ===== HELPERS =====
function shortAddr(a) { return (!a || a.length <= 14) ? (a||'') : a.slice(0,8)+'...'+a.slice(-4); }

// ===== AUTO LOGIN CHECK =====
if (adminLoggedIn) {
  document.getElementById('loginWrap').style.display = 'none';
  document.getElementById('adminApp').style.display = 'grid';
  initAdminDashboard();
}


// ===== EXTENDED NAVIGATION =====
const _origAdminGoPage = adminGoPage;
adminGoPage = function(page, navEl) {
  _origAdminGoPage(page, navEl);
  if (page === 'analytics') initCharts();
  if (page === 'financial') renderBlacklist();
  if (page === 'risk') { renderSuspiciousFeed(); renderFlaggedTable(); }
};

// ===== CHARTS (Chart.js) =====
let chartsInited = false;
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#a1a1aa', font: { family: 'Inter', size: 12 } } } },
  scales: {
    x: { ticks: { color: '#6b6b75' }, grid: { color: 'rgba(255,255,255,.04)' } },
    y: { ticks: { color: '#6b6b75' }, grid: { color: 'rgba(255,255,255,.06)' } }
  }
};

function initCharts() {
  if (chartsInited) return;
  chartsInited = true;

  // Staking Activity
  new Chart(document.getElementById('chartStaking'), {
    type: 'line',
    data: {
      labels: DAYS,
      datasets: [
        { label: 'Staked', data: [12,19,8,24,17,31,22], borderColor: '#7c3aed', backgroundColor: 'rgba(124,58,237,.1)', tension: 0.4, fill: true },
        { label: 'Unstaked', data: [4,7,3,9,5,12,8], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.08)', tension: 0.4, fill: true }
      ]
    },
    options: { ...CHART_DEFAULTS }
  });

  // Raffle Ticket Sales
  new Chart(document.getElementById('chartRaffle'), {
    type: 'bar',
    data: {
      labels: DAYS,
      datasets: [{ label: 'Tickets Sold', data: [45,82,38,97,61,124,88], backgroundColor: 'rgba(124,58,237,.6)', borderColor: '#7c3aed', borderWidth: 1, borderRadius: 4 }]
    },
    options: { ...CHART_DEFAULTS }
  });

  // Revenue
  new Chart(document.getElementById('chartRevenue'), {
    type: 'line',
    data: {
      labels: DAYS,
      datasets: [{ label: 'Revenue (pts)', data: [230,410,190,580,340,720,490], borderColor: '#4ade80', backgroundColor: 'rgba(74,222,128,.1)', tension: 0.4, fill: true }]
    },
    options: { ...CHART_DEFAULTS }
  });

  // New Users
  new Chart(document.getElementById('chartUsers'), {
    type: 'line',
    data: {
      labels: DAYS,
      datasets: [{ label: 'New Wallets', data: [3,7,2,11,5,14,9], borderColor: '#60a5fa', backgroundColor: 'rgba(96,165,250,.1)', tension: 0.4, fill: true }]
    },
    options: { ...CHART_DEFAULTS }
  });

  // Chain Distribution
  new Chart(document.getElementById('chartChains'), {
    type: 'doughnut',
    data: {
      labels: ['Cosmos (ATOM)', 'MegaETH', 'Ethereum'],
      datasets: [{ data: [58, 27, 15], backgroundColor: ['#a78bfa','#4ade80','#60a5fa'], borderColor: '#18181c', borderWidth: 3 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { color: '#a1a1aa', font: { family: 'Inter', size: 12 }, padding: 16 } } }
    }
  });

  // Top Collections
  new Chart(document.getElementById('chartTopColls'), {
    type: 'bar',
    data: {
      labels: ['Stargaze Punks','Bad Kids','Cosmos Apes','Doge Uprising','Bored Apes','ION Sword','SolCat','Azuki','Pudgy','PixelPunk'],
      datasets: [{ label: 'NFTs Staked', data: [142,98,87,76,65,54,43,38,31,24], backgroundColor: 'rgba(124,58,237,.5)', borderColor: '#7c3aed', borderWidth: 1, borderRadius: 4 }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#6b6b75' }, grid: { color: 'rgba(255,255,255,.04)' } },
        y: { ticks: { color: '#a1a1aa', font: { size: 11 } }, grid: { display: false } }
      }
    }
  });
}

// ===== FINANCIAL ACTIONS =====
function adminBurnTokens() {
  const wallet = document.getElementById('burnWallet').value.trim();
  const amount = document.getElementById('burnAmount').value;
  const token = document.getElementById('burnToken').value.trim();
  const reason = document.getElementById('burnReason').value.trim();
  if (!wallet || !amount || !token) { adminToast('Fill all fields', 'error'); return; }
  if (!confirm(`Cut ${amount} ${token} from ${wallet}?\nReason: ${reason || 'No reason given'}\n\nThis cannot be undone.`)) return;
  adminToast(`Burned ${amount} ${token} from ${wallet}`, 'success');
  document.getElementById('burnWallet').value = '';
  document.getElementById('burnAmount').value = '';
  document.getElementById('burnReason').value = '';
}

function adminAirdrop() {
  const wallet = document.getElementById('airdropWallet').value.trim();
  const amount = document.getElementById('airdropAmount').value;
  const token = document.getElementById('airdropToken').value.trim();
  if (!wallet || !amount || !token) { adminToast('Fill all fields', 'error'); return; }
  adminToast(`Airdropped ${amount} ${token} to ${wallet}`, 'success');
  document.getElementById('airdropWallet').value = '';
  document.getElementById('airdropAmount').value = '';
}

function adminBulkAirdrop() {
  const data = document.getElementById('bulkAirdropData').value.trim();
  const token = document.getElementById('bulkAirdropToken').value.trim();
  if (!data || !token) { adminToast('Fill all fields', 'error'); return; }
  const lines = data.split('\n').filter(l => l.trim());
  if (!confirm(`Send ${token} airdrop to ${lines.length} wallets?`)) return;
  adminToast(`Bulk airdrop sent to ${lines.length} wallets`, 'success');
  document.getElementById('bulkAirdropData').value = '';
}

// ===== BLACKLIST =====
let blacklist = ['cosmos1bad...0001', '0xscam...dead'];
function renderBlacklist() {
  const el = document.getElementById('blacklistTable');
  if (!el) return;
  if (!blacklist.length) { el.innerHTML = '<div style="padding:12px;color:var(--t3);font-size:13px;">No blacklisted creators</div>'; return; }
  el.innerHTML = blacklist.map((w, i) => `
    <div class="admin-blacklist-item">
      <span class="admin-blacklist-wallet">${w}</span>
      <button class="admin-blacklist-remove" onclick="removeFromBlacklist(${i})">Remove</button>
    </div>`).join('');
}
function addToBlacklist() {
  const val = document.getElementById('blacklistInput').value.trim();
  if (!val) return;
  blacklist.push(val);
  document.getElementById('blacklistInput').value = '';
  renderBlacklist();
  adminToast(`${val} blacklisted`, 'success');
}
function removeFromBlacklist(i) {
  const w = blacklist[i];
  blacklist.splice(i, 1);
  renderBlacklist();
  adminToast(`${w} removed from blacklist`, 'success');
}

// ===== RISK MANAGEMENT =====
function renderSuspiciousFeed() {
  const items = [
    { type:'warn', text:'<b>cosmos1abc...1234</b> claimed 5x in 1 hour', time:'10m ago' },
    { type:'danger', text:'<b>0xfarm...0001</b> staked from 12 different wallets (same IP)', time:'25m ago' },
    { type:'warn', text:'<b>cosmos1xyz...9999</b> unstaked immediately after claiming', time:'1h ago' },
    { type:'danger', text:'<b>0xbot...dead</b> triggered rate limit 8 times today', time:'2h ago' },
    { type:'warn', text:'Collection <b>Fake Punks</b> has unverified contract address', time:'3h ago' },
  ];
  const el = document.getElementById('suspiciousFeed');
  if (!el) return;
  el.innerHTML = '<div class="admin-activity-list">' + items.map(a => `
    <div class="admin-activity-item">
      <div class="admin-activity-dot ${a.type === 'danger' ? 'claim' : 'raffle'}"></div>
      <div class="admin-activity-text">${a.text}</div>
      <div class="admin-activity-time">${a.time}</div>
    </div>`).join('') + '</div>';
}

function renderFlaggedTable() {
  const flagged = [
    { wallet:'cosmos1abc...1234', chain:'atom', reason:'Excessive claims (5/hr)', time:'10m ago', autoBan:false },
    { wallet:'0xfarm...0001', chain:'megaeth', reason:'Multi-wallet farming', time:'25m ago', autoBan:true },
    { wallet:'0xbot...dead', chain:'ethereum', reason:'Rate limit violations', time:'2h ago', autoBan:true },
  ];
  const tbody = document.getElementById('flaggedTableBody');
  if (!tbody) return;
  tbody.innerHTML = flagged.map((f, i) => `
    <tr>
      <td style="font-family:monospace;font-size:12px">${f.wallet}</td>
      <td><span class="admin-badge active">${f.chain}</span></td>
      <td style="color:var(--yellow);font-size:12px">${f.reason}</td>
      <td style="color:var(--t3);font-size:12px">${f.time}</td>
      <td><span class="admin-badge ${f.autoBan?'live':'ended'}">${f.autoBan?'Yes':'No'}</span></td>
      <td><div class="admin-action-btns">
        <button class="admin-btn-sm success" onclick="adminToast('Wallet reviewed — cleared','success')">Clear</button>
        <button class="admin-btn-sm danger" onclick="adminToast('Wallet banned','success')">Ban</button>
        <button class="admin-btn-sm" onclick="adminToast('Wallet whitelisted','success')">Whitelist</button>
      </div></td>
    </tr>`).join('');
}

// ===== MODAL HELPERS =====
function openAdminModal(title, bodyHtml) {
  document.getElementById('adminModalTitle').textContent = title;
  document.getElementById('adminModalBody').innerHTML = bodyHtml;
  document.getElementById('adminModalOverlay').classList.add('open');
}
function closeAdminModal() {
  document.getElementById('adminModalOverlay').classList.remove('open');
}

// ===== EXTENDED COLLECTION ACTIONS =====
function adminEditCollection(id) {
  openAdminModal('Edit Collection #' + id, `
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div><label class="admin-label">Reward Rate (pts/NFT/day)</label><input type="number" class="admin-input" value="12" id="editRate"></div>
      <div><label class="admin-label">Max Stake per Wallet</label><input type="number" class="admin-input" value="20" id="editMaxStake"></div>
      <div><label class="admin-label">Rarity Multipliers</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px;">
          <div><label style="font-size:11px;color:var(--t3)">Common</label><input type="number" class="admin-input" value="1.0" step="0.1"></div>
          <div><label style="font-size:11px;color:var(--t3)">Rare</label><input type="number" class="admin-input" value="1.5" step="0.1"></div>
          <div><label style="font-size:11px;color:var(--t3)">Epic</label><input type="number" class="admin-input" value="2.0" step="0.1"></div>
          <div><label style="font-size:11px;color:var(--t3)">Legendary</label><input type="number" class="admin-input" value="3.0" step="0.1"></div>
        </div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <label class="admin-label">Suspended</label>
        <label class="admin-toggle-sm"><input type="checkbox"><span class="admin-toggle-track-sm"></span></label>
      </div>
      <button class="admin-save-btn" onclick="adminToast('Collection updated','success');closeAdminModal()">Save Changes</button>
    </div>`);
}

// ===== EXTENDED USER ACTIONS =====
function adminViewUser(wallet) {
  openAdminModal('User: ' + wallet, `
    <div style="display:flex;flex-direction:column;gap:12px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <div style="background:var(--bg-hover);border-radius:8px;padding:12px;text-align:center;"><div style="font-size:20px;font-weight:700;color:var(--t1)">12</div><div style="font-size:11px;color:var(--t3)">NFTs Staked</div></div>
        <div style="background:var(--bg-hover);border-radius:8px;padding:12px;text-align:center;"><div style="font-size:20px;font-weight:700;color:var(--green)">8,420</div><div style="font-size:11px;color:var(--t3)">Total Points</div></div>
        <div style="background:var(--bg-hover);border-radius:8px;padding:12px;text-align:center;"><div style="font-size:20px;font-weight:700;color:var(--t1)">34</div><div style="font-size:11px;color:var(--t3)">Raffle Entries</div></div>
        <div style="background:var(--bg-hover);border-radius:8px;padding:12px;text-align:center;"><div style="font-size:20px;font-weight:700;color:var(--yellow)">2</div><div style="font-size:11px;color:var(--t3)">Raffles Won</div></div>
      </div>
      <div style="font-size:12px;color:var(--t3);padding:8px 0;border-top:1px solid var(--border);">Recent Activity</div>
      <div style="font-size:12px;color:var(--t2);display:flex;flex-direction:column;gap:6px;">
        <div>• Staked 3 NFTs in Stargaze Punks — 2h ago</div>
        <div>• Claimed 2,500 $REBEL — 5h ago</div>
        <div>• Bought 5 raffle tickets — 1d ago</div>
        <div>• Unstaked 1 NFT from Bad Kids — 2d ago</div>
      </div>
      <div style="display:flex;gap:8px;margin-top:4px;">
        <button class="admin-btn-sm danger" onclick="adminBanUser('${wallet}');closeAdminModal()">Ban User</button>
        <button class="admin-btn-sm" onclick="adminToast('Points reset','success');closeAdminModal()">Reset Points</button>
        <button class="admin-btn-sm success" onclick="adminToast('Wallet whitelisted','success');closeAdminModal()">Whitelist</button>
      </div>
    </div>`);
}

function adminBanUser(wallet) {
  openAdminModal('Ban User', `
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="font-size:13px;color:var(--t2)">Wallet: <span style="font-family:monospace">${wallet}</span></div>
      <div><label class="admin-label">Ban Duration</label>
        <div style="display:flex;gap:6px;margin-top:6px;">
          <button class="admin-btn-sm" onclick="this.parentElement.querySelectorAll('.admin-btn-sm').forEach(b=>b.classList.remove('active'));this.classList.add('active')">1 Day</button>
          <button class="admin-btn-sm" onclick="this.parentElement.querySelectorAll('.admin-btn-sm').forEach(b=>b.classList.remove('active'));this.classList.add('active')">7 Days</button>
          <button class="admin-btn-sm" onclick="this.parentElement.querySelectorAll('.admin-btn-sm').forEach(b=>b.classList.remove('active'));this.classList.add('active')">30 Days</button>
          <button class="admin-btn-sm danger" onclick="this.parentElement.querySelectorAll('.admin-btn-sm').forEach(b=>b.classList.remove('active'));this.classList.add('active')">Permanent</button>
        </div>
      </div>
      <div><label class="admin-label">Reason</label><input type="text" class="admin-input" placeholder="e.g. Bot activity, farming, scam..."></div>
      <button class="admin-danger-btn" style="width:100%;padding:10px;" onclick="adminToast('User banned','success');closeAdminModal()">Confirm Ban</button>
    </div>`);
}


// ===== SYSTEM DOCS PAGE =====
const _origAdminGoPageDocs = adminGoPage;
adminGoPage = function(page, navEl) {
  _origAdminGoPageDocs(page, navEl);
  if (page === 'docs') {
    setTimeout(() => renderAdminDocs(), 100);
  }
};
