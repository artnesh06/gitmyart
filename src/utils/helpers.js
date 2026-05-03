// Format number dengan locale
export function fn(n) {
  return Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 })
}

// Format value dengan suffix (M, K)
export function fmtVal(n) {
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K'
  return '$' + n
}

// Shorten address
export function shortAddr(a) {
  if (!a || a.length <= 14) return a || ''
  return a.slice(0, 8) + '...' + a.slice(-4)
}

// Random between
export function randBetween(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a
}

// Pick random from array
export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Format ends in label
export function formatEndsInLabel(endsAt, fallbackEndsIn = '') {
  const end = endsAt ? new Date(endsAt) : null
  if (!end || Number.isNaN(end.getTime())) {
    if (!fallbackEndsIn || fallbackEndsIn === 'Ended') return 'Ended'
    return 'End in ' + fallbackEndsIn.replace(/\b0d\b\s*/g, '').replace(/\b0h\b\s*/g, '').trim()
  }
  const diff = end.getTime() - Date.now()
  if (diff <= 0) return 'Ended'
  let totalSeconds = Math.floor(diff / 1000)
  const d = Math.floor(totalSeconds / 86400)
  totalSeconds -= d * 86400
  const h = Math.floor(totalSeconds / 3600)
  totalSeconds -= h * 3600
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  const parts = []
  if (d > 0) parts.push(`${d}d`)
  if (h > 0 || d > 0) parts.push(`${h}h`)
  parts.push(`${m}m`)
  parts.push(`${s}s`)
  return 'End in ' + parts.join(' ')
}

// Toast notification
export function toast(msg, type = 'info') {
  const t = document.createElement('div')
  t.className = 'toast toast-' + type
  t.textContent = msg
  document.body.appendChild(t)
  setTimeout(() => t.classList.add('show'), 10)
  setTimeout(() => {
    t.classList.remove('show')
    setTimeout(() => t.remove(), 300)
  }, 3000)
}
