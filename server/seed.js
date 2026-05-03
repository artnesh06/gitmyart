// Gitmyart — Seed demo data
const { db, run, all, setConfig } = require('./db');

console.log('[SEED] Seeding demo data...');

// ===== COLLECTIONS =====
// MegaRebel NFT images - real images from OpenSea CDN (i2c.seadn.io)
const megaRebelImages = [
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/373f88cea82b8a480d2b2debebebb4/fc373f88cea82b8a480d2b2debebebb4.png?w=500',
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/7cbfe0122c9009bf5488bc67c24ce8/817cbfe0122c9009bf5488bc67c24ce8.png?w=500',
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/e92cfaf6b7d8374fccab2c59a43865/68e92cfaf6b7d8374fccab2c59a43865.png?w=500',
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/9bd966398679eb141a0ab8f0775b4b/119bd966398679eb141a0ab8f0775b4b.png?w=500',
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/038a27ca06b9325ef860eed85e38e7/0b038a27ca06b9325ef860eed85e38e7.png?w=500',
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/c103c8a1ef82658fb71d040a023e0c/8dc103c8a1ef82658fb71d040a023e0c.png?w=500',
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/cb5eb8c43acd3de45413ed0d2e0412/a6cb5eb8c43acd3de45413ed0d2e0412.png?w=500',
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/60655a59f68eefb6422ff1f53095bd/9d60655a59f68eefb6422ff1f53095bd.png?w=500',
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/f6db78d0a9ecc00cc1be65a8405b27/3cf6db78d0a9ecc00cc1be65a8405b27.png?w=500',
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/90b547c7d50c7adfe0c8fa6e4152e9/4c90b547c7d50c7adfe0c8fa6e4152e9.png?w=500',
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/f42a71ad0168e1d30031d4ddab4047/55f42a71ad0168e1d30031d4ddab4047.png?w=500',
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/a2600c90eddc1391796c509b243e9f/1aa2600c90eddc1391796c509b243e9f.png?w=500',
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/4f7f59de7657bbca51dc41052cacbb/914f7f59de7657bbca51dc41052cacbb.png?w=500',
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/bbcf12e9ac90946819956b1150fec4/bebbcf12e9ac90946819956b1150fec4.png?w=500',
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/5b983592faf1b63c46296bf09d348e/255b983592faf1b63c46296bf09d348e.png?w=500',
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/3b2332eda13fda2f20f8cdc37287e3/723b2332eda13fda2f20f8cdc37287e3.png?w=500',
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/63aa8e2918c1c8931fa0d0478a890c/4963aa8e2918c1c8931fa0d0478a890c.png?w=500',
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/f4267505f6a49182b6b06eb3741498/49f4267505f6a49182b6b06eb3741498.png?w=500',
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/fab8cdcba3cef71f3be8419c282f83/8efab8cdcba3cef71f3be8419c282f83.png?w=500',
  'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/c12763fdf5129bc4d5823a9ca99c63/66c12763fdf5129bc4d5823a9ca99c63.png?w=500',
];

const collections = [
  // ATOM - pakai MegaRebel images
  { id:'col-atom-1', chain:'atom', name:'Stargaze Punks', ticker:'SGPK', contract_addr:'stars1...sgpk', image_url:megaRebelImages[0], creator:'stars1...x3p', floor_price:1.2, reward_per_day:5.5, badge:null },
  { id:'col-atom-2', chain:'atom', name:'Bad Kids', ticker:'BKIDS', contract_addr:'stars1...bkids', image_url:megaRebelImages[1], creator:'stars1...n8q', floor_price:3.8, reward_per_day:8.2, badge:null },
  { id:'col-atom-3', chain:'atom', name:'Cosmos Apes', ticker:'CAPE', contract_addr:'cosmos1...cape', image_url:megaRebelImages[2], creator:'cosmos1...k2w', floor_price:2.1, reward_per_day:6.0, badge:'charity' },
  { id:'col-atom-4', chain:'atom', name:'Celestine Sloths', ticker:'SLTH', contract_addr:'stars1...slth', image_url:megaRebelImages[3], creator:'stars1...j5x', floor_price:0.5, reward_per_day:3.2, badge:null },
  { id:'col-atom-5', chain:'atom', name:'Passage3D', ticker:'PASS', contract_addr:'pasg1...pass', image_url:megaRebelImages[4], creator:'pasg1...p4r', floor_price:1.0, reward_per_day:4.8, badge:null },
  { id:'col-atom-6', chain:'atom', name:'ION Sword', ticker:'IONS', contract_addr:'osmo1...ions', image_url:megaRebelImages[5], creator:'osmo1...h7s', floor_price:0.3, reward_per_day:7.5, badge:'new' },

  // MegaETH - pakai MegaRebel images
  { id:'col-mega-1', chain:'megaeth', name:'Doge Uprising', ticker:'DOGE2', contract_addr:'0x7xK...doge', image_url:megaRebelImages[0], creator:'0x7xK...m3p', floor_price:0.08, reward_per_day:12.0, badge:null },
  { id:'col-mega-2', chain:'megaeth', name:'SolCat', ticker:'SCAT', contract_addr:'0x3bR...scat', image_url:megaRebelImages[1], creator:'0x3bR...n8q', floor_price:0.04, reward_per_day:8.5, badge:null },
  { id:'col-mega-3', chain:'megaeth', name:'HelpPaws', ticker:'PAWS', contract_addr:'0x9fT...paws', image_url:megaRebelImages[2], creator:'0x9fT...k2w', floor_price:0.15, reward_per_day:6.0, badge:'charity' },
  { id:'col-mega-4', chain:'megaeth', name:'PixelPunk', ticker:'PXPK', contract_addr:'0x6gH...pxpk', image_url:megaRebelImages[3], creator:'0x6gH...i1u', floor_price:0.02, reward_per_day:15.0, badge:'new' },
  { id:'col-mega-5', chain:'megaeth', name:'RocketDog', ticker:'RDOG', contract_addr:'0x7nO...rdog', image_url:megaRebelImages[4], creator:'0x7nO...p7x', floor_price:0.03, reward_per_day:10.0, badge:null },
  { id:'col-mega-6', chain:'megaeth', name:'MegaRebel', ticker:'MREB', contract_addr:'0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac', image_url:megaRebelImages[5], creator:'0xMegaRebel...creator', floor_price:0.25, reward_per_day:20.0, badge:'featured' },

  // Ethereum - pakai MegaRebel images
  { id:'col-eth-1', chain:'ethereum', name:'Bored Apes', ticker:'BAYC', contract_addr:'0xBC4...bayc', image_url:megaRebelImages[6], creator:'0xBC4...a1f', floor_price:15.2, reward_per_day:25.0, badge:null },
  { id:'col-eth-2', chain:'ethereum', name:'CryptoPunks', ticker:'PUNK', contract_addr:'0xb47...punk', image_url:megaRebelImages[7], creator:'0xb47...e3d', floor_price:22.5, reward_per_day:30.0, badge:null },
  { id:'col-eth-3', chain:'ethereum', name:'Azuki', ticker:'AZUKI', contract_addr:'0xED5...azuki', image_url:megaRebelImages[8], creator:'0xED5...b7c', floor_price:5.8, reward_per_day:15.0, badge:null },
  { id:'col-eth-4', chain:'ethereum', name:'Pudgy Penguins', ticker:'PPG', contract_addr:'0x524...ppg', image_url:megaRebelImages[9], creator:'0x524...d9e', floor_price:8.2, reward_per_day:18.0, badge:null },
  { id:'col-eth-5', chain:'ethereum', name:'Art Blocks', ticker:'ARTB', contract_addr:'0xa7d...artb', image_url:megaRebelImages[0], creator:'0xa7d...a3c', floor_price:2.1, reward_per_day:10.0, badge:'charity' },
];

const insertColl = db.prepare(`INSERT OR IGNORE INTO collections (id, chain, name, ticker, contract_addr, image_url, creator, floor_price, reward_per_day, badge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
for (const c of collections) {
  insertColl.run(c.id, c.chain, c.name, c.ticker, c.contract_addr, c.image_url, c.creator, c.floor_price, c.reward_per_day, c.badge);
}
console.log(`[SEED] ${collections.length} collections inserted`);

// ===== RAFFLES =====
const now = new Date();
const raffles = [
  // ATOM
  { chain:'atom', name:'Cosmos Genesis', desc:'Win a rare Cosmos Genesis NFT. Stargaze collection exclusive.', img:megaRebelImages[0], price:50, token:'$ATOM', max:500, current:234, hours:3 },
  { chain:'atom', name:'Osmosis Pool Party', desc:'LP providers raffle — win exclusive Osmosis NFTs.', img:megaRebelImages[1], price:30, token:'$OSMO', max:200, current:89, hours:6 },
  { chain:'atom', name:'Stargaze Drop', desc:'Community Stargaze NFT drop. 3 winners selected.', img:megaRebelImages[2], price:25, token:'$STARS', max:2000, current:1205, hours:13 },
  { chain:'atom', name:'IBC Whale', desc:'High-stakes IBC raffle. Prize: Ultra-rare 1/1 Cosmos NFT.', img:megaRebelImages[3], price:500, token:'$ATOM', max:100, current:45, hours:2 },
  { chain:'atom', name:'Celestia Lucky', desc:'Daily Celestia lucky draw with guaranteed winners.', img:megaRebelImages[4], price:10, token:'$TIA', max:5000, current:3420, hours:19 },

  // MegaETH
  { chain:'megaeth', name:'Genesis Raffle', desc:'Win a rare Genesis NFT from the original MegaETH collection.', img:megaRebelImages[5], price:50, token:'$REBEL', max:1000, current:567, hours:5 },
  { chain:'megaeth', name:'Golden Ticket', desc:'The golden ticket — one winner takes a legendary NFT worth 5 METH.', img:megaRebelImages[6], price:100, token:'$REBEL', max:500, current:234, hours:8 },
  { chain:'megaeth', name:'Turbo Drop', desc:'TurboSwap exclusive raffle. Speed matters.', img:megaRebelImages[7], price:25, token:'$TURBO', max:1500, current:890, hours:3 },
  { chain:'megaeth', name:'Mega Jackpot', desc:'The biggest MegaETH raffle. 10 METH prize pool.', img:megaRebelImages[8], price:200, token:'$METH', max:1000, current:678, hours:76 },

  // Ethereum
  { chain:'ethereum', name:'Blue Chip Raffle', desc:'Win a blue chip NFT — BAYC, CryptoPunks, or Azuki.', img:megaRebelImages[9], price:0.1, token:'ETH', max:10000, current:4500, hours:56 },
  { chain:'ethereum', name:'DeFi Kings', desc:'DeFi protocol NFT raffle. Exclusive governance perks.', img:megaRebelImages[0], price:50, token:'$UNI', max:3000, current:1200, hours:13 },
  { chain:'ethereum', name:'ENS Premium', desc:'Win a premium 3-letter ENS domain name.', img:megaRebelImages[1], price:0.05, token:'ETH', max:2000, current:890, hours:7 },
  { chain:'ethereum', name:'Pudgy Penguins', desc:'Win a Pudgy Penguin NFT. Community favorite.', img:megaRebelImages[2], price:0.08, token:'ETH', max:4000, current:2300, hours:19 },
];

const insertRaffle = db.prepare(`INSERT OR IGNORE INTO raffles (chain, name, description, image_url, price, token, max_entries, current_entries, ends_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
for (const r of raffles) {
  const endsAt = new Date(now.getTime() + r.hours * 60 * 60 * 1000).toISOString();
  insertRaffle.run(r.chain, r.name, r.desc, r.img, r.price, r.token, r.max, r.current, endsAt);
}
console.log(`[SEED] ${raffles.length} raffles inserted`);

// ===== DEMO STAKED NFTs (simulate some users) =====
const demoWallets = [
  { wallet: 'cosmos1demo1ef12xxxx', chain: 'atom' },
  { wallet: 'cosmos1demo2eeffxxxx', chain: 'atom' },
  { wallet: '0x7aB2demo3f1dxxxx', chain: 'megaeth' },
  { wallet: '0xBC4ademo1f2exxxx', chain: 'ethereum' },
];

const insertUser = db.prepare(`INSERT OR IGNORE INTO users (wallet, chain, display_name, balance) VALUES (?, ?, ?, ?)`);
const insertStake = db.prepare(`INSERT OR IGNORE INTO staked_nfts (wallet, chain, token_id, collection_id, collection_name, name, image_url, rarity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
const insertLb = db.prepare(`INSERT OR REPLACE INTO leaderboard (wallet, chain, nfts_staked, points) VALUES (?, ?, ?, ?)`);

const rarities = ['common','common','common','rare','rare','epic','legendary'];

for (const w of demoWallets) {
  const nftCount = Math.floor(Math.random() * 8) + 3;
  const points = Math.floor(Math.random() * 10000) + 1000;
  insertUser.run(w.wallet, w.chain, `Player_${w.wallet.slice(-4)}`, points * 0.1);
  
  const chainColls = collections.filter(c => c.chain === w.chain);
  for (let i = 0; i < nftCount; i++) {
    const coll = chainColls[Math.floor(Math.random() * chainColls.length)];
    const tokenId = `token_${w.wallet.slice(-4)}_${i}`;
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    const imgIndex = i % megaRebelImages.length;
    insertStake.run(w.wallet, w.chain, tokenId, coll.id, coll.name, `${coll.ticker} #${100 + i}`, megaRebelImages[imgIndex], rarity);
  }
  
  // Add sample MegaRebel NFTs for MegaETH user
  if (w.chain === 'megaeth') {
    const megaRebelColl = collections.find(c => c.id === 'col-mega-6');
    for (let j = 0; j < 3; j++) {
      const tokenId = `mreb_${w.wallet.slice(-4)}_${j}`;
      const rarity = rarities[Math.floor(Math.random() * rarities.length)];
      insertStake.run(w.wallet, w.chain, tokenId, megaRebelColl.id, megaRebelColl.name, `MREB #${1000 + j}`, megaRebelImages[j], rarity);
    }
  }
  
  insertLb.run(w.wallet, w.chain, nftCount, points);
}
console.log(`[SEED] ${demoWallets.length} demo users with staked NFTs`);

// ===== CONFIG =====
setConfig('game_active', '1');
setConfig('hp_decay_rate', '2');
setConfig('earn_interval_hours', '6');
setConfig('base_reward', '5');

console.log('[SEED] Done!');
