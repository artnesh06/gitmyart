import React, { useState, useEffect } from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import './App.css'
import Dashboard from './pages/Dashboard'
import { useAccount } from 'wagmi'

// Configure chains
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
  const { address, isConnected } = useAccount()
  const [userNFTs, setUserNFTs] = useState([])
  const [userBalance, setUserBalance] = useState('0')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isConnected && address) {
      fetchUserNFTs()
      fetchUserBalance()
    }
  }, [isConnected, address])

  const fetchUserNFTs = async () => {
    setLoading(true)
    try {
      // Fetch from OpenSea API
      const response = await fetch(
        `https://api.opensea.io/api/v2/chain/ethereum/account/${address}/nfts`,
        {
          headers: {
            'X-API-KEY': import.meta.env.VITE_OPENSEA_API_KEY || '',
          },
        }
      )
      const data = await response.json()
      setUserNFTs(data.nfts || [])
    } catch (error) {
      console.error('Error fetching NFTs:', error)
    }
    setLoading(false)
  }

  const fetchUserBalance = async () => {
    try {
      // Fetch ETH balance
      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${import.meta.env.VITE_ETHERSCAN_API_KEY || ''}`
      )
      const data = await response.json()
      if (data.result) {
        setUserBalance((parseInt(data.result) / 1e18).toFixed(4))
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          <h1>🎨 DropStudio.fun</h1>
          <p>NFT Staking & Raffle Platform</p>
        </div>
        <ConnectButton />
      </header>

      {isConnected ? (
        <Dashboard
          address={address}
          nfts={userNFTs}
          balance={userBalance}
          loading={loading}
          onRefresh={fetchUserNFTs}
        />
      ) : (
        <div className="connect-prompt">
          <h2>Connect Your Wallet</h2>
          <p>Click the button above to connect your wallet and start staking NFTs</p>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AppContent />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
