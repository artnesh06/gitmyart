# 🎨 MegaRebel Collection Update

**Date:** May 3, 2026  
**Status:** ✅ Complete

---

## What's Updated

### MegaRebel Collection
- **Contract:** `0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac`
- **Ticker:** MREB
- **Chain:** MegaETH
- **Floor Price:** 0.25 ETH
- **Reward Rate:** 20 pts/day (highest on MegaETH)
- **Badge:** Featured
- **Image:** Dynamic placeholder from picsum.photos

### Demo Staked NFTs
Added 3 sample MegaRebel NFTs to demo user on MegaETH chain:
- `MREB #1000` - Random rarity
- `MREB #1001` - Random rarity
- `MREB #1002` - Random rarity

Each NFT has:
- Unique image URL (dynamic placeholder)
- Random rarity (common, rare, epic, legendary)
- Proper collection reference
- Ready for staking/unstaking demo

---

## How to Use

### View MegaRebel Collection
```bash
curl http://localhost:3456/api/collections
```

### View Demo Staked MegaRebel NFTs
Login as demo user:
```bash
curl -X POST http://localhost:3456/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"wallet":"0x7aB2demo3f1dxxxx","chain":"megaeth"}'
```

Then get staked NFTs:
```bash
curl http://localhost:3456/api/stake/my \
  -H "x-session-token: YOUR_TOKEN"
```

---

## Files Changed
- `server/seed.js` — Added MegaRebel NFT samples to demo user

---

## Links

| | URL |
|--|--|
| 🚀 **Live** | https://gitmyart.vercel.app |
| 💻 **Local** | http://localhost:5173 |
| ⚙️ **Backend** | http://localhost:3456 |
| 📦 **GitHub** | https://github.com/artnesh06/gitmyart |

---

## Next Steps

1. ✅ MegaRebel collection added with images
2. ✅ Demo NFTs seeded
3. ⏳ Test staking/unstaking with MegaRebel NFTs
4. ⏳ Verify rewards calculation (20 pts/day)
5. ⏳ Test on live Vercel deployment

---

**Commit:** `be4ead7` - "feat: add MegaRebel NFT samples to demo staked NFTs with proper images"

