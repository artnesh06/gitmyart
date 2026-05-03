// Gitmyart — Seed demo data
const { db, run, all, setConfig } = require('./db');

console.log('[SEED] Seeding demo data...');

// ===== COLLECTIONS =====
const collections = [
  // ATOM
  { id:'col-atom-1', chain:'atom', name:'Stargaze Punks', ticker:'SGPK', contract_addr:'stars1...sgpk', image_url:'https://picsum.photos/seed/sgpk/400/400', creator:'stars1...x3p', floor_price:1.2, reward_per_day:5.5, badge:null },
  { id:'col-atom-2', chain:'atom', name:'Bad Kids', ticker:'BKIDS', contract_addr:'stars1...bkids', image_url:'https://picsum.photos/seed/bkids/400/400', creator:'stars1...n8q', floor_price:3.8, reward_per_day:8.2, badge:null },
  { id:'col-atom-3', chain:'atom', name:'Cosmos Apes', ticker:'CAPE', contract_addr:'cosmos1...cape', image_url:'https://picsum.photos/seed/cape2/400/400', creator:'cosmos1...k2w', floor_price:2.1, reward_per_day:6.0, badge:'charity' },
  { id:'col-atom-4', chain:'atom', name:'Celestine Sloths', ticker:'SLTH', contract_addr:'stars1...slth', image_url:'https://picsum.photos/seed/slth/400/400', creator:'stars1...j5x', floor_price:0.5, reward_per_day:3.2, badge:null },
  { id:'col-atom-5', chain:'atom', name:'Passage3D', ticker:'PASS', contract_addr:'pasg1...pass', image_url:'https://picsum.photos/seed/pass/400/400', creator:'pasg1...p4r', floor_price:1.0, reward_per_day:4.8, badge:null },
  { id:'col-atom-6', chain:'atom', name:'ION Sword', ticker:'IONS', contract_addr:'osmo1...ions', image_url:'https://picsum.photos/seed/ions/400/400', creator:'osmo1...h7s', floor_price:0.3, reward_per_day:7.5, badge:'new' },

  // MegaETH
  { id:'col-mega-1', chain:'megaeth', name:'Doge Uprising', ticker:'DOGE2', contract_addr:'0x7xK...doge', image_url:'https://picsum.photos/seed/doge2/400/400', creator:'0x7xK...m3p', floor_price:0.08, reward_per_day:12.0, badge:null },
  { id:'col-mega-2', chain:'megaeth', name:'SolCat', ticker:'SCAT', contract_addr:'0x3bR...scat', image_url:'https://picsum.photos/seed/solcat/400/400', creator:'0x3bR...n8q', floor_price:0.04, reward_per_day:8.5, badge:null },
  { id:'col-mega-3', chain:'megaeth', name:'HelpPaws', ticker:'PAWS', contract_addr:'0x9fT...paws', image_url:'https://picsum.photos/seed/paws/400/400', creator:'0x9fT...k2w', floor_price:0.15, reward_per_day:6.0, badge:'charity' },
  { id:'col-mega-4', chain:'megaeth', name:'PixelPunk', ticker:'PXPK', contract_addr:'0x6gH...pxpk', image_url:'https://picsum.photos/seed/pxpk/400/400', creator:'0x6gH...i1u', floor_price:0.02, reward_per_day:15.0, badge:'new' },
  { id:'col-mega-5', chain:'megaeth', name:'RocketDog', ticker:'RDOG', contract_addr:'0x7nO...rdog', image_url:'https://picsum.photos/seed/rdog/400/400', creator:'0x7nO...p7x', floor_price:0.03, reward_per_day:10.0, badge:null },
  { id:'col-mega-6', chain:'megaeth', name:'MegaRebel', ticker:'MREB', contract_addr:'0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac', image_url:'https://picsum.photos/seed/megarebel/400/400?random=1', creator:'0xMegaRebel...creator', floor_price:0.25, reward_per_day:20.0, badge:'featured' },

  // Ethereum
  { id:'col-eth-1', chain:'ethereum', name:'Bored Apes', ticker:'BAYC', contract_addr:'0xBC4...bayc', image_url:'https://picsum.photos/seed/bayc/400/400', creator:'0xBC4...a1f', floor_price:15.2, reward_per_day:25.0, badge:null },
  { id:'col-eth-2', chain:'ethereum', name:'CryptoPunks', ticker:'PUNK', contract_addr:'0xb47...punk', image_url:'https://picsum.photos/seed/punk/400/400', creator:'0xb47...e3d', floor_price:22.5, reward_per_day:30.0, badge:null },
  { id:'col-eth-3', chain:'ethereum', name:'Azuki', ticker:'AZUKI', contract_addr:'0xED5...azuki', image_url:'https://picsum.photos/seed/azuki/400/400', creator:'0xED5...b7c', floor_price:5.8, reward_per_day:15.0, badge:null },
  { id:'col-eth-4', chain:'ethereum', name:'Pudgy Penguins', ticker:'PPG', contract_addr:'0x524...ppg', image_url:'https://picsum.photos/seed/ppg/400/400', creator:'0x524...d9e', floor_price:8.2, reward_per_day:18.0, badge:null },
  { id:'col-eth-5', chain:'ethereum', name:'Art Blocks', ticker:'ARTB', contract_addr:'0xa7d...artb', image_url:'https://picsum.photos/seed/artb/400/400', creator:'0xa7d...a3c', floor_price:2.1, reward_per_day:10.0, badge:'charity' },
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
  { chain:'atom', name:'Cosmos Genesis', desc:'Win a rare Cosmos Genesis NFT. Stargaze collection exclusive.', img:'https://picsum.photos/seed/raf1/400/300', price:50, token:'$ATOM', max:500, current:234, hours:3 },
  { chain:'atom', name:'Osmosis Pool Party', desc:'LP providers raffle — win exclusive Osmosis NFTs.', img:'https://picsum.photos/seed/raf2/400/300', price:30, token:'$OSMO', max:200, current:89, hours:6 },
  { chain:'atom', name:'Stargaze Drop', desc:'Community Stargaze NFT drop. 3 winners selected.', img:'https://picsum.photos/seed/raf3/400/300', price:25, token:'$STARS', max:2000, current:1205, hours:13 },
  { chain:'atom', name:'IBC Whale', desc:'High-stakes IBC raffle. Prize: Ultra-rare 1/1 Cosmos NFT.', img:'https://picsum.photos/seed/raf4/400/300', price:500, token:'$ATOM', max:100, current:45, hours:2 },
  { chain:'atom', name:'Celestia Lucky', desc:'Daily Celestia lucky draw with guaranteed winners.', img:'https://picsum.photos/seed/raf5/400/300', price:10, token:'$TIA', max:5000, current:3420, hours:19 },

  // MegaETH
  { chain:'megaeth', name:'Genesis Raffle', desc:'Win a rare Genesis NFT from the original MegaETH collection.', img:'https://picsum.photos/seed/mraf1/400/300', price:50, token:'$REBEL', max:1000, current:567, hours:5 },
  { chain:'megaeth', name:'Golden Ticket', desc:'The golden ticket — one winner takes a legendary NFT worth 5 METH.', img:'https://picsum.photos/seed/mraf2/400/300', price:100, token:'$REBEL', max:500, current:234, hours:8 },
  { chain:'megaeth', name:'Turbo Drop', desc:'TurboSwap exclusive raffle. Speed matters.', img:'https://picsum.photos/seed/mraf3/400/300', price:25, token:'$TURBO', max:1500, current:890, hours:3 },
  { chain:'megaeth', name:'Mega Jackpot', desc:'The biggest MegaETH raffle. 10 METH prize pool.', img:'https://picsum.photos/seed/mraf4/400/300', price:200, token:'$METH', max:1000, current:678, hours:76 },

  // Ethereum
  { chain:'ethereum', name:'Blue Chip Raffle', desc:'Win a blue chip NFT — BAYC, CryptoPunks, or Azuki.', img:'https://picsum.photos/seed/eraf1/400/300', price:0.1, token:'ETH', max:10000, current:4500, hours:56 },
  { chain:'ethereum', name:'DeFi Kings', desc:'DeFi protocol NFT raffle. Exclusive governance perks.', img:'https://picsum.photos/seed/eraf2/400/300', price:50, token:'$UNI', max:3000, current:1200, hours:13 },
  { chain:'ethereum', name:'ENS Premium', desc:'Win a premium 3-letter ENS domain name.', img:'https://picsum.photos/seed/eraf3/400/300', price:0.05, token:'ETH', max:2000, current:890, hours:7 },
  { chain:'ethereum', name:'Pudgy Penguins', desc:'Win a Pudgy Penguin NFT. Community favorite.', img:'https://picsum.photos/seed/eraf5/400/300', price:0.08, token:'ETH', max:4000, current:2300, hours:19 },
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
    insertStake.run(w.wallet, w.chain, tokenId, coll.id, coll.name, `${coll.ticker} #${100 + i}`, `https://picsum.photos/seed/${tokenId}/300/300`, rarity);
  }
  
  // Add sample MegaRebel NFTs for MegaETH user
  if (w.chain === 'megaeth') {
    const megaRebelColl = collections.find(c => c.id === 'col-mega-6');
    for (let j = 0; j < 3; j++) {
      const tokenId = `mreb_${w.wallet.slice(-4)}_${j}`;
      const rarity = rarities[Math.floor(Math.random() * rarities.length)];
      insertStake.run(w.wallet, w.chain, tokenId, megaRebelColl.id, megaRebelColl.name, `MREB #${1000 + j}`, `https://picsum.photos/seed/megarebel_${j}/300/300?random=${j}`, rarity);
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
