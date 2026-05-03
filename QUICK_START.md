# Quick Start Guide

## 1. Install & Setup (5 minutes)

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add WalletConnect Project ID
# Get from https://cloud.walletconnect.com
```

## 2. Run Development (2 minutes)

```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run server  # Terminal 1 - Backend on :3456
npm run client  # Terminal 2 - Frontend on :5173
```

## 3. Access the App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3456/api
- **Admin Panel**: http://localhost:3456/admin.html

## 4. Key URLs

| Page | URL |
|------|-----|
| Home | http://localhost:5173/ |
| Leaderboard | http://localhost:5173/leaderboard |
| Raffles | http://localhost:5173/raffles |
| Collections | http://localhost:5173/collections |

## 5. Features

### Theme Settings
- Click settings icon in topbar
- Choose theme: Dark, Light, System
- Pick accent color
- Adjust density: Compact, Normal, Spacious

### Wallet Connection
- Click "Sign in" button
- RainbowKit modal appears
- Select wallet (MetaMask, Rabby, Keplr, etc.)
- Approve connection

### Chain Selector
- Click chain button in topbar (shows current chain)
- Select different chain: Cosmos, MegaETH, Ethereum

## 6. File Structure

```
src/
├── components/     # UI components
├── pages/          # Page components
├── context/        # Global state
├── hooks/          # Custom hooks
├── constants/      # Constants
├── utils/          # Utilities
└── theme/          # Theme config
```

## 7. Common Tasks

### Add a New Page
1. Create `src/pages/MyPage.jsx`
2. Add route in `src/components/MainContent.jsx`
3. Add nav item in `src/components/Sidebar.jsx`

### Make API Call
```jsx
import { useApi } from '../hooks/useApi'

const { api } = useApi()
const data = await api('/endpoint')
```

### Use Theme
```jsx
import { useTheme } from '../context/ThemeContext'

const { theme, updateTheme, accentColor } = useTheme()
```

### Use App State
```jsx
import { useApp } from '../context/AppContext'

const { currentUser, activeChain, login, logout } = useApp()
```

## 8. Build for Production

```bash
npm run build
# Output in dist/ folder
```

## 9. Troubleshooting

| Issue | Solution |
|-------|----------|
| Port in use | `lsof -ti:5173 \| xargs kill -9` |
| Module not found | Check import paths |
| CSS not loading | Verify import in `src/main.jsx` |
| RainbowKit not showing | Check `.env` has Project ID |
| API failing | Check backend running on :3456 |

## 10. Documentation

- **SETUP_INSTRUCTIONS.md** - Detailed setup guide
- **REACT_MIGRATION.md** - Migration details
- **DELIVERABLES.md** - What's included

## 11. Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: CSS (vanilla)
- **Routing**: React Router
- **State**: Context API
- **Wallet**: RainbowKit + Wagmi
- **API**: Fetch API
- **Backend**: Express (unchanged)
- **Database**: SQLite (unchanged)

## 12. Environment Variables

```
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_API_BASE=http://localhost:3456/api
```

## 13. Scripts

```bash
npm run dev      # Run frontend + backend
npm run server   # Run backend only
npm run client   # Run frontend only
npm run build    # Build for production
npm run preview  # Preview production build
npm run seed     # Seed database
```

## 14. Next Steps

1. ✅ Setup complete
2. ✅ Run with `npm run dev`
3. ⏳ Migrate remaining vanilla JS logic
4. ⏳ Add more pages
5. ⏳ Implement real-time updates
6. ⏳ Add tests

## 15. Support

- Check browser console for errors
- Look at Network tab in DevTools
- Review documentation files
- Check backend logs

---

**Ready to go!** 🚀

Run `npm run dev` and start building!
