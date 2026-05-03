import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'

const SAMPLE_RAFFLES = [
  { id: 1, name: 'Mega Prize Raffle', entries: 1234, maxEntries: 2000, prize: '10 ETH', token: '$METH', img: 'https://picsum.photos/seed/raffle1/400/400', endsIn: '2d 14h' },
  { id: 2, name: 'NFT Collection Drop', entries: 567, maxEntries: 1000, prize: '5 NFTs', token: '$REBEL', img: 'https://picsum.photos/seed/raffle2/400/400', endsIn: '1d 6h' },
  { id: 3, name: 'Token Airdrop', entries: 2891, maxEntries: 5000, prize: '1000 TOKENS', token: '$TURBO', img: 'https://picsum.photos/seed/raffle3/400/400', endsIn: '3d 2h' },
  { id: 4, name: 'Golden Ticket', entries: 345, maxEntries: 500, prize: 'VIP Pass', token: '$METH', img: 'https://picsum.photos/seed/raffle4/400/400', endsIn: '12h' },
  { id: 5, name: 'Whale Raffle', entries: 890, maxEntries: 1500, prize: '50 ETH', token: '$REBEL', img: 'https://picsum.photos/seed/raffle5/400/400', endsIn: '5d 8h' },
  { id: 6, name: 'Flash Raffle', entries: 120, maxEntries: 200, prize: '100 TOKENS', token: '$TURBO', img: 'https://picsum.photos/seed/raffle6/400/400', endsIn: '4h' },
]

const FILTER_TOKENS = ['All', '$METH', '$REBEL', '$TURBO']

export default function RafflesPage() {
  const { activeChain } = useContext(AppContext)
  const [activeFilter, setActiveFilter] = useState('All')
  const [raffles, setRaffles] = useState(SAMPLE_RAFFLES)

  // Try to fetch real raffles from API
  useEffect(() => {
    fetch('/api/raffles')
      .then(r => r.json())
      .then(data => {
        if (data?.raffles?.length) setRaffles(data.raffles)
      })
      .catch(() => {})
  }, [activeChain])

  const filtered = activeFilter === 'All'
    ? raffles
    : raffles.filter(r => (r.token || r.symbol) === activeFilter)

  return (
    <div>
      <div className="page-sub">Browse and enter raffles</div>

      <div className="raffle-filter-row">
        <div className="raffle-coin-filters">
          {FILTER_TOKENS.map(token => (
            <button
              key={token}
              className={`raffle-filter-btn${activeFilter === token ? ' active' : ''}`}
              onClick={() => setActiveFilter(token)}
            >
              {token}
            </button>
          ))}
        </div>
      </div>

      <div className="raffle-page-grid" id="rafflePageGrid">
        {filtered.map(r => {
          const entries = r.currentEntries ?? r.entries ?? 0
          const maxEntries = r.maxEntries ?? 2000
          const pct = Math.round((entries / maxEntries) * 100)
          const name = r.name || r.title || 'Raffle'
          const token = r.token || r.symbol || '$METH'
          const prize = r.prize || r.prizeValue || '—'
          const ticketPrice = r.ticketPrice || r.perTicket || `50 ${token}`
          const endsIn = r.endsIn || '2d 14h'
          const img = r.img || r.image || `https://picsum.photos/seed/raffle${r.id}/400/400`

          return (
            <div
              key={r.id}
              className="raffle-grid-card"
              onClick={() => alert(`Enter raffle: ${name}`)}
            >
              <div className="raffle-grid-card-img">
                <img src={img} alt={name} />
                <div className="raffle-live-badge">
                  <div className="live-dot"></div>
                  LIVE
                </div>
                <div className="raffle-grid-card-overlay">
                  <div className="raffle-grid-card-entries">{entries.toLocaleString()} entries</div>
                  <div className="raffle-grid-card-token">{token}</div>
                </div>
              </div>
              <div className="raffle-grid-card-body">
                <div className="raffle-grid-card-name">{name}</div>
                <div className="raffle-grid-card-meta-row">
                  <div className="raffle-meta">
                    <span className="raffle-meta-v">{prize}</span>
                    <div className="raffle-meta-l">Prize</div>
                  </div>
                  <div className="raffle-meta">
                    <span className="raffle-meta-v">{ticketPrice}</span>
                    <div className="raffle-meta-l">Per Ticket</div>
                  </div>
                </div>
                <div className="raffle-prog">
                  <div className="raffle-prog-bar">
                    <div
                      className="raffle-prog-fill"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <div className="raffle-prog-text">
                    <span>{entries.toLocaleString()} / {maxEntries.toLocaleString()}</span>
                    <span>{pct}% full</span>
                  </div>
                </div>
                <div className="raffle-grid-card-footer">
                  <div className="raffle-grid-card-time">
                    <span className="live-dot-sm"></span>
                    End in {endsIn}
                  </div>
                </div>
              </div>
              <div className="raffle-grid-hover"><span>Enter Raffle</span></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
