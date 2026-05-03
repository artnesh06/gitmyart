import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { ThemeContext } from '../context/ThemeContext'

const CHAINS = {
  atom: { name: 'Cosmos', symbol: 'ATOM', icon: '🌍' },
  megaeth: { name: 'MegaETH', symbol: 'METH', icon: '⚡' },
  ethereum: { name: 'Ethereum', symbol: 'ETH', icon: '🔷' },
}

const NOTIFICATIONS = [
  { icon: '🎉', text: 'New raffle <b>Mega Jackpot</b> just launched!', time: '2m ago' },
  { icon: '⏰', text: 'Raffle <b>Whale Raffle</b> ending in 1 hour!', time: '15m ago' },
  { icon: '🏆', text: '<b>0xdead...eeff</b> won the Genesis Raffle!', time: '1h ago' },
  { icon: '✨', text: 'New collection <b>PixelPunk</b> added.', time: '2h ago' },
  { icon: '💰', text: '<b>0x1a2b...ef12</b> claimed 14,200 $REBEL.', time: '3h ago' },
  { icon: '🎰', text: '<b>Golden Ticket</b> raffle 45% full!', time: '4h ago' },
]

// Accent color presets — no duplicate purples
const ACCENT_PRESETS = [
  '#7c3aed', '#2563eb', '#0891b2', '#059669',
  '#d97706', '#dc2626', '#db2777', '#0ea5e9',
]

const FONT_OPTIONS = [
  { key: 'inter', label: 'Inter' },
  { key: 'space', label: 'Space Grotesk' },
  { key: 'outfit', label: 'Outfit' },
  { key: 'syne', label: 'Syne' },
  { key: 'mono', label: 'JetBrains Mono' },
  { key: 'orbitron', label: 'Orbitron' },
  { key: 'rajdhani', label: 'Rajdhani' },
  { key: 'bebas', label: 'Bebas Neue' },
  { key: 'chakra', label: 'Chakra Petch' },
  { key: 'nunito', label: 'Nunito' },
  { key: 'manrope', label: 'Manrope' },
  { key: 'vt323', label: 'VT323' },
  { key: 'pixelify', label: 'Pixelify Sans' },
]

const GRADIENT_PRESETS = [
  { name: 'Midnight', c1: '#0f0c29', c2: '#302b63', dir: '135deg' },
  { name: 'Ocean', c1: '#0575e6', c2: '#021b79', dir: '135deg' },
  { name: 'Sunset', c1: '#f7971e', c2: '#ffd200', dir: '135deg' },
  { name: 'Rose', c1: '#f953c6', c2: '#b91d73', dir: '135deg' },
  { name: 'Forest', c1: '#134e5e', c2: '#71b280', dir: '135deg' },
  { name: 'Cosmic', c1: '#2c3e50', c2: '#4ca1af', dir: '135deg' },
  { name: 'Ember', c1: '#eb3349', c2: '#f45c43', dir: '135deg' },
  { name: 'Aurora', c1: '#00c3ff', c2: '#ffff1c', dir: '135deg' },
  { name: 'Void', c1: '#200122', c2: '#6f0000', dir: '135deg' },
  { name: 'Mint', c1: '#00b09b', c2: '#96c93d', dir: '135deg' },
  { name: 'Dusk', c1: '#2c3e50', c2: '#fd746c', dir: '135deg' },
  { name: 'Candy', c1: '#d3959b', c2: '#bfe6ba', dir: '135deg' },
]

function Toggle({ checked, onChange }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 36, height: 20, borderRadius: 10,
          background: checked ? 'var(--accent)' : 'var(--border-l)',
          position: 'relative', transition: 'background .2s', cursor: 'pointer', flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: 2, left: checked ? 18 : 2,
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,.3)',
        }} />
      </div>
    </label>
  )
}

function Accordion({ title, open, onToggle, children }) {
  return (
    <div className="settings-accordion">
      <button className={`settings-accordion-hdr${open ? ' open' : ''}`} onClick={onToggle}>
        <span>{title}</span>
        <svg className="acc-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="settings-accordion-body" style={{ display: 'flex' }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default function RightPanel({ open, section, onClose }) {
  const { activeChain, setActiveChain } = useContext(AppContext)
  const { theme, setTheme, accentColor, setAccentColor, density, setDensity } = useContext(ThemeContext)

  const [notifs, setNotifs] = useState(NOTIFICATIONS)
  const [acc, setAcc] = useState({ appearance: true, font: false, background: false, layout: false, animation: false })
  const toggleAcc = (k) => setAcc(p => ({ ...p, [k]: !p[k] }))

  // Local settings state
  const [font, setFont] = useState(() => localStorage.getItem('rebel-font') || 'inter')
  const [radius, setRadius] = useState(() => parseInt(localStorage.getItem('rebel-radius') || '12'))
  const [fontSize, setFontSizeVal] = useState(() => parseInt(localStorage.getItem('rebel-fontsize') || '15'))
  const [letterSpacing, setLetterSpacingVal] = useState(() => parseFloat(localStorage.getItem('rebel-letterspacing') || '0'))
  const [bgType, setBgType] = useState(() => localStorage.getItem('rebel-bgtype') || 'solid')
  const [bgColor, setBgColor] = useState(() => localStorage.getItem('rebel-custom-bg') || '#1a1a1e')
  const [gradC1, setGradC1] = useState('#1a1a1e')
  const [gradC2, setGradC2] = useState('#2d1b69')
  const [gradDir, setGradDir] = useState('135deg')
  const [glassOn, setGlassOn] = useState(() => localStorage.getItem('rebel-glass') === 'on')
  const [cardBorder, setCardBorder] = useState(() => localStorage.getItem('rebel-card-border') !== 'off')
  const [pageTrans, setPageTrans] = useState(() => localStorage.getItem('rebel-page-trans') !== 'off')
  const [hoverFx, setHoverFx] = useState(() => localStorage.getItem('rebel-hover-fx') !== 'off')
  const [glowFx, setGlowFx] = useState(() => localStorage.getItem('rebel-glow-fx') !== 'off')
  const [anim, setAnim] = useState(() => localStorage.getItem('rebel-anim') || 'normal')
  const [corners, setCorners] = useState(() => localStorage.getItem('rebel-corners') || 'rounded')

  // Apply helpers
  function applyFont(f) {
    setFont(f)
    document.documentElement.setAttribute('data-font', f)
    localStorage.setItem('rebel-font', f)
  }
  function applyRadius(v) {
    setRadius(v)
    document.documentElement.style.setProperty('--radius', v + 'px')
    document.documentElement.style.setProperty('--radius-sm', Math.max(0, v - 4) + 'px')
    document.documentElement.style.setProperty('--radius-lg', Math.min(24, v + 4) + 'px')
    localStorage.setItem('rebel-radius', v)
  }
  function applyFontSize(v) {
    setFontSizeVal(v)
    const rem = (v / 16).toFixed(4)
    document.documentElement.style.setProperty('--fs', rem + 'rem')
    localStorage.setItem('rebel-fontsize', v)
  }
  function applyLetterSpacing(v) {
    setLetterSpacingVal(v)
    document.body.style.letterSpacing = v + 'px'
    localStorage.setItem('rebel-letterspacing', v)
  }
  function applyBgColor(c) {
    setBgColor(c)
    document.body.style.background = c
    localStorage.setItem('rebel-custom-bg', c)
  }
  function applyGradient(c1 = gradC1, c2 = gradC2, dir = gradDir) {
    const grad = `linear-gradient(${dir}, ${c1}, ${c2})`
    document.body.style.background = grad
    localStorage.setItem('rebel-gradient', JSON.stringify({ c1, c2, dir }))
  }
  function applyGlass(on) {
    setGlassOn(on)
    document.documentElement.setAttribute('data-glass', on ? 'on' : 'off')
    localStorage.setItem('rebel-glass', on ? 'on' : 'off')
  }
  function applyCardBorder(on) {
    setCardBorder(on)
    document.documentElement.setAttribute('data-card-border', on ? 'on' : 'off')
    localStorage.setItem('rebel-card-border', on ? 'on' : 'off')
  }
  function applyPageTrans(on) {
    setPageTrans(on)
    document.documentElement.setAttribute('data-page-trans', on ? 'on' : 'off')
    localStorage.setItem('rebel-page-trans', on ? 'on' : 'off')
  }
  function applyHoverFx(on) {
    setHoverFx(on)
    document.documentElement.setAttribute('data-hover-fx', on ? 'on' : 'off')
    localStorage.setItem('rebel-hover-fx', on ? 'on' : 'off')
  }
  function applyGlowFx(on) {
    setGlowFx(on)
    document.documentElement.setAttribute('data-glow-fx', on ? 'on' : 'off')
    localStorage.setItem('rebel-glow-fx', on ? 'on' : 'off')
  }
  function applyAnim(v) {
    setAnim(v)
    localStorage.setItem('rebel-anim', v)
  }
  function applyCorners(v) {
    setCorners(v)
    document.documentElement.setAttribute('data-corners', v)
    localStorage.setItem('rebel-corners', v)
  }
  function resetAll() {
    applyFont('inter')
    applyRadius(12)
    applyFontSize(15)
    applyLetterSpacing(0)
    setBgType('solid')
    document.body.style.background = ''
    setTheme('system')
    setDensity('normal')
    applyGlass(false)
    applyCardBorder(true)
    applyPageTrans(true)
    applyHoverFx(true)
    applyGlowFx(true)
    applyAnim('normal')
    applyCorners('rounded')
    setAccentColor('#7c3aed')
    document.documentElement.style.setProperty('--accent', '#7c3aed')
    localStorage.clear()
  }

  const rowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }
  const labelStyle = { fontSize: 12, color: 'var(--t2)' }
  const valStyle = { fontSize: 12, fontWeight: 700, color: 'var(--accent)', background: 'rgba(124,58,237,.12)', padding: '2px 7px', borderRadius: 999 }

  return (
    <>
      <div className={`rpanel-resize-handle${open ? ' visible' : ''}`}></div>
      <aside className={`right-panel${open ? ' open' : ''}`} id="rightPanel">

        {/* ===== NOTIFICATIONS ===== */}
        <div className={`rpanel-section${section === 'notif' && open ? ' active' : ''}`}>
          <div className="rpanel-header">
            <span className="rpanel-title">Notifications</span>
            <button className="notif-clear" onClick={() => setNotifs([])}>Clear all</button>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {notifs.length === 0
              ? <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--t3)', fontSize: 14 }}>No notifications</div>
              : notifs.map((n, i) => (
                <div key={i} className="notif-item">
                  <div className="notif-icon">{n.icon}</div>
                  <div className="notif-body">
                    <div className="notif-text" dangerouslySetInnerHTML={{ __html: n.text }} />
                    <div className="notif-time">{n.time}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ===== SETTINGS ===== */}
        <div className={`rpanel-section${section === 'settings' && open ? ' active' : ''}`}>
          <div className="rpanel-header">
            <span className="rpanel-title">Settings</span>
            <button className="settings-header-save" onClick={onClose}>Save</button>
          </div>
          <div className="settings-body">

            {/* APPEARANCE */}
            <Accordion title="Appearance" open={acc.appearance} onToggle={() => toggleAcc('appearance')}>
              {/* Theme */}
              <div className="settings-row-label">Theme</div>
              <div className="settings-options">
                {[['dark','Dark'],['system','System'],['light','Bright']].map(([v,l]) => (
                  <button key={v} className={`settings-opt${theme === v ? ' active' : ''}`} onClick={() => setTheme(v)}>{l}</button>
                ))}
              </div>

              {/* Accent color */}
              <div className="settings-row-label" style={{ marginTop: 10 }}>Accent Color</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                {ACCENT_PRESETS.map(c => (
                  <button key={c} onClick={() => setAccentColor(c)} style={{
                    width: 26, height: 26, borderRadius: 6, background: c, cursor: 'pointer', flexShrink: 0,
                    border: accentColor === c ? '2px solid #fff' : '2px solid transparent',
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)}
                  style={{ width: 36, height: 36, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'none' }} />
                <input type="text" value={accentColor} onChange={e => setAccentColor(e.target.value)} maxLength={7}
                  style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--t1)', fontSize: 13, outline: 'none' }} />
              </div>

              {/* Density */}
              <div className="settings-row-label" style={{ marginTop: 10 }}>Density</div>
              <div className="settings-options">
                {[['compact','Compact'],['normal','Normal'],['spacious','Spacious']].map(([v,l]) => (
                  <button key={v} className={`settings-opt${density === v ? ' active' : ''}`} onClick={() => setDensity(v)}>{l}</button>
                ))}
              </div>

              {/* Corner radius */}
              <div style={rowStyle} className={{ marginTop: 10 }}>
                <div className="settings-row-label" style={{ marginTop: 10 }}>Corner Radius</div>
                <span style={valStyle}>{radius}px</span>
              </div>
              <input type="range" min={0} max={24} value={radius} onChange={e => applyRadius(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent)' }} />

              {/* Corner style */}
              <div className="settings-row-label" style={{ marginTop: 10 }}>Corner Style</div>
              <div className="settings-options">
                {[['rounded','Rounded'],['sharp','Sharp']].map(([v,l]) => (
                  <button key={v} className={`settings-opt${corners === v ? ' active' : ''}`} onClick={() => applyCorners(v)}>{l}</button>
                ))}
              </div>
            </Accordion>

            {/* FONT */}
            <Accordion title="Font" open={acc.font} onToggle={() => toggleAcc('font')}>
              {/* Font family */}
              <div className="settings-row-label">Font Family</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                {FONT_OPTIONS.map(f => (
                  <button key={f.key} className={`settings-opt${font === f.key ? ' active' : ''}`}
                    style={{ flex: 'none' }} onClick={() => applyFont(f.key)}>{f.label}</button>
                ))}
              </div>

              {/* Font size */}
              <div style={rowStyle}>
                <div className="settings-row-label">Font Size</div>
                <span style={valStyle}>{fontSize}px</span>
              </div>
              <input type="range" min={10} max={20} value={fontSize} onChange={e => applyFontSize(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent)' }} />

              {/* Letter spacing */}
              <div style={{ ...rowStyle, marginTop: 8 }}>
                <div className="settings-row-label">Letter Spacing</div>
                <span style={valStyle}>{letterSpacing}px</span>
              </div>
              <input type="range" min={-1} max={3} step={0.1} value={letterSpacing} onChange={e => applyLetterSpacing(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent)' }} />
            </Accordion>

            {/* BACKGROUND */}
            <Accordion title="Background" open={acc.background} onToggle={() => toggleAcc('background')}>
              {/* BG type */}
              <div className="settings-row-label">Background Type</div>
              <div className="settings-options" style={{ marginBottom: 10 }}>
                {[['solid','Solid'],['gradient','Gradient']].map(([v,l]) => (
                  <button key={v} className={`settings-opt${bgType === v ? ' active' : ''}`}
                    onClick={() => { setBgType(v); if (v === 'solid') { document.body.style.background = bgColor; } else { applyGradient(); } }}>{l}</button>
                ))}
              </div>

              {bgType === 'solid' && (
                <>
                  <div className="settings-row-label">Background Color</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    <input type="color" value={bgColor} onChange={e => { setBgColor(e.target.value); applyBgColor(e.target.value) }}
                      style={{ width: 36, height: 36, borderRadius: 6, border: 'none', cursor: 'pointer' }} />
                    <input type="text" value={bgColor} onChange={e => { setBgColor(e.target.value); applyBgColor(e.target.value) }} maxLength={7}
                      style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--t1)', fontSize: 13, outline: 'none' }} />
                    <button onClick={() => { document.body.style.background = ''; setBgColor('#1a1a1e') }}
                      style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--t2)', fontSize: 12, cursor: 'pointer' }}>Reset</button>
                  </div>
                </>
              )}

              {bgType === 'gradient' && (
                <>
                  <div className="settings-row-label">Gradient Presets</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                    {GRADIENT_PRESETS.map((p, i) => (
                      <button key={i} title={p.name} onClick={() => {
                        setGradC1(p.c1); setGradC2(p.c2); setGradDir(p.dir)
                        applyGradient(p.c1, p.c2, p.dir)
                      }} style={{
                        width: 36, height: 36, borderRadius: 8, cursor: 'pointer', flexShrink: 0,
                        background: `linear-gradient(${p.dir},${p.c1},${p.c2})`,
                        border: '2px solid transparent',
                      }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    <input type="color" value={gradC1} onChange={e => { setGradC1(e.target.value); applyGradient(e.target.value, gradC2, gradDir) }}
                      style={{ width: 36, height: 36, borderRadius: 6, border: 'none', cursor: 'pointer' }} />
                    <input type="color" value={gradC2} onChange={e => { setGradC2(e.target.value); applyGradient(gradC1, e.target.value, gradDir) }}
                      style={{ width: 36, height: 36, borderRadius: 6, border: 'none', cursor: 'pointer' }} />
                    <select value={gradDir} onChange={e => { setGradDir(e.target.value); applyGradient(gradC1, gradC2, e.target.value) }}
                      style={{ flex: 1, padding: '7px 8px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--t1)', fontSize: 12 }}>
                      {['135deg','90deg','180deg','45deg','0deg'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* Glass effect */}
              <div style={rowStyle}>
                <span style={labelStyle}>Glass Effect</span>
                <Toggle checked={glassOn} onChange={applyGlass} />
              </div>
              {/* Card border */}
              <div style={rowStyle}>
                <span style={labelStyle}>Card Border</span>
                <Toggle checked={cardBorder} onChange={applyCardBorder} />
              </div>
            </Accordion>

            {/* LAYOUT */}
            <Accordion title="Layout" open={acc.layout} onToggle={() => toggleAcc('layout')}>
              <div className="settings-row-label">Sidebar</div>
              <div className="settings-options" style={{ marginBottom: 10 }}>
                {[['normal','Normal'],['compact','Compact']].map(([v,l]) => (
                  <button key={v} className="settings-opt" onClick={() => {
                    document.documentElement.setAttribute('data-compact-nav', v === 'compact' ? 'on' : 'off')
                  }}>{l}</button>
                ))}
              </div>
            </Accordion>

            {/* ANIMATION */}
            <Accordion title="Animation" open={acc.animation} onToggle={() => toggleAcc('animation')}>
              <div className="settings-row-label">Animation Speed</div>
              <div className="settings-options" style={{ marginBottom: 10 }}>
                {[['off','Off'],['slow','Slow'],['normal','Normal'],['fast','Fast']].map(([v,l]) => (
                  <button key={v} className={`settings-opt${anim === v ? ' active' : ''}`} onClick={() => applyAnim(v)}>{l}</button>
                ))}
              </div>
              <div style={rowStyle}>
                <span style={labelStyle}>Page Transitions</span>
                <Toggle checked={pageTrans} onChange={applyPageTrans} />
              </div>
              <div style={rowStyle}>
                <span style={labelStyle}>Hover Effects</span>
                <Toggle checked={hoverFx} onChange={applyHoverFx} />
              </div>
              <div style={rowStyle}>
                <span style={labelStyle}>Glow Effects</span>
                <Toggle checked={glowFx} onChange={applyGlowFx} />
              </div>
            </Accordion>

            {/* Reset button */}
            <button onClick={resetAll} style={{
              width: '100%', marginTop: 8, padding: '10px', borderRadius: 10,
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--t3)', fontSize: 13, cursor: 'pointer', transition: 'all .12s',
            }}
              onMouseEnter={e => { e.target.style.color = 'var(--red)'; e.target.style.borderColor = 'var(--red)' }}
              onMouseLeave={e => { e.target.style.color = 'var(--t3)'; e.target.style.borderColor = 'var(--border)' }}
            >
              Reset All Settings
            </button>

          </div>
        </div>

        {/* ===== CHAIN SELECTOR ===== */}
        <div className={`rpanel-section${section === 'chain' && open ? ' active' : ''}`}>
          <div className="rpanel-header">
            <span className="rpanel-title">Select Chain</span>
          </div>
          <div className="rpanel-chain-list">
            {Object.entries(CHAINS).map(([key, chain]) => (
              <button key={key} className={`rpanel-chain-opt${activeChain === key ? ' active' : ''}`}
                onClick={() => { setActiveChain(key); onClose() }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>{chain.icon}</span>
                <span style={{ flex: 1 }}>{chain.name} ({chain.symbol})</span>
                {activeChain === key && (
                  <svg className="rpanel-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'block' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ===== PROFILE ===== */}
        <div className={`rpanel-section${section === 'profile' && open ? ' active' : ''}`}>
          <div className="rpanel-header">
            <span className="rpanel-title">Profile</span>
          </div>
          <div className="rpanel-profile-card">
            <div className="rpanel-profile-avatar">
              <img src="https://picsum.photos/seed/profile/80/80" alt="avatar" />
            </div>
            <div className="rpanel-profile-wallet">Connect wallet to view profile</div>
            <div className="rpanel-profile-stats">
              {[['NFTs Staked','—'],['Total Points','—'],['Raffles Entered','—'],['Chain',activeChain.toUpperCase()]].map(([l,v]) => (
                <div key={l} className="rpanel-profile-stat">
                  <span className="rpanel-profile-stat-l">{l}</span>
                  <span className="rpanel-profile-stat-v">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </aside>
    </>
  )
}
