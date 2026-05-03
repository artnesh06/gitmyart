import { useApp } from '../context/AppContext'

export function useApi() {
  const { sessionToken } = useApp()

  const api = async (path, opts = {}) => {
    const headers = { 'Content-Type': 'application/json' }
    if (sessionToken) headers['x-session-token'] = sessionToken

    try {
      const response = await fetch(`/api${path}`, {
        ...opts,
        headers: { ...headers, ...opts.headers },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'API error')
      return data
    } catch (error) {
      console.warn('[API]', path, error.message)
      return null
    }
  }

  return { api }
}
