import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'

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

export default function CollectionsPage() {
  const { activeChain } = useContext(AppContext)
  const [activeTab, setActiveTab] = useState('All')
  const [collections, setCollections] = useState(SAMPLE_COLLECTIONS)

  // Try to fetch real collections from API
  useEffect(() => {
    fetch('/api/collections')
      .then(r => r.json())
      .then(data => {
        if (data?.collections?.length) setCollections(data.collections)
      })
      .catch(() => {})
  }, [activeChain])

  return (
    <div>
      <div className="page-sub">Explore NFT collections and stake to earn rewards</div>

      <div className="explore-tabs">
        {EXPLORE_TABS.map(tab => (
          <button
            key={tab}
            className={`explore-tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
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

      <div className="collection-grid" id="allCollGrid">
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
  )
}
