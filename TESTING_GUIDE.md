# 🧪 TESTING GUIDE - Gitmyart React App

**Last Updated:** May 3, 2026  
**Status:** Ready for Testing

---

## 🚀 QUICK START

### 1. Start the Development Server
```bash
npm run dev
```

**Expected Output:**
```
[0] 🚀 Gitmyart server running on http://localhost:3456
[1] ➜  Local:   http://localhost:5173/
```

### 2. Open the App
- **React App:** http://localhost:5173
- **Backend:** http://localhost:3456

---

## 📋 TESTING CHECKLIST

### Phase 1: UI & Layout
- [ ] App loads without errors
- [ ] Header displays correctly
- [ ] "Connect Wallet" button visible
- [ ] Layout is responsive (test on mobile)
- [ ] Dark theme applied correctly
- [ ] All fonts loaded

### Phase 2: Wallet Connection
- [ ] Click "Connect Wallet" button
- [ ] MetaMask option appears
- [ ] Rabby option appears
- [ ] Keplr option appears
- [ ] Can connect MetaMask wallet
- [ ] Wallet address displays after connection
- [ ] Disconnect works

### Phase 3: NFT Reading
- [ ] After wallet connection, NFTs load
- [ ] NFT images display
- [ ] NFT names show correctly
- [ ] Collection names display
- [ ] Rarity badges show (if available)
- [ ] Grid is responsive
- [ ] Hover effects work

### Phase 4: Balance Display
- [ ] ETH balance displays after connection
- [ ] Balance is formatted correctly (4 decimals)
- [ ] Balance updates on account switch
- [ ] Balance updates on chain switch

### Phase 5: Staking UI
- [ ] "Stake" button visible on NFT cards
- [ ] Click NFT card opens staking panel
- [ ] Staking panel shows NFT preview
- [ ] Staking info displays (HP, rewards, decay)
- [ ] Benefits list shows
- [ ] "Stake NFT" button visible
- [ ] Close button works

### Phase 6: Staking Flow
- [ ] Click "Stake NFT" button
- [ ] Loading state shows
- [ ] Backend receives stake request
- [ ] NFT moves to "Staked" section
- [ ] Staked badge appears on card
- [ ] "Unstake" button appears
- [ ] Click "Unstake" removes from staked list

### Phase 7: Error Handling
- [ ] Disconnect wallet gracefully
- [ ] Reconnect wallet works
- [ ] Switch chains works
- [ ] API errors handled (show error message)
- [ ] Network errors handled

### Phase 8: Performance
- [ ] App loads in < 3 seconds
- [ ] NFT grid renders smoothly
- [ ] No console errors
- [ ] No memory leaks (check DevTools)
- [ ] Responsive on mobile

---

## 🔧 TESTING SCENARIOS

### Scenario 1: First Time User
1. Open http://localhost:5173
2. See "Connect Your Wallet" message
3. Click "Connect Wallet"
4. Select MetaMask
5. Approve connection in MetaMask
6. See wallet address and balance
7. See NFTs load
8. Click NFT to see staking panel
9. Click "Stake NFT"
10. See NFT in staked list

### Scenario 2: Multiple Wallets
1. Connect Wallet A
2. See Wallet A's NFTs
3. Disconnect
4. Connect Wallet B
5. See Wallet B's NFTs
6. Verify different data

### Scenario 3: Chain Switching
1. Connect wallet on Ethereum
2. See Ethereum NFTs
3. Switch to Sepolia in MetaMask
4. App updates to show Sepolia data
5. Switch back to Ethereum
6. App updates back

### Scenario 4: Staking Multiple NFTs
1. Connect wallet
2. Stake NFT #1
3. Stake NFT #2
4. Verify both in staked list
5. Unstake NFT #1
6. Verify only NFT #2 remains staked

### Scenario 5: Error Recovery
1. Disconnect internet
2. Try to load NFTs
3. See error message
4. Reconnect internet
5. Click refresh
6. NFTs load successfully

---

## 🐛 DEBUGGING

### Check Console for Errors
```javascript
// Open DevTools (F12)
// Go to Console tab
// Look for red errors
```

### Check Network Requests
```javascript
// Open DevTools (F12)
// Go to Network tab
// Look for failed requests
// Check response status and body
```

### Check Local Storage
```javascript
// Open DevTools (F12)
// Go to Application > Local Storage
// Look for session_token
// Check expiry time
```

### Common Issues

| Issue | Solution |
|-------|----------|
| "Connect Wallet" button not working | Check if MetaMask is installed |
| NFTs not loading | Check OpenSea API key in `.env` |
| Balance not showing | Check Etherscan API key in `.env` |
| Staking fails | Check backend is running on 3456 |
| CORS errors | Check proxy in vite.config.js |
| Blank page | Check browser console for errors |

---

## 📊 PERFORMANCE TESTING

### Load Time
```bash
# Open DevTools (F12)
# Go to Performance tab
# Click record
# Reload page
# Stop recording
# Check metrics:
# - First Contentful Paint (FCP): < 1s
# - Largest Contentful Paint (LCP): < 2.5s
# - Cumulative Layout Shift (CLS): < 0.1
```

### Bundle Size
```bash
npm run build
# Check dist/ folder size
# Should be < 1 MB total
```

### Memory Usage
```bash
# Open DevTools (F12)
# Go to Memory tab
# Take heap snapshot
# Check for memory leaks
# Disconnect wallet
# Take another snapshot
# Compare sizes
```

---

## 🔐 SECURITY TESTING

- [ ] Session token stored securely
- [ ] No sensitive data in localStorage
- [ ] No API keys exposed in frontend code
- [ ] CORS headers correct
- [ ] No XSS vulnerabilities
- [ ] No CSRF vulnerabilities
- [ ] Wallet connection secure

---

## 📱 MOBILE TESTING

### iPhone
- [ ] App loads on Safari
- [ ] Touch interactions work
- [ ] Layout responsive
- [ ] MetaMask connection works
- [ ] Wallet app opens correctly

### Android
- [ ] App loads on Chrome
- [ ] Touch interactions work
- [ ] Layout responsive
- [ ] MetaMask connection works
- [ ] Wallet app opens correctly

---

## 🎯 ACCEPTANCE CRITERIA

✅ **PASS** if:
1. App loads without errors
2. Wallet connection works
3. NFTs load from OpenSea
4. Balance displays correctly
5. Staking UI works
6. Backend integration works
7. No console errors
8. Responsive on mobile
9. Performance acceptable
10. No security issues

❌ **FAIL** if:
1. App crashes on load
2. Wallet connection fails
3. NFTs don't load
4. Balance doesn't show
5. Staking fails
6. Console has errors
7. Not responsive
8. Performance poor
9. Security issues found

---

## 📝 TEST REPORT TEMPLATE

```markdown
# Test Report - [Date]

## Environment
- Browser: [Chrome/Safari/Firefox]
- OS: [macOS/Windows/Linux]
- Wallet: [MetaMask/Rabby/Keplr]
- Network: [Ethereum/Sepolia]

## Results
- [ ] UI & Layout: PASS/FAIL
- [ ] Wallet Connection: PASS/FAIL
- [ ] NFT Reading: PASS/FAIL
- [ ] Balance Display: PASS/FAIL
- [ ] Staking UI: PASS/FAIL
- [ ] Staking Flow: PASS/FAIL
- [ ] Error Handling: PASS/FAIL
- [ ] Performance: PASS/FAIL

## Issues Found
1. [Issue 1]
2. [Issue 2]

## Notes
[Any additional notes]

## Tester
[Your name]
```

---

## 🚀 NEXT STEPS

After testing:
1. Document any issues found
2. Fix critical bugs
3. Add error handling if needed
4. Optimize performance if needed
5. Proceed to Task 3 (Deployment)

---

## 📞 SUPPORT

If you encounter issues:
1. Check console for errors (F12)
2. Check network requests (F12 > Network)
3. Check `.env` file for API keys
4. Restart dev server: `npm run dev`
5. Clear browser cache: Ctrl+Shift+Delete

---

**Ready to test?** Open http://localhost:5173 and start! 🎉
