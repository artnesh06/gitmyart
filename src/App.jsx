import React, { useState, useEffect } from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import './App.css'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import MainContent from './components/MainContent'
import RightPanel from './components/RightPanel'
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'

const chains = [mainnet, sepolia]

const config = createConfig({
  chains,
  transports: {
    [mainnet.id]: http('https://eth.llamarpc.com'),
    [sepolia.id]: http('https://rpc.sepolia.org'),
  },
})

const queryClient = new QueryClient()

function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [rightPanelSection, setRightPanelSection] = useState(null)

  return (
    <div className={`app ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="main-wrapper">
        <div className="main-content-area">
          <Topbar 
            onChainClick={() => {
              setRightPanelOpen(true)
              setRightPanelSection('chain')
            }}
            onSettingsClick={() => {
              setRightPanelOpen(true)
              setRightPanelSection('settings')
            }}
            onNotifClick={() => {
              setRightPanelOpen(true)
              setRightPanelSection('notif')
            }}
            onProfileClick={() => {
              setRightPanelOpen(true)
              setRightPanelSection('profile')
            }}
          />
          
          <MainContent />
        </div>

        <RightPanel 
          open={rightPanelOpen} 
          section={rightPanelSection}
          onClose={() => setRightPanelOpen(false)}
        />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ThemeProvider>
            <AppProvider>
              <AppContent />
            </AppProvider>
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
