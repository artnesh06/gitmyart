import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [sessionToken, setSessionToken] = useState(null)
  const [activeChain, setActiveChain] = useState('atom')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load session from localStorage
    const token = localStorage.getItem('rebel_session')
    if (token) {
      setSessionToken(token)
      // Optionally verify token with backend
    }
  }, [])

  const login = (user, token, chain) => {
    setCurrentUser(user)
    setSessionToken(token)
    setActiveChain(chain)
    localStorage.setItem('rebel_session', token)
  }

  const logout = () => {
    setCurrentUser(null)
    setSessionToken(null)
    localStorage.removeItem('rebel_session')
  }

  const switchChain = (chain) => {
    setActiveChain(chain)
  }

  return (
    <AppContext.Provider value={{ currentUser, sessionToken, activeChain, loading, setLoading, login, logout, switchChain }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
