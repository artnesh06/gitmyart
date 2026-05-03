# React + Vite Migration Guide

## Overview
DropStudio.fun telah dimigrasikan dari vanilla JavaScript ke React + Vite dengan RainbowKit untuk wallet connection.

## Project Structure

```
rebel-gallery/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Left navigation sidebar
│   │   ├── Topbar.jsx           # Top bar dengan chain selector & settings
│   │   ├── RightPanel.jsx       # Right panel untuk settings & notifications
│   │   └── MainContent.jsx      # Router & page container
│   ├── pages/
│   │   ├── HomePage.jsx         # Home page dengan trending raffles
│   │   ├── LeaderboardPage.jsx  # Leaderboard
│   │   ├── RafflesPage.jsx      # Raffles listing
│   │   └── CollectionsPage.jsx  # Collections listing
│   ├── context/
│   │   ├── AppContext.jsx       # Global app state (user, chain, session)
│   │   └── ThemeContext.jsx     # Theme & accent color management
│   ├── hooks/
│   │   ├── useApi.js            # API calls dengan session token
│   │   ├── useWallet.js         # Wallet connection logic
│   │   └── useToast.js          # Toast notifications
│   ├── constants/
│   │   ├── chains.js            # Chain definitions
│   │   ├── coins.js             # Coin data
│   │   └── notifications.js     # Notification templates
│   ├── utils/
│   │   └── helpers.js           # Utility functions (format, etc)
│   ├── theme/
│   │   └── rainbowKitTheme.js   # Custom RainbowKit theme
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # Entry point
├── styles.css                   # Global styles (dari vanilla version)
├── index.html                   # HTML entry point
├── vite.config.js               # Vite configuration
├── package.json                 # Dependencies & scripts
├── .env                         # Environment variables
└── server/                      # Express backend (unchanged)
```

## Setup & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Edit `.env` file:
```
VITE_WALLETCONNECT_PROJECT_ID=YOUR_PROJECT_ID
VITE_API_BASE=http://localhost:3456/api
```

Get WalletConnect Project ID dari https://cloud.walletconnect.com

### 3. Start Development
```bash
# Terminal 1: Start backend (Express)
npm run server

# Terminal 2: Start frontend (Vite)
npm run client

# Or run both concurrently:
npm run dev
```

Frontend akan run di `http://localhost:5173`
Backend akan run di `http://localhost:3456`

### 4. Build for Production
```bash
npm run build
```

Output akan di `dist/` folder.

## Key Changes from Vanilla JS

### 1. Component Structure
- Vanilla: Single `app.js` dengan DOM manipulation
- React: Components dengan JSX, state management via hooks & context

### 2. Routing
- Vanilla: Manual `goPage()` function
- React: React Router dengan URL-based navigation

### 3. State Management
- Vanilla: Global variables
- React: Context API (AppContext, ThemeContext)

### 4. API Calls
- Vanilla: Global `api()` function
- React: `useApi()` hook dengan session token handling

### 5. Styling
- Vanilla: Single `styles.css`
- React: Same `styles.css` imported in `main.jsx`

### 6. Theme System
- Vanilla: Manual CSS variable updates
- React: ThemeContext dengan automatic CSS variable application

### 7. Wallet Connection
- Vanilla: Custom modal dengan manual provider detection
- React: RainbowKit dengan automatic provider detection & custom theme

## RainbowKit Integration

### Custom Theme
RainbowKit theme mengikuti CSS variables dari app:
- `--accent`: Primary color
- `--bg`: Background color
- `--t1`: Text primary
- `--border`: Border color

Theme otomatis update saat user mengubah settings.

### Supported Chains
- Ethereum (mainnet)
- Polygon
- Arbitrum

Tambah chain di `src/App.jsx` di `getDefaultConfig()`.

## API Integration

### Session Token
Session token disimpan di localStorage dan otomatis dikirim di header `x-session-token` untuk setiap API call.

### Example API Call
```jsx
import { useApi } from '../hooks/useApi'

function MyComponent() {
  const { api } = useApi()

  const loadData = async () => {
    const data = await api('/raffles')
    // data.raffles, data.collections, etc
  }
}
```

## Context Providers

### AppContext
Menyimpan:
- `currentUser`: User data
- `sessionToken`: Session token
- `activeChain`: Current chain
- Methods: `login()`, `logout()`, `switchChain()`

### ThemeContext
Menyimpan:
- `theme`: 'dark' | 'light' | 'system'
- `accentColor`: Hex color
- `density`: 'compact' | 'normal' | 'spacious'
- Methods: `updateTheme()`, `updateAccentColor()`, `updateDensity()`

## Backend (Express)

Backend tetap unchanged di port 3456. Vite proxy semua `/api` requests ke backend.

### Admin Panel
Admin panel tetap di `http://localhost:3456/admin.html`

## Migration Checklist

- [x] Setup Vite + React
- [x] Create component structure
- [x] Setup context providers (App, Theme)
- [x] Create hooks (useApi, useWallet, useToast)
- [x] Setup RainbowKit dengan custom theme
- [x] Migrate pages (Home, Leaderboard, Raffles, Collections)
- [x] Import styles.css
- [x] Setup routing dengan React Router
- [ ] Migrate remaining vanilla JS logic ke React components
- [ ] Add more pages (collection detail, raffle detail, etc)
- [ ] Setup error boundaries
- [ ] Add loading states
- [ ] Add animations & transitions

## Next Steps

1. **Migrate remaining pages**: Collection detail, Raffle detail, Top coins, etc
2. **Add more components**: Ticker, Trending raffles, Collection grid, etc
3. **Implement live updates**: WebSocket untuk real-time raffle entries
4. **Add animations**: Framer Motion untuk smooth transitions
5. **Error handling**: Error boundaries & fallback UI
6. **Performance**: Code splitting, lazy loading, memoization

## Troubleshooting

### Port already in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Kill process on port 3456
lsof -ti:3456 | xargs kill -9
```

### Module not found
Make sure all imports use correct paths:
```jsx
// ✓ Correct
import { useApi } from '../hooks/useApi'

// ✗ Wrong
import { useApi } from './hooks/useApi'
```

### CSS not loading
Make sure `styles.css` is imported in `src/main.jsx`:
```jsx
import '../styles.css'
```

### RainbowKit not showing
Make sure WalletConnect Project ID is set in `.env`:
```
VITE_WALLETCONNECT_PROJECT_ID=YOUR_PROJECT_ID
```

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [RainbowKit Documentation](https://www.rainbowkit.com)
- [Wagmi Documentation](https://wagmi.sh)
- [React Router Documentation](https://reactrouter.com)
