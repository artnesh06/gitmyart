import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const SAMPLE_RAFFLES = [
  { id: 1, name: 'Mega Prize Raffle', entries: 1234, prize: '10 ETH', token: '$METH', img: 'https://picsum.photos/seed/raffle1/200/200' },
  { id: 2, name: 'NFT Collection Drop', entries: 567, prize: '5 NFTs', token: '$REBEL', img: 'https://picsum.photos/seed/raffle2/200/200' },
  { id: 3, name: 'Token Airdrop', entries: 2891, prize: '1000 TOKENS', token: '$TURBO', img: 'https://picsum.photos/seed/raffle3/200/200' },
  { id: 4, name: 'Exclusive Access', entries: 345, prize: 'VIP Pass', token: '$METH', img: 'https://picsum.photos/seed/raffle4/200/200' },
]

export default function RafflesPage() {
  const { activeChain } = useContext(AppContext)

  return (
    <div>
      <h2 className="section-title" style={{ marginBottom: '20px' }}>Live Raffles</h2>
      
      <div className="raffle-filter-row">
        <div className="raffle-coin-filters">
          <button className="raffle-filter-btn active">All</button>
          <button className="raffle-filter-btn">$METH</button>
          <button className="raffle-filter-btn">$REBEL</button>
          <button className="raffle-filter-btn">$TURBO</button>
        </div>
      </div>

      <div className="raffle-page-grid">
        {SAMPLE_RAFFLES.map(raffle => (
          <div key={raffle.id} className="raffle-page-card">
            <img src={raffle.img} alt={raffle.name} className="raffle-page-img" />
            <div className="raffle-page-info">
              <h3>{raffle.name}</h3>
              <div className="raffle-page-details">
                <p><strong>Prize:</strong> {raffle.prize}</p>
                <p><strong>Entries:</strong> {raffle.entries}</p>
                <p><strong>Token:</strong> {raffle.token}</p>
              </div>
              <button className="raffle-page-btn">Buy Entry</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
