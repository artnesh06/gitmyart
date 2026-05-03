import { useCallback } from 'react'

export function useToast() {
  const toast = useCallback((msg, type = 'info') => {
    const t = document.createElement('div')
    t.className = 'toast toast-' + type
    t.textContent = msg
    document.body.appendChild(t)
    setTimeout(() => t.classList.add('show'), 10)
    setTimeout(() => {
      t.classList.remove('show')
      setTimeout(() => t.remove(), 300)
    }, 3000)
  }, [])

  return { toast }
}
