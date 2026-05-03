import { Theme } from '@rainbow-me/rainbowkit'

export function createRainbowKitTheme(isDark, accentColor) {
  const theme = {
    blurs: {
      modalOverlay: '0px 8px 32px rgba(0, 0, 0, 0.32)',
    },
    colors: {
      accentColor: accentColor || '#7c3aed',
      accentColorForeground: '#fff',
      actionButtonBorder: isDark ? '#333339' : '#e4e4e7',
      actionButtonBorderMobile: isDark ? '#333339' : '#e4e4e7',
      actionButtonSecondaryBackground: isDark ? '#222226' : '#f8f8fa',
      closeButton: isDark ? '#a1a1aa' : '#52525b',
      closeButtonBackground: isDark ? '#222226' : '#f8f8fa',
      connectButtonBackground: accentColor || '#7c3aed',
      connectButtonBackgroundError: '#ef4444',
      connectButtonInnerBackground: isDark ? '#111114' : '#ffffff',
      connectButtonText: '#fff',
      connectButtonTextError: '#fff',
      connectionIndicator: '#4ade80',
      downloadBottomCardBackground: isDark ? '#222226' : '#f8f8fa',
      downloadTopCardBackground: isDark ? '#1a1a1e' : '#ffffff',
      error: '#ef4444',
      generalBorder: isDark ? '#333339' : '#e4e4e7',
      generalBorderDim: isDark ? '#222226' : '#f0f0f3',
      menuItemBackground: isDark ? '#222226' : '#f8f8fa',
      modalAction: accentColor || '#7c3aed',
      modalActionSecondary: isDark ? '#333339' : '#e4e4e7',
      modalBackground: isDark ? '#1a1a1e' : '#ffffff',
      modalBorder: isDark ? '#333339' : '#e4e4e7',
      modalText: isDark ? '#fafafa' : '#09090b',
      modalTextDim: isDark ? '#a1a1aa' : '#52525b',
      modalTextSecondary: isDark ? '#6b6b75' : '#a1a1aa',
      primaryButton: accentColor || '#7c3aed',
      primaryButtonText: '#fff',
      profileAction: isDark ? '#333339' : '#e4e4e7',
      profileActionHover: isDark ? '#44444b' : '#d1d1d6',
      profileForeground: isDark ? '#222226' : '#f8f8fa',
      selectedOptionBorder: accentColor || '#7c3aed',
      standby: '#a1a1aa',
    },
    fonts: {
      body: 'Inter, sans-serif',
    },
    radii: {
      actionButton: '10px',
      connectButton: '10px',
      menuButton: '10px',
      modal: '16px',
      modalMobile: '16px',
    },
    shadows: {
      connectButton: '0 4px 20px rgba(0, 0, 0, 0.3)',
      dialog: '0 4px 20px rgba(0, 0, 0, 0.3)',
      profileDetailsAction: '0 2px 6px rgba(0, 0, 0, 0.1)',
      selectedOption: '0 0 0 2px ' + (accentColor || '#7c3aed'),
      selectedWallet: '0 0 0 2px ' + (accentColor || '#7c3aed'),
      walletLogo: '0 2px 16px rgba(0, 0, 0, 0.16)',
    },
  }

  return theme
}
