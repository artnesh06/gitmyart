import React, { useState } from 'react'
import '../styles/StakingPanel.css'

export default function StakingPanel({ nft, onStake, onClose }) {
  const [loading, setLoading] = useState(false)

  const handleStake = async () => {
    setLoading(true)
    try {
      await onStake(nft)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="staking-panel">
      <div className="panel-header">
        <h3>Stake NFT</h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="panel-content">
        <div className="nft-preview">
          <img src={nft.image_url || 'https://via.placeholder.com/300'} alt={nft.name} />
        </div>

        <div className="nft-details">
          <h4>{nft.name}</h4>
          <p className="collection">{nft.collection.name}</p>
          {nft.rarity && <p className="rarity">Rarity: {nft.rarity}</p>}
        </div>

        <div className="staking-info">
          <div className="info-row">
            <span>Initial HP:</span>
            <strong>100/100</strong>
          </div>
          <div className="info-row">
            <span>Daily Reward:</span>
            <strong>5-20 pts</strong>
          </div>
          <div className="info-row">
            <span>HP Decay:</span>
            <strong>Every 30 min</strong>
          </div>
          <div className="info-row">
            <span>Feed Cost:</span>
            <strong>Free</strong>
          </div>
        </div>

        <div className="staking-benefits">
          <h5>Benefits:</h5>
          <ul>
            <li>✅ Earn points daily</li>
            <li>✅ Feed to restore HP</li>
            <li>✅ Claim rewards anytime</li>
            <li>✅ No on-chain transaction</li>
            <li>✅ Unstake anytime</li>
          </ul>
        </div>

        <button
          className="stake-btn"
          onClick={handleStake}
          disabled={loading}
        >
          {loading ? '⏳ Staking...' : '🎯 Stake NFT'}
        </button>
      </div>
    </div>
  )
}
