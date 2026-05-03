import React, { useContext, useState, useRef, useEffect } from 'react'
import { AppContext } from '../context/AppContext'

// ===== MYSTERY PACK — Pokemon Style =====
const PACK_CARDS = [
  { id:1, name:'MegaRebel #387', rarity:'Legendary', color:'#f59e0b', type:'NFT', img:'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/e92cfaf6b7d8374fccab2c59a43865/68e92cfaf6b7d8374fccab2c59a43865.png?w=500' },
  { id:2, name:'MegaRebel #112', rarity:'Epic',      color:'#8b5cf6', type:'NFT', img:'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/9bd966398679eb141a0ab8f0775b4b/119bd966398679eb141a0ab8f0775b4b.png?w=500' },
  { id:3, name:'MegaRebel #205', rarity:'Rare',      color:'#3b82f6', type:'NFT', img:'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/038a27ca06b9325ef860eed85e38e7/0b038a27ca06b9325ef860eed85e38e7.png?w=500' },
  { id:4, name:'MegaRebel #441', rarity:'Rare',      color:'#3b82f6', type:'NFT', img:'https://i2c.seadn.io/megaeth/0xeb8a15bb1b9842bee34caf5823bc7a7017c0d4ac/c103c8a1ef82658fb71d040a023e0c/8dc103c8a1ef82658fb71d040a023e0c.png?w=500' },
  { id:5, name:'500 $REBEL',     rarity:'Common',    color:'#6b7280', type:'Token', img:null },
]

const PACK_CSS = `
  @keyframes tearTop {
    0%   { transform: translateY(0) rotate(0deg); opacity:1; }
    100% { transform: translateY(-120px) rotate(-15deg); opacity:0; }
  }
  @keyframes tearBottom {
    0%   { transform: translateY(0) rotate(0deg); opacity:1; }
    100% { transform: translateY(80px) rotate(8deg); opacity:0; }
  }
  @keyframes cardFanIn {
    0%   { transform: translateX(var(--tx)) translateY(calc(var(--ty) + 40px)) rotate(var(--r)) scale(0.6); opacity:0; }
    100% { transform: translateX(var(--tx)) translateY(var(--ty)) rotate(var(--r)) scale(1); opacity:1; }
  }
  @keyframes winReveal {
    0%   { transform: scale(0.5) rotateY(-90deg); opacity:0; }
    60%  { transform: scale(1.08) rotateY(8deg);  opacity:1; }
    80%  { transform: scale(0.97) rotateY(-3deg); }
    100% { transform: scale(1)    rotateY(0deg);  opacity:1; }
  }
  @keyframes confettiFall {
    0%   { transform: translateY(-20px) rotate(0deg); opacity:1; }
    100% { transform: translateY(160px) rotate(720deg); opacity:0; }
  }
  .mp-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.88);
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(8px);
  }
  .mp-modal {
    position: relative;
    width: 480px;
    min-height: 460px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 40px 24px 32px;
  }
  .mp-close {
    position: absolute; top: -36px; right: 0;
    background: none; border: none; color: rgba(255,255,255,0.5);
    font-size: 26px; cursor: pointer; line-height:1;
    transition: color 0.2s;
  }
  .mp-close:hover { color: #fff; }
  .mp-pack-visual {
    width: 200px; height: 300px;
    border-radius: var(--radius, 16px);
    background: linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%);
    border: 2px solid rgba(124,58,237,0.5);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .mp-pack-visual:hover { transform: scale(1.03); }
  .mp-pack-shine {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
    pointer-events: none;
  }
  .mp-tear-line {
    position: absolute; top: 50%; left: 0; right: 0; height: 2px;
    background: repeating-linear-gradient(90deg, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0.35) 6px, transparent 6px, transparent 12px);
  }
  .mp-pack-top {
    position: absolute; top: 0; left: 0; right: 0; height: 50%;
    background: linear-gradient(160deg, #1e1b4b, #312e81);
    border-radius: var(--radius, 16px) var(--radius, 16px) 0 0;
    display: flex; align-items: center; justify-content: center;
    transform-origin: top center;
  }
  .mp-pack-bottom {
    position: absolute; bottom: 0; left: 0; right: 0; height: 50%;
    background: linear-gradient(160deg, #312e81, #4c1d95);
    border-radius: 0 0 var(--radius, 16px) var(--radius, 16px);
    transform-origin: bottom center;
  }
  .mp-tearing .mp-pack-top { animation: tearTop 0.5s ease-in forwards; }
  .mp-tearing .mp-pack-bottom { animation: tearBottom 0.5s ease-in forwards; }
  .mp-fan-area {
    position: relative;
    width: 400px; height: 280px;
    display: flex; align-items: flex-end; justify-content: center;
  }
  .mp-fan-card {
    position: absolute;
    width: 130px; height: 200px;
    border-radius: var(--radius, 12px);
    cursor: pointer;
    overflow: hidden;
    border: 2px solid rgba(255,255,255,0.12);
    background: #1a1a2e;
    animation: cardFanIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
    animation-delay: var(--delay);
    opacity: 0;
    transition: border-color 0.2s;
  }
  .mp-fan-card:hover {
    border-color: rgba(255,255,255,0.5);
    z-index: 10 !important;
  }
  .mp-fan-card-back {
    width: 100%; height: 100%;
    background: linear-gradient(135deg, #1e1b4b, #312e81);
    display: flex; align-items: center; justify-content: center;
    font-size: 40px;
    position: relative;
  }
  .mp-fan-card-back::after {
    content: '';
    position: absolute; inset: 8px;
    border: 1px solid rgba(124,58,237,0.35);
    border-radius: max(4px, calc(var(--radius, 12px) - 4px));
  }
  .mp-win-card {
    width: 220px; height: 320px;
    border-radius: var(--radius, 16px);
    overflow: hidden;
    position: relative;
    animation: winReveal 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards;
    border: 2px solid;
  }
  .mp-win-img { width: 100%; height: 100%; object-fit: cover; }
  .mp-win-overlay {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 16px 14px 14px;
    background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%);
    text-align: center;
  }
  .mp-confetti {
    position: absolute;
    width: 8px; height: 8px; border-radius: 2px;
    animation: confettiFall 1.4s ease-in forwards;
    pointer-events: none;
  }
  .mp-label { font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #a78bfa; margin-bottom: 8px; }
  .mp-hint { margin-top: 16px; font-size: 13px; color: rgba(255,255,255,0.45); text-align: center; }
`

function MysteryPackModal({ onClose }) {
  const [phase, setPhase] = useState('pack')
  const [winner, setWinner] = useState(null)
  const [confetti, setConfetti] = useState([])

  const openPack = () => {
    if (phase !== 'pack') return
    setPhase('tearing')
    setTimeout(() => setPhase('fan'), 600)
  }

  const pickCard = (card) => {
    if (phase !== 'fan') return
    setWinner(card)
    setPhase('win')
    setConfetti(Array.from({length: 20}, (_, i) => ({
      id: i,
      x: 40 + Math.random() * 360,
      color: ['#f59e0b','#8b5cf6','#3b82f6','#10b981','#ef4444','#fff'][i % 6],
      delay: Math.random() * 0.6,
    })))
  }

  const fanAngles  = [-24, -12, 0, 12, 24]
  const fanOffsets = [
    { x: -140, y: 20 },
    { x: -70,  y: -10 },
    { x: 0,    y: -20 },
    { x: 70,   y: -10 },
    { x: 140,  y: 20 },
  ]

  return (
    <div className="mp-overlay" onClick={e => e.target.classList.contains('mp-overlay') && onClose()}>
      <style>{PACK_CSS}</style>
      <div className="mp-modal">
        <button className="mp-close" onClick={onClose}>✕</button>

        {phase === 'pack' && (
          <>
            <div className="mp-label">Mystery Pack</div>
            <div style={{fontSize:22, fontWeight:800, color:'#fff', marginBottom:24}}>NFT Pack</div>
            <div className={`mp-pack-visual`} onClick={openPack}>
              <div className="mp-pack-shine" />
              <div className="mp-tear-line" />
              <div style={{fontSize:52, marginBottom:8}}>🎴</div>
              <div style={{fontSize:11, color:'#a78bfa', fontWeight:700, letterSpacing:2}}>MYSTERY</div>
              <div style={{fontSize:18, color:'#fff', fontWeight:800}}>NFT PACK</div>
            </div>
            <div className="mp-hint">Tap the pack to open</div>
          </>
        )}

        {phase === 'tearing' && (
          <>
            <div className="mp-label">Opening...</div>
            <div style={{width:200, height:300, position:'relative'}}>
              <div className={`mp-pack-visual mp-tearing`} style={{cursor:'default'}}>
                <div className="mp-pack-top"><div style={{fontSize:52}}>🎴</div></div>
                <div className="mp-pack-bottom" />
                <div className="mp-tear-line" />
              </div>
            </div>
          </>
        )}

        {phase === 'fan' && (
          <>
            <div className="mp-label">Pick a Card</div>
            <div style={{fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:24}}>Choose one to reveal your prize</div>
            <div className="mp-fan-area">
              {PACK_CARDS.map((card, i) => (
                <div
                  key={card.id}
                  className="mp-fan-card"
                  onClick={() => pickCard(card)}
                  style={{
                    '--tx': `${fanOffsets[i].x}px`,
                    '--ty': `${fanOffsets[i].y}px`,
                    '--r': `${fanAngles[i]}deg`,
                    '--delay': `${i * 0.08}s`,
                    transform: `translateX(${fanOffsets[i].x}px) translateY(${fanOffsets[i].y}px) rotate(${fanAngles[i]}deg)`,
                    bottom: 0,
                    zIndex: 5 - Math.abs(i - 2),
                  }}
                >
                  <div className="mp-fan-card-back">🎴</div>
                </div>
              ))}
            </div>
            <div className="mp-hint">Tap any card to reveal</div>
          </>
        )}

        {phase === 'win' && winner && (
          <>
            {confetti.map(c => (
              <div key={c.id} className="mp-confetti" style={{background:c.color, left:c.x, top:0, animationDelay:`${c.delay}s`}} />
            ))}
            <div className="mp-label" style={{color: winner.color}}>✦ {winner.rarity} ✦</div>
            <div style={{height:12}} />
            <div className="mp-win-card" style={{borderColor: winner.color}}>
              {winner.img
                ? <img src={winner.img} alt={winner.name} className="mp-win-img" />
                : <div style={{width:'100%',height:'100%',background:`linear-gradient(135deg,${winner.color}22,#1a1a2e)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:64}}>🪙</div>
              }
              <div className="mp-win-overlay">
                <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:winner.color,textTransform:'uppercase',marginBottom:4}}>{winner.rarity}</div>
                <div style={{fontSize:18,fontWeight:800,color:'#fff'}}>{winner.name}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>{winner.type}</div>
              </div>
            </div>
            <div className="mp-hint" style={{cursor:'pointer'}} onClick={onClose}>Tap anywhere to close</div>
          </>
        )}
      </div>
    </div>
  )
}

function MysteryPackCard() {
  const [open, setOpen] = useState(false)
  return (
    <>
      {open && <MysteryPackModal onClose={() => setOpen(false)} />}
      <div
        onClick={() => setOpen(true)}
        style={{ flex:'0 0 200px', scrollSnapAlign:'start', cursor:'pointer', userSelect:'none' }}
      >
        <div style={{
          width:200, height:290, borderRadius:'var(--radius)',
          background:'linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
          border:'2px solid rgba(124,58,237,0.5)',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          position:'relative', overflow:'hidden', transition:'transform 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'}
          onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
        >
          <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,transparent 30%,rgba(255,255,255,0.08) 50%,transparent 70%)',pointerEvents:'none'}} />
          <div style={{position:'absolute',top:'50%',left:0,right:0,height:2,background:'repeating-linear-gradient(90deg,rgba(255,255,255,0.3) 0px,rgba(255,255,255,0.3) 6px,transparent 6px,transparent 12px)'}} />
          <div style={{fontSize:52, marginBottom:8}}>🎴</div>
          <div style={{fontSize:11, color:'#a78bfa', fontWeight:700, letterSpacing:2, textTransform:'uppercase'}}>Mystery</div>
          <div style={{fontSize:18, color:'#fff', fontWeight:800}}>NFT Pack</div>
          <div style={{fontSize:11, color:'rgba(124,58,237,0.8)', marginTop:14, letterSpacing:1}}>✦ Tap to open</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 2px 0',fontSize:13,fontWeight:600}}>
          <span style={{display:'flex',alignItems:'center',gap:5,color:'#7c3aed',fontSize:13,fontWeight:700}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:'#7c3aed',display:'inline-block'}}></span>
            SPECIAL
          </span>
          <span style={{color:'var(--muted)',fontSize:12}}>Mystery Pack</span>
        </div>
      </div>
    </>
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
