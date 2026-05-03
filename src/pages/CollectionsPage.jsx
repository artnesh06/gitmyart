import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const SAMPLE_COLLECTIONS = [
  { id: 1, name: 'MegaRebel', stakers: 234, floor: '0.5 ETH', reward: '20 pts/day', img: 'https://picsum.photos/seed/coll1/200/200' },
  { id: 2, name: 'Cosmic Apes', stakers: 567, floor: '2.3 ETH', reward: '15 pts/day', img: 'https://picsum.photos/seed/coll2/200/200' },
  { id: 3, name: 'Digital Dreams', stakers: 123, floor: '0.8 ETH', reward: '18 pts/day', img: 'https://picsum.photos/seed/coll3/200/200' },
  { id: 4, name: 'Pixel Paradise', stakers: 456, floor: '1.2 ETH', reward: '12 pts/day', img: 'https://picsum.photos/seed/coll4/200/200' },
  { id: 5, name: 'Neon Nights', stakers: 789, floor: '3.5 ETH', reward: '25 pts/day', img: 'https://picsum.photos/seed/coll5/200/200' },
  { id: 6, name: 'Retro Vibes', stakers: 234, floor: '0.9 ETH', reward: '14 pts/day', img: 'https://picsum.photos/seed/coll6/200/200' },
]

export default function CollectionsPage() {
  const { activeChain } = useContext(AppContext)

  const CHAIN_NAMES = {
    atom: 'Cosmos',
    megaeth: 'MegaETH',
    ethereum: 'Ethereum',
  }

  return (
    <div>
      <h2 className="section-title" style={{ marginBottom: '20px' }}>All Collections</h2>
      <p className="page-sub">Collections available for staking on <span id="collPageChain">{CHAIN_NAMES[activeChain]}</span></p>
      
      <div className="raffle-page-grid">
        {SAMPLE_COLLECTIONS.map(coll => (
          <div key={coll.id} className="collection-page-card">
            <img src={coll.img} alt={coll.name} className="collection-page-img" />
            <div className="collection-page-info">
              <h3>{coll.name}</h3>
              <div className="collection-page-details">
                <p><strong>Stakers:</strong> {coll.stakers}</p>
                <p><strong>Floor:</strong> {coll.floor}</p>
                <p><strong>Reward:</strong> {coll.reward}</p>
              </div>
              <button className="collection-page-btn">View Collection</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
