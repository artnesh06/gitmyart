# DropStudio.fun - React + Vite Setup Instructions

## Quick Start

### 1. Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create `.env` file in root directory:
```
VITE_WALLETCONNECT_PROJECT_ID=YOUR_PROJECT_ID
VITE_API_BASE=http://localhost:3456/api
```

**Get WalletConnect Project ID:**
1. Go to https://cloud.walletconnect.com
2. Create a new project
3. Copy the Project ID
4. Paste into `.env`

### 4. Start Development

**Option A: Run both frontend and backend together**
```bash
npm run dev
```

**Option B: Run separately (recommended for debugging)**

Terminal 1 - Backend (Express):
```bash
npm run server
```

Terminal 2 - Frontend (Vite):
```bash
npm run client
```

### 5. Access the App
- Frontend: http://localhost:5173
- Backend API: http://localhost:3456/api
- Admin Panel: http://localhost:3456/admin.html

## Project Structure

```
src/
├── components/          # React components
│   ├── Sidebar.jsx     # Left navigation
│   ├── Topbar.jsx      # Top bar with chain selector
│   ├── RightPanel.jsx  # Settings & notifications
│   ├── MainContent.jsx # Router & page container
│   ├── ErrorBoundary.jsx
│   └── LoadingSpinner.jsx
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── LeaderboardPage.jsx
│   ├── RafflesPage.jsx
│   └── CollectionsPage.jsx
├── context/            # Context providers
│   ├── AppContext.jsx  # Global app state
│   └── ThemeContext.jsx # Theme management
├── hooks/              # Custom React hooks
│   ├── useApi.js       # API calls
│   ├── useWallet.js    # Wallet connection
│   └── useToast.js     # Toast notifications
├── constants/          # Constants
│   ├── chains.js
│   ├── coins.js
│   └── notifications.js
├── utils/              # Utility functions
│   └── helpers.js
├── theme/              # Theme configuration
│   └── rainbowKitTheme.js
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## Key Features

### 1. Theme System
- Dark/Light/System theme support
- Custom accent color picker
- Density settings (compact/normal/spacious)
- All settings saved to localStorage

### 2. Wallet Connection
- RainbowKit integration
- Support for MetaMask, Rabby, Keplr, etc.
- Automatic provider detection
- Custom theme that matches app theme

### 3. API Integration
- Session token management
- Automatic token injection in headers
- Error handling
- Loading states

### 4. Routing
- React Router for page navigation
- URL-based routing
- Sidebar navigation

## Development Workflow

### Adding a New Page
1. Create component in `src/pages/YourPage.jsx`
2. Add route in `src/components/MainContent.jsx`
3. Add navigation item in `src/components/Sidebar.jsx`

### Adding a New Component
1. Create component in `src/components/YourComponent.jsx`
2. Import and use in parent component

### Using API
```jsx
import { useApi } from '../hooks/useApi'

function MyComponent() {
  const { api } = useApi()

  const loadData = async () => {
    const data = await api('/endpoint')
    // Handle data
  }
}
```

### Using Theme
```jsx
import { useTheme } from '../context/ThemeContext'

function MyComponent() {
  const { theme, updateTheme, accentColor, updateAccentColor } = useTheme()
  
  return (
    <button onClick={() => updateTheme('dark')}>
      Switch to Dark
    </button>
  )
}
```

### Using App Context
```jsx
import { useApp } from '../context/AppContext'

function MyComponent() {
  const { currentUser, activeChain, login, logout } = useApp()
  
  return (
    <div>
      {currentUser ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login(user, token, chain)}>Login</button>
      )}
    </div>
  )
}
```

## Building for Production

```bash
npm run build
```

Output will be in `dist/` folder. Deploy this folder to your hosting.

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Kill process on port 3456
lsof -ti:3456 | xargs kill -9
```

### Module Not Found
- Check import paths are correct
- Make sure file extensions are included (.jsx, .js)
- Verify file exists in the specified location

### CSS Not Loading
- Make sure `styles.css` is imported in `src/main.jsx`
- Check CSS file path is correct

### RainbowKit Not Showing
- Verify WalletConnect Project ID is set in `.env`
- Check browser console for errors
- Make sure wallet extensions are installed

### API Calls Failing
- Check backend is running on port 3456
- Verify API endpoint exists
- Check session token is valid
- Look at browser Network tab for details

## Performance Tips

1. **Code Splitting**: Use React.lazy() for large components
2. **Memoization**: Use React.memo() for expensive components
3. **Image Optimization**: Use optimized images
4. **Bundle Analysis**: Run `npm run build` and check bundle size

## Security Notes

1. Never commit `.env` file with real credentials
2. Use `.env.example` for template
3. Session tokens are stored in localStorage (consider using httpOnly cookies for production)
4. Always validate user input on backend

## Next Steps

1. Migrate remaining vanilla JS logic to React components
2. Add more pages (collection detail, raffle detail, etc.)
3. Implement real-time updates with WebSocket
4. Add animations with Framer Motion
5. Setup error boundaries and error handling
6. Add unit tests with Vitest
7. Setup CI/CD pipeline

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [RainbowKit Documentation](https://www.rainbowkit.com)
- [Wagmi Documentation](https://wagmi.sh)
- [React Router Documentation](https://reactrouter.com)
- [TanStack Query Documentation](https://tanstack.com/query)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the React/Vite documentation
3. Check browser console for errors
4. Look at network requests in DevTools
