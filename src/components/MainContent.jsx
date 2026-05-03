import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LeaderboardPage from '../pages/LeaderboardPage'
import RafflesPage from '../pages/RafflesPage'
import CollectionsPage from '../pages/CollectionsPage'

export default function MainContent() {
  return (
    <main className="content">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/raffles" element={<RafflesPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
      </Routes>
    </main>
  )
}
