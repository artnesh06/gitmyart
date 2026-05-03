import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'

const COINS_BY_CHAIN = {
  atom: [
    { symbol: '$ATOM', name: 'Cosmos', img: 'https://picsum.photos/seed/atom/80/80', val: '$1.5M', change: '+9.4%', up: true },
    { symbol: '$OSMO', name: 'Osmosis', img: 'https://picsum.photos/seed/osmo/80/80', val: '$890K', change: '+5.2%', up: true },
    { symbol: '$JUNO', name: 'Juno', img: 'https://picsum.photos/seed/juno/80/80', val: '$234K', change: '-2.1%', up: false },
  ],
  megaeth: [
    { symbol: '$METH', name: 'MegaETH', img: 'https://picsum.photos/seed/mega/80/80', val: '$4.8M', change: '+5.6%', up: true },
    { symbol: '$REBEL', name: 'Rebel Token', img: 'https://picsum.photos/seed/rebel/80/80', val: '$2.1M', change: '+22.1%', up: true },
    { symbol: '$TURBO', name: 'TurboSwap', img: 'https://picsum.photos/seed/turbo/80/80', val: '$890K', change: '+34.5%', up: true },
  ],
  ethereum: [
    { symbol: '$ETH', name: 'Ethereum', img: 'https://picsum.photos/seed/eth/80/80', val: '$12.3M', change: '+2.4%', up: true },
    { symbol: '$UNI', name: 'Uniswap', img: 'https://picsum.photos/seed/uni/80/80', val: '$8.9M', change: '+4.1%', up: true },
    { symbol: '$AAVE', name: 'Aave', img: 'https://picsum.photos/seed/aave/80/80', val: '$5.6M', change: '+6.8%', up: true },
  ],
}

const SAMPLE_RAFFLES = [
  { id: 1, name: 'Mega Prize Raffle', entries: 1234, prize: '10 ETH', img: 'https://picsum.photos/seed/raffle1/200/200' },
  { id: 2, name: 'NFT Collection Drop', entries: 567, prize: '5 NFTs', img: 'https://picsum.photos/seed/raffle2/200/200' },
  { id: 3, name: 'Token Airdrop', entries: 2891, prize: '1000 TOKENS', img: 'https://picsum.photos/seed/raffle3/200/200' },
]

const SAMPLE_COLLECTIONS = [
  { id: 1, name: 'MegaRebel', stakers: 234, floor: '0.5 ETH', img: 'https://picsum.photos/seed/coll1/200/200' },
  { id: 2, name: 'Cosmic Apes', stakers: 567, floor: '2.3 ETH', img: 'https://picsum.photos/seed/coll2/200/200' },
  { id: 3, name: 'Digital Dreams', stakers: 123, floor: '0.8 ETH', img: 'https://picsum.photos/seed/coll3/200/200' },
]

export default function HomePage() {
  const { activeChain } = useContext(AppContext)
  const coins = COINS_BY_CHAIN[activeChain] || []

  return (
    <div>
      {/* Ticker Section */}
      <div className="ticker-section">
        <div className="ticker-header">
          <span className="ticker-title section-title">Top Coins</span>
          <a href="#" className="ticker-viewall" onClick={(e) => {
            e.preventDefault()
            alert('View all coins')
          }}>View My Coins</a>
        </div>
        <div className="ticker-track" id="tickerTrack">
          {coins.map(coin => (
            <div key={coin.symbol} className="ticker-item">
              <img src={coin.img} alt={coin.name} className="ticker-img" />
              <div className="ticker-info">
                <div className="ticker-symbol">{coin.symbol}</div>
                <div className="ticker-name">{coin.name}</div>
              </div>
              <div className="ticker-price">{coin.val}</div>
              <div className={`ticker-change ${coin.up ? 'up' : 'down'}`}>
                {coin.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Raffles Section */}
      <div className="trending-section">
        <div className="trending-header">
          <h2 className="section-title">Trending Raffle</h2>
          <div className="trending-nav">
            <button className="trend-arrow" onClick={() => alert('Scroll left')}>&#8249;</button>
            <button className="trend-arrow" onClick={() => alert('Scroll right')}>&#8250;</button>
          </div>
        </div>
        <div className="trending-track" id="trendingTrack">
          {SAMPLE_RAFFLES.map(raffle => (
            <div key={raffle.id} className="raffle-card">
              <img src={raffle.img} alt={raffle.name} className="raffle-card-img" />
              <div className="raffle-card-info">
                <h3>{raffle.name}</h3>
                <p>Entries: {raffle.entries}</p>
                <p className="raffle-prize">Prize: {raffle.prize}</p>
                <button className="raffle-enter-btn">Enter Raffle</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explore Collections Section */}
      <div className="explore-section">
        <div className="trending-header">
          <h2 className="section-title">Explore Collection</h2>
          <div className="trending-nav">
            <button className="trend-arrow" onClick={() => alert('Scroll left')}>&#8249;</button>
            <button className="trend-arrow" onClick={() => alert('Scroll right')}>&#8250;</button>
          </div>
        </div>
        <div className="trending-track" id="collectionTrack">
          {SAMPLE_COLLECTIONS.map(coll => (
            <div key={coll.id} className="collection-card">
              <img src={coll.img} alt={coll.name} className="collection-card-img" />
              <div className="collection-card-info">
                <h3>{coll.name}</h3>
                <p>Stakers: {coll.stakers}</p>
                <p className="collection-floor">Floor: {coll.floor}</p>
                <button className="collection-stake-btn">Stake NFT</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
