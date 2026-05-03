import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import HomePage from '../pages/HomePage'
import LeaderboardPage from '../pages/LeaderboardPage'
import RafflesPage from '../pages/RafflesPage'
import CollectionsPage from '../pages/CollectionsPage'

export default function MainContent() {
  const { currentPage } = useContext(AppContext)

  return (
    <main className="content">
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'leaderboard' && <LeaderboardPage />}
      {currentPage === 'raffles' && <RafflesPage />}
      {currentPage === 'allcollections' && <CollectionsPage />}
    </main>
  )
}
