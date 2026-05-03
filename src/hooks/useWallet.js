import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useApp } from '../context/AppContext'
import { useApi } from './useApi'
import { useToast } from './useToast'

export function useWallet() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { login, logout } = useApp()
  const { api } = useApi()
  const { toast } = useToast()

  const handleConnect = async (wallet, chainName) => {
    try {
      const response = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ wallet, chain: chainName }),
      })

      if (response?.sessionToken) {
        login(response.user, response.sessionToken, chainName)
        toast('Connected: ' + wallet.slice(0, 8) + '...' + wallet.slice(-4), 'success')
      } else {
        toast(response?.error || 'Login failed', 'error')
      }
    } catch (error) {
      toast('Login error: ' + error.message, 'error')
    }
  }

  const handleDisconnect = () => {
    disconnect()
    logout()
    toast('Disconnected', 'info')
  }

  return {
    address,
    isConnected,
    chain,
    connect,
    connectors,
    disconnect: handleDisconnect,
    handleConnect,
  }
}
