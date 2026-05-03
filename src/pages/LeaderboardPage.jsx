import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'

const DUMMY_NAMES = ['CryptoWhale', 'StarDust', 'MoonHunter', 'CosmosKing', 'NFTLord', 'DiamondHands', 'RocketMan', 'PixelMaster', 'ChainGuru', 'TokenBoss', 'ApeKing', 'DeFiWiz', 'MetaTrader', 'BlockSmith', 'HashPower']

const SAMPLE_LEADERBOARD = DUMMY_NAMES.map((name, i) => ({
  rank: i + 1,
  name,
  address: `cosmos1${Math.random().toString(36).slice(2, 8)}...${Math.random().toString(36).slice(2, 6)}`,
  avatar: `https://picsum.photos/seed/${name.toLowerCase()}/80/80`,
  nfts: Math.floor(Math.random() * 20) + 1,
  points: Math.floor(Math.random() * 80000) + 10000,
})).sort((a, b) => b.points - a.points).map((r, i) => ({ ...r, rank: i + 1 }))

const CHAIN_TABS = ['All Chains', 'Cosmos', 'MegaETH', 'Ethereum']
const CAT_TABS = ['Total Points', 'Weekly', 'Daily']
const TIME_TABS = ['All Time', 'This Month', 'This Week']

function fn(n) {
  return Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export default function LeaderboardPage() {
  const { activeChain } = useContext(AppContext)
  const [chainTab, setChainTab] = useState('All Chains')
  const [catTab, setCatTab] = useState('Total Points')
  const [timeTab, setTimeTab] = useState('All Time')
  const [searchTerm, setSearchTerm] = useState('')
  const [leaderboard, setLeaderboard] = useState(SAMPLE_LEADERBOARD)

  // Try to fetch real leaderboard data
  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(data => {
        if (data?.leaderboard?.length) {
          setLeaderboard(data.leaderboard.map((r, i) => ({
            rank: i + 1,
            name: r.name || r.wallet?.slice(0, 8) || DUMMY_NAMES[i] || `User ${i + 1}`,
            address: r.wallet || r.address || '',
            avatar: r.avatar || `https://picsum.photos/seed/user${i}/80/80`,
            nfts: r.nfts ?? r.nftCount ?? 0,
            points: r.points ?? r.totalPoints ?? 0,
          })))
        }
      })
      .catch(() => {})
  }, [activeChain])

  const filtered = leaderboard.filter(r =>
    !searchTerm ||
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const top3 = filtered.slice(0, 3)
  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean)
  const tableRows = filtered.slice(3)

  const rankClass = (rank) => {
    if (rank === 1) return 'lb2-row-gold'
    if (rank === 2) return 'lb2-row-silver'
    if (rank === 3) return 'lb2-row-bronze'
    return ''
  }

  return (
    <div>
      {/* Header */}
      <div className="lb2-header">
        <span className="section-title">Leaderboard</span>
        <div className="lb2-chain-tabs">
          {CHAIN_TABS.map(tab => (
            <button
              key={tab}
              className={`lb2-chain-tab${chainTab === tab ? ' active' : ''}`}
              onClick={() => setChainTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div className="lb2-cat-tabs">
        {CAT_TABS.map(tab => (
          <button
            key={tab}
            className={`lb2-cat-tab${catTab === tab ? ' active' : ''}`}
            onClick={() => setCatTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Podium */}
      <div className="lb2-podium-wrap">
        <div className="lb2-podium-row">
          {podiumOrder.map((entry, idx) => {
            // idx 0 = 2nd place, idx 1 = 1st place, idx 2 = 3rd place
            const delayClass = idx === 1 ? 'delay-1' : idx === 0 ? 'delay-2' : 'delay-3'
            const rankNum = idx === 1 ? 1 : idx === 0 ? 2 : 3
            return (
              <div key={entry.rank} className={`lb2-podium-slot ${delayClass}`}>
                <div className="lb2-ps-avatar-wrap">
                  <img
                    className={`lb2-ps-avatar rank-${rankNum}`}
                    src={entry.avatar}
                    alt={entry.name}
                  />
                  <div className={`lb2-ps-badge rank-${rankNum}`}>{rankNum}</div>
                </div>
                <div className="lb2-ps-name">{entry.name}</div>
                <div className="lb2-ps-val">{fn(entry.points)} pts</div>
                <div className={`lb2-ps-bar rank-${rankNum}`}>
                  <span className="lb2-ps-bar-num">{rankNum}</span>
                </div>
              </div>
            )
          })}
        </div>
        <div className="lb2-podium-ground"></div>
      </div>

      {/* Table */}
      <div className="lb2-table-wrap">
        <div className="lb2-table-controls">
          <div className="lb2-time-tabs">
            {TIME_TABS.map(tab => (
              <button
                key={tab}
                className={`lb2-time-tab${timeTab === tab ? ' active' : ''}`}
                onClick={() => setTimeTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="lb2-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="lb2-search"
              placeholder="Search wallet..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="lb2-thead">
          <div className="lb2-th lb2-th-rank">#</div>
          <div className="lb2-th lb2-th-user">User</div>
          <div className="lb2-th lb2-th-extra">NFTs</div>
          <div className="lb2-th lb2-th-pts">Points</div>
        </div>

        <div className="lb2-rows">
          {/* Top 3 in table too */}
          {filtered.slice(0, 3).map(entry => (
            <div key={entry.rank} className={`lb2-row ${rankClass(entry.rank)}`}>
              <div className="lb2-td-rank">{entry.rank}</div>
              <div className="lb2-td-user">
                <img className="lb2-row-avatar" src={entry.avatar} alt={entry.name} />
                <div>
                  <div className="lb2-row-name">{entry.name}</div>
                  <div className="lb2-row-sub">{entry.address}</div>
                </div>
              </div>
              <div className="lb2-td-extra">{entry.nfts} NFTs</div>
              <div className="lb2-td-pts">{fn(entry.points)}</div>
            </div>
          ))}
          {/* Rest of table */}
          {tableRows.map(entry => (
            <div key={entry.rank} className="lb2-row">
              <div className="lb2-td-rank">{entry.rank}</div>
              <div className="lb2-td-user">
                <img className="lb2-row-avatar" src={entry.avatar} alt={entry.name} />
                <div>
                  <div className="lb2-row-name">{entry.name}</div>
                  <div className="lb2-row-sub">{entry.address}</div>
                </div>
              </div>
              <div className="lb2-td-extra">{entry.nfts} NFTs</div>
              <div className="lb2-td-pts">{fn(entry.points)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
