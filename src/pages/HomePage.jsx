import React, { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { LoadingSpinner } from '../components/LoadingSpinner'

export default function HomePage() {
  const { api } = useApi()
  const [raffles, setRaffles] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [rafflesData, collectionsData] = await Promise.all([
      api('/raffles'),
      api('/collections'),
    ])
    if (rafflesData) setRaffles(rafflesData.raffles || [])
    if (collectionsData) setCollections(collectionsData.collections || [])
    setLoading(false)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="ticker-section">
        <div className="ticker-header">
          <span className="ticker-title section-title">Top Coins</span>
          <a href="/topcoins" className="ticker-viewall">
            View My Coins
          </a>
        </div>
        <div className="ticker-track" id="tickerTrack" />
      </div>

      <div className="trending-section">
        <div className="trending-header">
          <h2 className="section-title">Trending Raffle</h2>
          <div className="trending-nav">
            <button className="trend-arrow">‹</button>
            <button className="trend-arrow">›</button>
          </div>
        </div>
        <div className="trending-track" id="trendingTrack" />
      </div>

      <div className="explore-section">
        <div className="trending-header">
          <h2 className="section-title">Explore Collection</h2>
          <div className="trending-nav">
            <button className="trend-arrow">‹</button>
            <button className="trend-arrow">›</button>
          </div>
        </div>
        <div className="trending-track" id="collectionTrack" />
      </div>
    </div>
  )
}
