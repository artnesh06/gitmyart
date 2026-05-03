import React from 'react'
import '../styles/NFTGrid.css'

export default function NFTGrid({ nfts, stakedNFTs, onSelect, onStake, onUnstake }) {
  return (
    <div className="nft-grid">
      {nfts.map(nft => {
        const isStaked = stakedNFTs.some(s => s.identifier === nft.identifier)
        return (
          <div key={nft.identifier} className={`nft-card ${isStaked ? 'staked' : ''}`}>
            <div className="nft-image">
              <img src={nft.image_url || 'https://via.placeholder.com/200'} alt={nft.name} />
              {isStaked && <div className="staked-badge">✓ Staked</div>}
            </div>
            <div className="nft-info">
              <h4>{nft.name}</h4>
              <p className="collection">{nft.collection.name}</p>
              {nft.rarity && <p className="rarity">Rarity: {nft.rarity}</p>}
              <div className="nft-actions">
                {isStaked ? (
                  <button
                    className="btn-unstake"
                    onClick={() => onUnstake(nft)}
                  >
                    Unstake
                  </button>
                ) : (
                  <button
                    className="btn-stake"
                    onClick={() => onStake(nft)}
                  >
                    Stake
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
