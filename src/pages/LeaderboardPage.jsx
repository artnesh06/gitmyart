import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'

const SAMPLE_LEADERBOARD = [
  { rank: 1, address: '0x1234...5678', points: 45230, change: '+2.3%' },
  { rank: 2, address: '0x9876...5432', points: 42100, change: '+1.8%' },
  { rank: 3, address: '0xabcd...ef01', points: 38900, change: '+0.5%' },
  { rank: 4, address: '0x5555...6666', points: 35600, change: '-1.2%' },
  { rank: 5, address: '0x7777...8888', points: 32400, change: '+3.1%' },
]

export default function LeaderboardPage() {
  const { activeChain } = useContext(AppContext)
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div>
      <div className="lb2-header">
        <h2 className="section-title">Leaderboard</h2>
        <div className="lb2-chain-tabs">
          <button className="lb-tab active">All Chains</button>
          <button className="lb-tab">Cosmos</button>
          <button className="lb-tab">MegaETH</button>
          <button className="lb-tab">Ethereum</button>
        </div>
      </div>

      <div className="lb2-cat-tabs">
        <button className="lb-cat-tab active">Total Points</button>
        <button className="lb-cat-tab">Weekly</button>
        <button className="lb-cat-tab">Daily</button>
      </div>

      <div className="lb2-podium-wrap">
        <div className="podium">
          <div className="podium-place second">
            <div className="podium-medal">🥈</div>
            <div className="podium-address">0x9876...5432</div>
            <div className="podium-points">42,100 pts</div>
          </div>
          <div className="podium-place first">
            <div className="podium-medal">🥇</div>
            <div className="podium-address">0x1234...5678</div>
            <div className="podium-points">45,230 pts</div>
          </div>
          <div className="podium-place third">
            <div className="podium-medal">🥉</div>
            <div className="podium-address">0xabcd...ef01</div>
            <div className="podium-points">38,900 pts</div>
          </div>
        </div>
      </div>

      <div className="lb2-table-wrap">
        <div className="lb2-table-controls">
          <div className="lb2-time-tabs">
            <button className="lb-time-tab active">All Time</button>
            <button className="lb-time-tab">This Month</button>
            <button className="lb-time-tab">This Week</button>
          </div>
          <div className="lb2-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input 
              type="text" 
              className="lb2-search" 
              placeholder="Search user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="lb2-table">
          <div className="lb2-table-header">
            <div className="lb2-col rank">Rank</div>
            <div className="lb2-col address">Address</div>
            <div className="lb2-col points">Points</div>
            <div className="lb2-col change">Change</div>
          </div>
          {SAMPLE_LEADERBOARD.map(entry => (
            <div key={entry.rank} className="lb2-table-row">
              <div className="lb2-col rank">#{entry.rank}</div>
              <div className="lb2-col address">{entry.address}</div>
              <div className="lb2-col points">{entry.points.toLocaleString()}</div>
              <div className={`lb2-col change ${entry.change.includes('+') ? 'up' : 'down'}`}>
                {entry.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
