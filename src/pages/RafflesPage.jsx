import React, { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { LoadingSpinner } from '../components/LoadingSpinner'

export default function RafflesPage() {
  const { api } = useApi()
  const [raffles, setRaffles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRaffles()
  }, [])

  const loadRaffles = async () => {
    setLoading(true)
    const data = await api('/raffles')
    if (data) setRaffles(data.raffles || [])
    setLoading(false)
  }

  return (
    <div>
      <h2 className="section-title" style={{ marginBottom: '20px' }}>
        Live Raffles
      </h2>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="raffle-page-grid" id="rafflesPageGrid">
          {raffles.map((raffle) => (
            <div key={raffle.id} className="raffle-card">
              <h3>{raffle.name}</h3>
              <p>{raffle.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
