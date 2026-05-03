import React, { useState } from 'react'
import NFTGrid from '../components/NFTGrid'
import StakingPanel from '../components/StakingPanel'
import '../styles/Dashboard.css'

export default function Dashboard({ address, nfts, balance, loading, onRefresh }) {
  const [selectedNFT, setSelectedNFT] = useState(null)
  const [stakedNFTs, setStakedNFTs] = useState([])

  const handleStake = async (nft) => {
    try {
      // Call backend API to stake
      const response = await fetch('/api/stake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-token': localStorage.getItem('session_token'),
        },
        body: JSON.stringify({
          tokenId: nft.identifier,
          collectionId: nft.collection.slug,
          name: nft.name,
          imageUrl: nft.image_url,
          rarity: nft.rarity,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setStakedNFTs([...stakedNFTs, { ...nft, nftId: data.nftId }])
        alert(`✅ Staked ${nft.name}!`)
        setSelectedNFT(null)
      } else {
        alert('❌ Staking failed')
      }
    } catch (error) {
      console.error('Staking error:', error)
      alert('Error staking NFT')
    }
  }

  const handleUnstake = async (nft) => {
    try {
      const response = await fetch('/api/stake/unstake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-token': localStorage.getItem('session_token'),
        },
        body: JSON.stringify({
          tokenId: nft.identifier,
          collectionId: nft.collection.slug,
        }),
      })

      if (response.ok) {
        setStakedNFTs(stakedNFTs.filter(s => s.identifier !== nft.identifier))
        alert(`✅ Unstaked ${nft.name}!`)
      } else {
        alert('❌ Unstaking failed')
      }
    } catch (error) {
      console.error('Unstaking error:', error)
      alert('Error unstaking NFT')
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="wallet-info">
          <h2>Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}</h2>
          <p>Balance: {balance} ETH</p>
        </div>
        <button className="refresh-btn" onClick={onRefresh} disabled={loading}>
          {loading ? '⏳ Loading...' : '🔄 Refresh NFTs'}
        </button>
      </div>

      <div className="dashboard-content">
        <div className="nft-section">
          <h3>Your NFTs ({nfts.length})</h3>
          {loading ? (
            <div className="loading">Loading NFTs...</div>
          ) : nfts.length > 0 ? (
            <NFTGrid
              nfts={nfts}
              stakedNFTs={stakedNFTs}
              onSelect={setSelectedNFT}
              onStake={handleStake}
              onUnstake={handleUnstake}
            />
          ) : (
            <div className="empty">No NFTs found in your wallet</div>
          )}
        </div>

        {selectedNFT && (
          <div className="staking-section">
            <StakingPanel
              nft={selectedNFT}
              onStake={handleStake}
              onClose={() => setSelectedNFT(null)}
            />
          </div>
        )}

        <div className="staked-section">
          <h3>Staked NFTs ({stakedNFTs.length})</h3>
          {stakedNFTs.length > 0 ? (
            <div className="staked-list">
              {stakedNFTs.map(nft => (
                <div key={nft.nftId} className="staked-item">
                  <img src={nft.image_url} alt={nft.name} />
                  <div className="staked-info">
                    <h4>{nft.name}</h4>
                    <p>Collection: {nft.collection.name}</p>
                    <p>HP: 100/100</p>
                    <button onClick={() => handleUnstake(nft)}>Unstake</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">No staked NFTs yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
