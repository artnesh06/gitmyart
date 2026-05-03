import React, { createContext, useState, useEffect } from 'react'

export const AppContext = createContext()

export const COINS_BY_CHAIN = {
  atom: [
    { symbol: '$ATOM', name: 'Cosmos', img: 'https://picsum.photos/seed/atom/80/80', val: '$1.5M', rawVal: 1500000, change: '+9.4%', up: true },
    { symbol: '$OSMO', name: 'Osmosis', img: 'https://picsum.photos/seed/osmo/80/80', val: '$890K', rawVal: 890000, change: '+5.2%', up: true },
    { symbol: '$JUNO', name: 'Juno', img: 'https://picsum.photos/seed/juno/80/80', val: '$234K', rawVal: 234000, change: '-2.1%', up: false },
    { symbol: '$STARS', name: 'Stargaze', img: 'https://picsum.photos/seed/stars/80/80', val: '$156K', rawVal: 156000, change: '+18.3%', up: true },
    { symbol: '$INJ', name: 'Injective', img: 'https://picsum.photos/seed/inj/80/80', val: '$3.2M', rawVal: 3200000, change: '+12.7%', up: true },
    { symbol: '$TIA', name: 'Celestia', img: 'https://picsum.photos/seed/tia/80/80', val: '$2.8M', rawVal: 2800000, change: '+7.1%', up: true },
    { symbol: '$KUJI', name: 'Kujira', img: 'https://picsum.photos/seed/kuji/80/80', val: '$78K', rawVal: 78000, change: '-4.5%', up: false },
    { symbol: '$AKT', name: 'Akash', img: 'https://picsum.photos/seed/akt/80/80', val: '$1.1M', rawVal: 1100000, change: '+22.8%', up: true },
  ],
  megaeth: [
    { symbol: '$METH', name: 'MegaETH', img: 'https://picsum.photos/seed/mega/80/80', val: '$4.8M', rawVal: 4800000, change: '+5.6%', up: true },
    { symbol: '$REBEL', name: 'Rebel Token', img: 'https://picsum.photos/seed/rebel/80/80', val: '$2.1M', rawVal: 2100000, change: '+22.1%', up: true },
    { symbol: '$TURBO', name: 'TurboSwap', img: 'https://picsum.photos/seed/turbo/80/80', val: '$890K', rawVal: 890000, change: '+34.5%', up: true },
    { symbol: '$BLITZ', name: 'Blitz Finance', img: 'https://picsum.photos/seed/blitz/80/80', val: '$567K', rawVal: 567000, change: '+8.9%', up: true },
    { symbol: '$FLASH', name: 'FlashLend', img: 'https://picsum.photos/seed/flash/80/80', val: '$345K', rawVal: 345000, change: '-5.2%', up: false },
    { symbol: '$HYPER', name: 'HyperDEX', img: 'https://picsum.photos/seed/hyper/80/80', val: '$234K', rawVal: 234000, change: '+15.3%', up: true },
  ],
  ethereum: [
    { symbol: '$ETH', name: 'Ethereum', img: 'https://picsum.photos/seed/eth/80/80', val: '$12.3M', rawVal: 12300000, change: '+2.4%', up: true },
    { symbol: '$UNI', name: 'Uniswap', img: 'https://picsum.photos/seed/uni/80/80', val: '$8.9M', rawVal: 8900000, change: '+4.1%', up: true },
    { symbol: '$AAVE', name: 'Aave', img: 'https://picsum.photos/seed/aave/80/80', val: '$5.6M', rawVal: 5600000, change: '+6.8%', up: true },
    { symbol: '$LINK', name: 'Chainlink', img: 'https://picsum.photos/seed/link/80/80', val: '$4.2M', rawVal: 4200000, change: '-1.3%', up: false },
    { symbol: '$LDO', name: 'Lido DAO', img: 'https://picsum.photos/seed/ldo/80/80', val: '$3.8M', rawVal: 3800000, change: '+3.5%', up: true },
    { symbol: '$MKR', name: 'Maker', img: 'https://picsum.photos/seed/mkr/80/80', val: '$2.9M', rawVal: 2900000, change: '+1.9%', up: true },
  ],
}

export const CHARITY_COINS = [
  { symbol: '$WISH', name: 'Make A Wish', img: 'https://picsum.photos/seed/wish/80/80', val: '$2.44M', change: '+4.9%', up: true },
  { symbol: '$STJUDE', name: 'St. Jude', img: 'https://picsum.photos/seed/stjude/80/80', val: '$607K', change: '+4.3%', up: true },
  { symbol: '$PUP', name: 'Wheelchair P...', img: 'https://picsum.photos/seed/pup/80/80', val: '$408K', change: '+4.7%', up: true },
  { symbol: '$RC', name: 'Red Cross', img: 'https://picsum.photos/seed/redcross/80/80', val: '$202K', change: '+4.8%', up: true },
  { symbol: '$WATER', name: 'Water', img: 'https://picsum.photos/seed/water/80/80', val: '$149K', change: '+16.7%', up: true },
]

export function AppProvider({ children }) {
  const [activeChain, setActiveChain] = useState('megaeth')
  const [currentPage, setCurrentPage] = useState('home')
  const [sessionToken, setSessionToken] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [myCoinsFilter, setMyCoinsFilter] = useState('all')
  const [topCoinsView, setTopCoinsView] = useState('my')

  const API_BASE = window.location.origin + '/api'

  // Load session from storage
  useEffect(() => {
    const token = sessionStorage.getItem('rebel_session')
    if (token) setSessionToken(token)
  }, [])

  // API helper
  const api = async (path, opts = {}) => {
    const headers = { 'Content-Type': 'application/json' }
    if (sessionToken) headers['x-session-token'] = sessionToken
    try {
      const r = await fetch(API_BASE + path, { ...opts, headers: { ...headers, ...opts.headers } })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'API error')
      return data
    } catch (e) {
      console.warn('[API]', path, e.message)
      return null
    }
  }

  // Add notification
  const addNotification = (message, type = 'info') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }

  return (
    <AppContext.Provider value={{
      activeChain,
      setActiveChain,
      currentPage,
      setCurrentPage,
      sessionToken,
      setSessionToken,
      currentUser,
      setCurrentUser,
      notifications,
      addNotification,
      myCoinsFilter,
      setMyCoinsFilter,
      topCoinsView,
      setTopCoinsView,
      api,
      API_BASE,
      COINS_BY_CHAIN,
      CHARITY_COINS,
    }}>
      {children}
    </AppContext.Provider>
  )
}
