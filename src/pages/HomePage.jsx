import React, { useContext, useState, useRef, useEffect } from 'react'
import { AppContext } from '../context/AppContext'

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
  { id: 1, name: 'Mega Prize Raffle', entries: 1234, maxEntries: 2000, prize: '10 ETH', token: '$METH', img: 'https://picsum.photos/seed/raffle1/400/400', endsIn: '2d 14h 30m' },
  { id: 2, name: 'NFT Collection Drop', entries: 567, maxEntries: 1000, prize: '5 NFTs', token: '$REBEL', img: 'https://picsum.photos/seed/raffle2/400/400', endsIn: '1d 6h 15m' },
  { id: 3, name: 'Token Airdrop', entries: 2891, maxEntries: 5000, prize: '1000 TOKENS', token: '$TURBO', img: 'https://picsum.photos/seed/raffle3/400/400', endsIn: '3d 2h 45m' },
  { id: 4, name: 'Golden Ticket', entries: 345, maxEntries: 500, prize: 'VIP Pass', token: '$METH', img: 'https://picsum.photos/seed/raffle4/400/400', endsIn: '12h 30m' },
  { id: 5, name: 'Whale Raffle', entries: 890, maxEntries: 1500, prize: '50 ETH', token: '$ETH', img: 'https://picsum.photos/seed/raffle5/400/400', endsIn: '5d 8h' },
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

  const [raffles, setRaffles] = useState(SAMPLE_RAFFLES)
  const [collections, setCollections] = useState(SAMPLE_COLLECTIONS)

  // Try to fetch real data from API
  useEffect(() => {
    fetch('/api/raffles')
      .then(r => r.json())
      .then(data => { if (data?.raffles?.length) setRaffles(data.raffles) })
      .catch(() => {})
    fetch('/api/collections')
      .then(r => r.json())
      .then(data => { if (data?.collections?.length) setCollections(data.collections) })
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
          {filteredRaffles.map(r => {
            const entries = r.currentEntries ?? r.entries ?? 0
            const maxEntries = r.maxEntries ?? 2000
            const pct = Math.round((entries / maxEntries) * 100)
            const endsIn = r.endsIn || '2d 14h 30m'
            const name = r.name || r.title || 'Raffle'
            const token = r.token || r.symbol || '$METH'
            const img = r.img || r.image || `https://picsum.photos/seed/raffle${r.id}/400/400`
            return (
              <div
                key={r.id}
                className="trending-card"
                onClick={() => alert(`Open raffle: ${name}`)}
              >
                <div className="trending-img">
                  <img src={img} alt={name} />
                  <div className="trending-overlay">
                    <div className="trending-mcap">{entries.toLocaleString()}</div>
                    <div className="trending-label">{name}</div>
                    <div className="trending-ticker">{token}</div>
                  </div>
                  <div className="raffle-hover-btn"><span>Enter Raffle</span></div>
                </div>
                <div className="trending-bottom">
                  <div className="trending-live-dot"></div>
                  End in {endsIn}
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
          <div className="explore-tabs">
            {EXPLORE_TABS.map(tab => (
              <button
                key={tab}
                className={`explore-tab${exploreTab === tab ? ' active' : ''}`}
                onClick={() => setExploreTab(tab)}
              >
                {tab}
              </button>
            ))}
            <div className="explore-tab-actions">
              <button className="tab-action-btn" title="Grid view">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
              </button>
              <button className="tab-action-btn" title="List view">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="collection-grid" id="collectionGrid">
          {collections.map(coll => {
            const name = coll.name || 'Collection'
            const staked = coll.staked ?? coll.stakers ?? coll.stakedCount ?? 0
            const desc = coll.desc || coll.description || 'Stake NFTs to earn daily rewards.'
            const img = coll.img || coll.image || `https://picsum.photos/seed/coll${coll.id}/400/400`
            const badge = coll.badge || null
            return (
              <div
                key={coll.id}
                className="coll-card"
                onClick={() => alert(`Open collection: ${name}`)}
              >
                <div className="coll-card-img">
                  <img src={img} alt={name} />
                  {badge && (
                    <div className={`coll-badge ${badge}`}>
                      {badge.charAt(0).toUpperCase() + badge.slice(1)}
                    </div>
                  )}
                  <div className="coll-card-name-overlay">
                    <span className="coll-card-name">{name}</span>
                    <span className="coll-card-staked">{staked} staked</span>
                  </div>
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
