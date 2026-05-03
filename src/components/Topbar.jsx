import React, { useContext } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { AppContext } from '../context/AppContext'

const CHAINS = {
  atom: { name: 'Cosmos', symbol: 'ATOM' },
  megaeth: { name: 'MegaETH', symbol: 'METH' },
  ethereum: { name: 'Ethereum', symbol: 'ETH' },
}

export default function Topbar({ onChainClick, onSettingsClick, onNotifClick, onProfileClick, activeSection }) {
  const { activeChain } = useContext(AppContext)
  const chain = CHAINS[activeChain] || CHAINS.megaeth

  function shortAddr(a) {
    if (!a || a.length <= 14) return a || ''
    return a.slice(0, 8) + '...' + a.slice(-4)
  }

  // Active style for buttons
  const activeStyle = {
    background: 'var(--accent)',
    borderColor: 'var(--accent)',
    color: '#fff',
  }

  return (
    <header className="topbar">
      <div className="topbar-search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input type="text" placeholder="Ask anything..." />
      </div>

      <div className="topbar-right">

        {/* Notifications */}
        <button
          className="topbar-btn"
          onClick={onNotifClick}
          title="Notifications"
          style={activeSection === 'notif' ? activeStyle : {}}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {activeSection !== 'notif' && <span className="notif-dot"></span>}
        </button>

        {/* Settings */}
        <button
          className="topbar-btn"
          onClick={onSettingsClick}
          title="Settings"
          style={activeSection === 'settings' ? activeStyle : {}}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>

        {/* Chain selector */}
        <button
          className="topbar-btn chain-btn"
          onClick={onChainClick}
          style={activeSection === 'chain' ? activeStyle : {}}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="2.5"/>
            <ellipse cx="12" cy="12" rx="10" ry="4"/>
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
          </svg>
          <span>{chain.symbol}</span>
        </button>

        {/* Connect / Profile button */}
        <ConnectButton.Custom>
          {({ account, chain: wagmiChain, openAccountModal, openConnectModal, mounted }) => {
            const ready = mounted
            const connected = ready && account && wagmiChain
            return (
              <div {...(!ready && { 'aria-hidden': true, style: { opacity: 0, pointerEvents: 'none' } })}>
                {!connected ? (
                  <button className="signin-btn" onClick={openConnectModal} type="button">
                    Sign in
                  </button>
                ) : (
                  <button
                    className="signin-btn connected"
                    onClick={onProfileClick}
                    type="button"
                    style={activeSection === 'profile' ? { borderColor: 'var(--accent)', background: 'var(--bg-hover)' } : {}}
                  >
                    {shortAddr(account.address)}
                  </button>
                )}
              </div>
            )
          }}
        </ConnectButton.Custom>

      </div>
    </header>
  )
}
