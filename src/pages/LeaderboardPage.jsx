import React, { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { LoadingSpinner } from '../components/LoadingSpinner'

export default function LeaderboardPage() {
  const { api } = useApi()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    setLoading(true)
    const data = await api('/leaderboard')
    if (data) setLeaderboard(data.leaderboard || [])
    setLoading(false)
  }

  return (
    <div>
      <div className="lb2-header">
        <h2 className="section-title">Leaderboard</h2>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="lb2-table-wrap">
          <div id="lbPageList">
            {leaderboard.map((user, idx) => (
              <div key={idx} className="lb-row">
                <span className="lb-rank">{idx + 1}</span>
                <span className="lb-name">{user.name}</span>
                <span className="lb-score">{user.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
