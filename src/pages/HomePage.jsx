import React, { useContext, useState, useRef, useEffect } from 'react'
import { AppContext } from '../context/AppContext'

// ===== MYSTERY PACK CARD =====
function MysteryPackCard() {
  const [phase, setPhase] = useState('idle') // idle | shaking | opening | revealed
  const [reward, setReward] = useState(null)

  const REWARDS = [
    { type: 'NFT', name: 'MegaRebel #387', rarity: 'Legendary', color: '#f59e0b', img: 'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/e92cfaf6b7d8374fccab2c59a43865/68e92cfaf6b7d8374fccab2c59a43865.png?w=500' },
    { type: 'Token', name: '500 $REBEL', rarity: 'Epic', color: '#8b5cf6', img: null },
    { type: 'NFT', name: 'MegaRebel #112', rarity: 'Rare', color: '#3b82f6', img: 'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/9bd966398679eb141a0ab8f0775b4b/119bd966398679eb141a0ab8f0775b4b.png?w=500' },
    { type: 'Token', name: '100 $METH', rarity: 'Common', color: '#6b7280', img: null },
    { type: 'NFT', name: 'MegaRebel #205', rarity: 'Epic', color: '#8b5cf6', img: 'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/038a27ca06b9325ef860eed85e38e7/0b038a27ca06b9325ef860eed85e38e7.png?w=500' },
  ]

  const handleClick = () => {
    if (phase === 'idle') {
      setPhase('shaking')
      setTimeout(() => setPhase('opening'), 800)
      setTimeout(() => {
        const r = REWARDS[Math.floor(Math.random() * REWARDS.length)]
        setReward(r)
        setPhase('revealed')
      }, 1600)
    } else if (phase === 'revealed') {
      setPhase('idle')
      setReward(null)
    }
  }

  const rarityColor = reward ? reward.color : '#7c3aed'

  return (
    <div
      onClick={handleClick}
      style={{
        flex: '0 0 220px',
        scrollSnapAlign: 'start',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <style>{`
        @keyframes packShake {
          0%,100% { transform: rotate(0deg) scale(1); }
          15% { transform: rotate(-6deg) scale(1.05); }
          30% { transform: rotate(6deg) scale(1.05); }
          45% { transform: rotate(-4deg) scale(1.08); }
          60% { transform: rotate(4deg) scale(1.08); }
          75% { transform: rotate(-2deg) scale(1.06); }
          90% { transform: rotate(2deg) scale(1.06); }
        }
        @keyframes packOpen {
          0% { transform: scale(1) rotateY(0deg); opacity: 1; }
          40% { transform: scale(1.15) rotateY(40deg); opacity: 0.7; }
          100% { transform: scale(0) rotateY(90deg); opacity: 0; }
        }
        @keyframes cardReveal {
          0% { transform: scale(0.3) rotateY(-90deg); opacity: 0; }
          60% { transform: scale(1.1) rotateY(10deg); opacity: 1; }
          80% { transform: scale(0.95) rotateY(-5deg); }
          100% { transform: scale(1) rotateY(0deg); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes floatParticle {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-60px) scale(0); opacity: 0; }
        }
        .mystery-pack-wrap {
          width: 220px;
          height: 290px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mystery-pack-body {
          width: 160px;
          height: 240px;
          border-radius: 16px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #1e1b4b, #312e81, #4c1d95);
          border: 2px solid #7c3aed;
          box-shadow: 0 0 30px rgba(124,58,237,0.5), 0 0 60px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.1);
          transition: box-shadow 0.3s;
          overflow: hidden;
        }
        .mystery-pack-body::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%);
          background-size: 200% 200%;
          animation: shimmer 3s linear infinite;
          border-radius: 14px;
        }
        .mystery-pack-body.shaking {
          animation: packShake 0.8s ease-in-out;
        }
        .mystery-pack-body.opening {
          animation: packOpen 0.8s ease-in forwards;
        }
        .pack-icon {
          font-size: 52px;
          margin-bottom: 8px;
          filter: drop-shadow(0 0 12px rgba(124,58,237,0.8));
        }
        .pack-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #a78bfa;
          margin-bottom: 4px;
        }
        .pack-title {
          font-size: 16px;
          font-weight: 800;
          color: #fff;
          text-align: center;
          padding: 0 12px;
        }
        .pack-tap-hint {
          font-size: 11px;
          color: #7c3aed;
          margin-top: 12px;
          animation: pulse 2s ease-in-out infinite;
        }
        .pack-glow-ring {
          position: absolute;
          width: 180px; height: 180px;
          border-radius: 50%;
          border: 1px solid rgba(124,58,237,0.3);
          animation: pulse 2s ease-in-out infinite;
          pointer-events: none;
        }
        .revealed-card {
          width: 160px;
          height: 240px;
          border-radius: 16px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          overflow: hidden;
          animation: cardReveal 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards;
          border: 2px solid;
          box-shadow: 0 0 30px rgba(0,0,0,0.5);
        }
        .revealed-card-img {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
        }
        .revealed-card-overlay {
          position: relative;
          z-index: 2;
          width: 100%;
          padding: 12px;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%);
          text-align: center;
        }
        .revealed-rarity {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .revealed-name {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
        }
        .revealed-type {
          font-size: 11px;
          color: rgba(255,255,255,0.6);
          margin-top: 2px;
        }
        .particle {
          position: absolute;
          width: 6px; height: 6px;
          border-radius: 50%;
          animation: floatParticle 1s ease-out forwards;
          pointer-events: none;
        }
      `}</style>

      <div className="mystery-pack-wrap">
        {/* Particles on reveal */}
        {phase === 'revealed' && reward && [0,1,2,3,4,5].map(i => (
          <div key={i} className="particle" style={{
            background: rarityColor,
            left: `${20 + i * 30}px`,
            top: `${40 + (i % 3) * 20}px`,
            animationDelay: `${i * 0.1}s`,
          }} />
        ))}

        {phase !== 'revealed' ? (
          <div className={`mystery-pack-body ${phase}`}>
            <div className="pack-glow-ring" />
            <div className="pack-icon">🎴</div>
            <div className="pack-label">Mystery</div>
            <div className="pack-title">NFT Pack</div>
            <div className="pack-tap-hint">
              {phase === 'idle' ? '✦ Tap to open' : phase === 'shaking' ? '✦ Shaking...' : '✦ Opening...'}
            </div>
          </div>
        ) : (
          <div className="revealed-card" style={{ borderColor: rarityColor, boxShadow: `0 0 30px ${rarityColor}66` }}>
            {reward.img ? (
              <img src={reward.img} alt={reward.name} className="revealed-card-img" />
            ) : (
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(135deg, ${rarityColor}33, ${rarityColor}11)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 48,
              }}>
                {reward.type === 'Token' ? '🪙' : '🎴'}
              </div>
            )}
            <div className="revealed-card-overlay">
              <div className="revealed-rarity" style={{ color: rarityColor }}>{reward.rarity}</div>
              <div className="revealed-name">{reward.name}</div>
              <div className="revealed-type">{reward.type} · Tap to reset</div>
            </div>
          </div>
        )}
      </div>

      {/* Label bawah */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 2px 0', fontSize: 13, fontWeight: 600 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#7c3aed', fontSize: 13, fontWeight: 700 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7c3aed', display: 'inline-block', boxShadow: '0 0 6px #7c3aed' }}></span>
          SPECIAL
        </span>
        <span style={{ color: 'var(--muted)', fontSize: 12 }}>Mystery Pack</span>
      </div>
    </div>
  )
}

const COINS_BY_CHAIN = {
  atom: [
    { symbol: '$ATOM', name: 'Cosmos', img: 'https://picsum.photos/seed/atom/80/80', val: '$1.5M', rawVal: 1500000, change: '+9.4%', up: true },
    { symbol: '$OSMO', name: 'Osmosis', img: 'https://picsum.photos/seed/osmo/80/80', val: '$890K', rawVal: 890000, change: '+5.2%', up: true },
    { symbol: '$JUNO', name: 'Juno', img: 'https://picsum.photos/seed/juno/80/80', val: '$234K', rawVal: 234000, change: '-2.1%', up: false },
    { symbol: '$STARS', name: 'Stargaze', img: 'https://picsum.photos/seed/stars/80/80', val: '$156K', rawVal: 156000, change: '+18.3%', up: true },
    { symbol: '$INJ', name: 'Injective', img: 'https://picsum.photos/seed/inj/80/80', val: '$3.2M', rawVal: 3200000, change: '+12.7%', up: true },
    { symbol: '$TIA', name: 'Celestia', img: 'https://picsum.photos/seed/tia/80/80', val: '$2.8M', rawVal: 2800000, change: '+7.1%', up: true },
    { symbol: '$KUJI', name: 'Kujira', img: 'https://picsum.photos/seed/kuji/80/80', val: '$78K', rawVal: 78000, change: '-4.5%', up: false },
    { symbol: '$AKT', name: 'Akash', img: 'https://picsum.photos/seed/akt/80/80', val: '$1.1M', rawVal: 1100000, change: '+22.8%', up: true },
  ],
  megaeth: [
    { symbol: '$METH', name: 'MegaETH', img: 'https://picsum.photos/seed/mega/80/80', val: '$4.8M', rawVal: 4800000, change: '+5.6%', up: true },
    { symbol: '$REBEL', name: 'Rebel Token', img: 'https://picsum.photos/seed/rebel/80/80', val: '$2.1M', rawVal: 2100000, change: '+22.1%', up: true },
    { symbol: '$TURBO', name: 'TurboSwap', img: 'https://picsum.photos/seed/turbo/80/80', val: '$890K', rawVal: 890000, change: '+34.5%', up: true },
    { symbol: '$BLITZ', name: 'Blitz Finance', img: 'https://picsum.photos/seed/blitz/80/80', val: '$567K', rawVal: 567000, change: '+8.9%', up: true },
    { symbol: '$FLASH', name: 'FlashLend', img: 'https://picsum.photos/seed/flash/80/80', val: '$345K', rawVal: 345000, change: '-5.2%', up: false },
    { symbol: '$HYPER', name: 'HyperDEX', img: 'https://picsum.photos/seed/hyper/80/80', val: '$234K', rawVal: 234000, change: '+15.3%', up: true },
  ],
  ethereum: [
    { symbol: '$ETH', name: 'Ethereum', img: 'https://picsum.photos/seed/eth/80/80', val: '$12.3M', rawVal: 12300000, change: '+2.4%', up: true },
    { symbol: '$UNI', name: 'Uniswap', img: 'https://picsum.photos/seed/uni/80/80', val: '$8.9M', rawVal: 8900000, change: '+4.1%', up: true },
    { symbol: '$AAVE', name: 'Aave', img: 'https://picsum.photos/seed/aave/80/80', val: '$5.6M', rawVal: 5600000, change: '+6.8%', up: true },
    { symbol: '$LINK', name: 'Chainlink', img: 'https://picsum.photos/seed/link/80/80', val: '$4.2M', rawVal: 4200000, change: '-1.3%', up: false },
    { symbol: '$LDO', name: 'Lido DAO', img: 'https://picsum.photos/seed/ldo/80/80', val: '$3.8M', rawVal: 3800000, change: '+3.5%', up: true },
    { symbol: '$MKR', name: 'Maker', img: 'https://picsum.photos/seed/mkr/80/80', val: '$2.9M', rawVal: 2900000, change: '+1.9%', up: true },
  ],
}

const SAMPLE_RAFFLES = [
  { id: 1, name: 'Mega Prize Raffle', entries: 1234, maxEntries: 2000, prize: '10 ETH', token: '$METH', ticketPrice: '50 $METH', img: 'https://picsum.photos/seed/raffle1/400/400', endsIn: '2d 14h 30m' },
  { id: 2, name: 'NFT Collection Drop', entries: 567, maxEntries: 1000, prize: '5 NFTs', token: '$REBEL', ticketPrice: '20 $REBEL', img: 'https://picsum.photos/seed/raffle2/400/400', endsIn: '1d 6h 15m' },
  { id: 3, name: 'Token Airdrop', entries: 2891, maxEntries: 5000, prize: '1000 TOKENS', token: '$TURBO', ticketPrice: '10 $TURBO', img: 'https://picsum.photos/seed/raffle3/400/400', endsIn: '3d 2h 45m' },
  { id: 4, name: 'Golden Ticket', entries: 345, maxEntries: 500, prize: 'VIP Pass', token: '$METH', ticketPrice: '100 $METH', img: 'https://picsum.photos/seed/raffle4/400/400', endsIn: '12h 30m' },
  { id: 5, name: 'Whale Raffle', entries: 890, maxEntries: 1500, prize: '50 ETH', token: '$ETH', ticketPrice: '0.1 ETH', img: 'https://picsum.photos/seed/raffle5/400/400', endsIn: '5d 8h' },
]

const SAMPLE_COLLECTIONS = [
  { id: 1, name: 'MegaRebel', staked: 234, desc: 'The original MegaETH rebel collection. Stake to earn daily rewards.', img: 'https://picsum.photos/seed/coll1/400/400', badge: 'new' },
  { id: 2, name: 'Cosmic Apes', staked: 567, desc: 'Cosmic apes from the Cosmos ecosystem. High APY staking rewards.', img: 'https://picsum.photos/seed/coll2/400/400', badge: null },
  { id: 3, name: 'Digital Dreams', staked: 123, desc: 'Dreamy digital art collection with unique staking mechanics.', img: 'https://picsum.photos/seed/coll3/400/400', badge: 'new' },
  { id: 4, name: 'Pixel Paradise', staked: 456, desc: 'Pixel art NFTs with charity donation features.', img: 'https://picsum.photos/seed/coll4/400/400', badge: 'charity' },
  { id: 5, name: 'Neon Nights', staked: 789, desc: 'Neon-themed collection with the highest staking rewards.', img: 'https://picsum.photos/seed/coll5/400/400', badge: null },
  { id: 6, name: 'Retro Vibes', staked: 234, desc: 'Retro-style NFTs celebrating the early days of crypto.', img: 'https://picsum.photos/seed/coll6/400/400', badge: null },
  { id: 7, name: 'CryptoKitties', staked: 1024, desc: 'Classic crypto collectibles reimagined for the modern era.', img: 'https://picsum.photos/seed/coll7/400/400', badge: null },
  { id: 8, name: 'Space Rebels', staked: 312, desc: 'Space-themed rebels fighting for decentralization.', img: 'https://picsum.photos/seed/coll8/400/400', badge: 'new' },
]

const EXPLORE_TABS = ['All', 'Cosmos', 'MegaETH', 'Ethereum']

export default function HomePage() {
  const { activeChain, setCurrentPage } = useContext(AppContext)
  const coins = COINS_BY_CHAIN[activeChain] || []
  const [selectedCoin, setSelectedCoin] = useState('all')
  const [exploreTab, setExploreTab] = useState('All')
  const trendingRef = useRef(null)
  const collectionRef = useRef(null)

  const [raffles, setRaffles] = useState([])
  const [collections, setCollections] = useState([])

  // Helper: convert ISO date to countdown string
  const toCountdown = (endsAt) => {
    if (!endsAt) return '—'
    const diff = new Date(endsAt) - new Date()
    if (diff <= 0) return 'Ended'
    const d = Math.floor(diff / 86400000)
    const h = Math.floor((diff % 86400000) / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    if (d > 0) return `${d}d ${h}h ${m}m`
    if (h > 0) return `${h}h ${m}m`
    return `${m}m`
  }

  // Fetch real data from API
  useEffect(() => {
    fetch('/api/raffles')
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : (data?.raffles || data?.data || [])
        if (arr.length) setRaffles(arr)
      })
      .catch(() => {})
    fetch('/api/collections')
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : (data?.collections || data?.data || [])
        if (arr.length) setCollections(arr)
      })
      .catch(() => {})
  }, [])

  const scrollTrack = (ref, amt) => {
    ref.current?.scrollBy({ left: amt, behavior: 'smooth' })
  }

  const filteredRaffles = selectedCoin === 'all'
    ? raffles
    : raffles.filter(r => r.token === selectedCoin || r.symbol === selectedCoin)

  return (
    <div>
      {/* ===== TICKER SECTION ===== */}
      <div className="ticker-section">
        <div className="ticker-header">
          <span className="ticker-title section-title">Top Coins</span>
          <a
            href="#"
            className="ticker-viewall"
            onClick={(e) => { e.preventDefault(); setCurrentPage('topcoins') }}
          >
            View My Coins
          </a>
        </div>
        <div className="ticker-track" id="tickerTrack">
          {/* All button */}
          <div
            className={`ticker-item ticker-item-all${selectedCoin === 'all' ? ' ticker-item-active' : ''}`}
            onClick={() => setSelectedCoin('all')}
          >
            <span className="ticker-symbol" style={{ fontSize: '12px' }}>All</span>
          </div>
          {/* Coin items */}
          {coins.slice(0, 10).map((c, i) => (
            <div
              key={c.symbol}
              className={`ticker-item${selectedCoin === c.symbol ? ' ticker-item-active' : ''}`}
              data-symbol={c.symbol}
              onClick={() => setSelectedCoin(c.symbol)}
            >
              <span className="ticker-rank">{i + 1}</span>
              <div className="ticker-avatar">
                <img src={c.img} alt={c.name} />
              </div>
              <div className="ticker-info">
                <span className="ticker-symbol">{c.symbol}</span>
                <span className="ticker-name">{c.name}</span>
              </div>
              <div className="ticker-price">
                <span className="ticker-val" data-raw={c.rawVal}>{c.val}</span>
                <span className={`ticker-change ${c.up ? 'up' : 'down'}`}>{c.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== TRENDING RAFFLE SECTION ===== */}
      <div className="trending-section">
        <div className="trending-header">
          <span className="section-title">Trending Raffle</span>
          <div className="trending-nav">
            <button className="trend-arrow" onClick={() => scrollTrack(trendingRef, -320)}>&#8249;</button>
            <button className="trend-arrow" onClick={() => scrollTrack(trendingRef, 320)}>&#8250;</button>
          </div>
        </div>
        <div className="trending-track" id="trendingTrack" ref={trendingRef}>
          {/* Mystery Pack — special raffle card */}
          <MysteryPackCard />
          {filteredRaffles.map(r => {
            const entries = r.currentEntries ?? r.entries ?? 0
            const maxEntries = r.maxEntries ?? 2000
            const endsIn = r.endsIn || toCountdown(r.endsAt)
            const name = r.name || r.title || 'Raffle'
            const token = r.token || r.symbol || '$METH'
            const prize = r.prize || r.prizeValue || '—'
            const ticketPrice = r.ticketPrice || r.price ? `${r.price} ${token}` : '—'
            const img = r.imageUrl || r.img || r.image || `https://picsum.photos/seed/raffle${r.id}/400/400`
            return (
              <div key={r.id} className="coll-card" style={{ flex: '0 0 290px', scrollSnapAlign: 'start' }}>
                {/* Card image area */}
                <div className="coll-card-img" style={{ width: 290, height: 290 }}>
                  <img src={img} alt={name} />

                  {/* Default overlay: nama atas, entries bawah */}
                  <div className="coll-card-name-overlay" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                    <span className="coll-card-name">{name}</span>
                    <span className="coll-card-staked">{Number(entries).toLocaleString()} entries</span>
                  </div>

                  {/* Hover overlay */}
                  <div className="coll-card-overlay">
                    <div className="coll-overlay-name overlay-slide-up">{name}</div>
                    <div className="coll-overlay-desc raffle-hover-content">
                      <div className="raffle-hover-item">Prize: <b>{prize}</b></div>
                      <div className="raffle-hover-item">1 ticket: <b>{r.ticketPrice || '—'}</b></div>
                      <div className="raffle-hover-item">Sold: <b>{Number(entries).toLocaleString()} / {Number(maxEntries).toLocaleString()}</b></div>
                    </div>
                    <button className="coll-overlay-btn buy overlay-slide-up-btn">Enter Raffle</button>
                  </div>
                </div>

                {/* LIVE badge + countdown — di LUAR card, di bawah, no background */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 2px 0',
                  fontSize: 13, fontWeight: 600,
                  background: 'none', border: 'none',
                }}>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    color: 'var(--green)',
                    fontSize: 13, fontWeight: 700,
                  }}>
                    <span className="live-dot" style={{ width: 7, height: 7 }}></span>
                    LIVE
                  </span>
                  <span style={{ color: 'var(--green)', fontSize: 13, fontWeight: 600 }}>
                    {endsIn}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ===== EXPLORE COLLECTION SECTION ===== */}
      <div className="explore-section">
        <div className="trending-header">
          <span className="section-title">Explore Collection</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="explore-tabs" style={{ marginBottom: 0 }}>
              {EXPLORE_TABS.map(tab => (
                <button
                  key={tab}
                  className={`explore-tab${exploreTab === tab ? ' active' : ''}`}
                  onClick={() => setExploreTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="trending-nav">
              <button className="trend-arrow" onClick={() => scrollTrack(collectionRef, -320)}>&#8249;</button>
              <button className="trend-arrow" onClick={() => scrollTrack(collectionRef, 320)}>&#8250;</button>
            </div>
          </div>
        </div>
        {/* Horizontal scroll track — same style as trending raffle */}
        <div className="trending-track" id="collectionTrack" ref={collectionRef}>
          {collections.map(coll => {
            const name = coll.name || 'Collection'
            const staked = coll.totalStaked ?? coll.staked ?? coll.stakers ?? coll.stakedCount ?? 0
            const desc = coll.desc || coll.description || 'Stake NFTs to earn daily rewards.'
            const rewardRate = coll.rewardPerDay || coll.rewardRate || coll.reward_rate || null
            const img = coll.imageUrl || coll.img || coll.image || `https://picsum.photos/seed/coll${coll.id}/400/400`
            const badge = coll.badge || null
            return (
              <div key={coll.id} className="coll-card" style={{ flex: '0 0 290px', scrollSnapAlign: 'start' }}>
                <div className="coll-card-img" style={{ width: 290, height: 290 }}>
                  <img src={img} alt={name} />

                  {/* Badge pojok kiri atas — skip charity */}
                  {badge && badge !== 'charity' && (
                    <div className={`coll-badge ${badge}`}>
                      {badge.charAt(0).toUpperCase() + badge.slice(1)}
                    </div>
                  )}

                  {/* Default overlay: nama di atas, staked di bawah */}
                  <div className="coll-card-name-overlay" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                    <span className="coll-card-name">{name}</span>
                    <span className="coll-card-staked">{Number(staked).toLocaleString()} staked</span>
                  </div>

                  {/* Hover overlay: nama + desc + button */}
                  <div className="coll-card-overlay">
                    <div className="coll-overlay-name">{name}</div>
                    <div className="coll-overlay-desc">{desc}</div>
                    <button className="coll-overlay-btn stake">Stake NFT</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
