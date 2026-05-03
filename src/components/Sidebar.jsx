import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const NAV_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    id: 'raffles',
    label: 'Raffles',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12"/>
        <rect x="2" y="7" width="20" height="5"/>
        <line x1="12" y1="22" x2="12" y2="7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
  },
  {
    id: 'allcollections',
    label: 'Collections',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
  },
]

export default function Sidebar({ collapsed, onToggle }) {
  const { currentPage, setCurrentPage } = useContext(AppContext)

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" onClick={onToggle} title="Toggle sidebar">
        <div className="logo-mark">
          <svg className="logo-mark-svg" width="44" height="44" viewBox="0 0 542 443" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="542" height="443" rx="122" fill="var(--accent)"/>
            <path d="M178.073 148.058C170.892 147.645 154.925 149.424 147.728 153.955C146.063 155.003 145.587 156.817 145.222 158.469C144.857 160.12 144.857 161.858 145.876 163.03C152.917 171.124 171.669 164.64 178.829 162.775C182.115 161.919 182.157 156.879 181.91 153.891C181.384 152.559 180.045 151.603 178.265 151.11C176.485 150.617 174.305 150.617 171.2 151.454" stroke="white" strokeWidth="19" strokeLinecap="round"/>
            <path d="M170.925 265C164.679 265 151.22 265.937 148.497 268.13C145.795 270.306 145.573 275.038 146.482 279.047C148.556 288.185 168.057 281.949 174.257 281.594C176.82 281.448 178.023 279.959 178.876 278.516C179.73 277.072 180.152 275.359 179.95 273.79C179.749 272.221 178.91 270.849 174.652 269" stroke="white" strokeWidth="19" strokeLinecap="round"/>
            <path d="M354.875 190.943C355.497 191.988 357.776 194.546 360.076 196.087C362.201 197.51 363.298 200.394 365.948 205.586C367.488 208.603 368.242 212.921 368.996 217.444C370.097 224.045 369.049 233.253 367.689 238.396C366.651 242.321 364.482 247.258 362.693 251.05C361.247 253.577 359.821 255.972 358.626 257.579C357.991 258.231 357.299 258.55 356.586 258.879" stroke="white" strokeWidth="37" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="logo-wordmark">
          <img src="/logo.svg" alt="DropStudio" className="logo-wordmark-img" />
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <a
            key={item.id}
            className={`nav-item${currentPage === item.id ? ' active' : ''}`}
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setCurrentPage(item.id)
            }}
          >
            {item.icon}
            <span className="nav-item-label">{item.label}</span>
          </a>
        ))}
      </nav>

      <button className="create-btn-sidebar" onClick={() => alert('Create modal coming soon!')}>
        Create
      </button>
    </aside>
  )
}
