import React, { createContext, useState, useEffect } from 'react'

export const AppContext = createContext()

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
    }}>
      {children}
    </AppContext.Provider>
  )
}
