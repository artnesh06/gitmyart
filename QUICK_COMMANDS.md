# Quick Commands Reference

## 🚀 Deployment Commands

### Create GitHub Repository
```bash
# 1. Go to https://github.com/new
# 2. Create repo named: dropstudio-fun
# 3. Then run:

git remote add origin https://github.com/YOUR_USERNAME/dropstudio-fun.git
git branch -M main
git push -u origin main
```

### Deploy to Vercel
```
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Click "Import Git Repository"
4. Search for "dropstudio-fun"
5. Click "Import"
6. Click "Deploy"
7. Wait for deployment
8. Get your live URL
```

---

## 💻 Local Development Commands

### Start Development Servers
```bash
npm run dev
```
- Backend: http://localhost:3456
- Frontend: http://localhost:5173

### Start Backend Only
```bash
npm run server
```
- Backend: http://localhost:3456

### Start Frontend Only
```bash
npm run client
```
- Frontend: http://localhost:5173

### Build for Production
```bash
npm run build
```
- Creates optimized build in `dist/` folder

### Preview Production Build
```bash
npm run preview
```
- Preview the production build locally

### Seed Database
```bash
npm run seed
```
- Populates database with demo data

---

## 📦 Git Commands

### Check Status
```bash
git status
```

### View Recent Commits
```bash
git log --oneline -10
```

### Add All Changes
```bash
git add .
```

### Commit Changes
```bash
git commit -m "your message here"
```

### Push to GitHub
```bash
git push
```

### Create New Branch
```bash
git checkout -b feature/your-feature-name
```

### Switch Branch
```bash
git checkout branch-name
```

### Merge Branch
```bash
git merge branch-name
```

---

## 🔍 Testing Commands

### Run Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Specific Test
```bash
npm test -- test-name
```

---

## 📊 API Commands

### Check Backend Health
```bash
curl http://localhost:3456/api/health
```

### Get Collections
```bash
curl http://localhost:3456/api/collections
```

### Get Raffles
```bash
curl http://localhost:3456/api/raffles
```

### Get Leaderboard
```bash
curl http://localhost:3456/api/leaderboard
```

### Get Stats
```bash
curl http://localhost:3456/api/stats
```

---

## 🗂️ File Management

### List Files
```bash
ls -la
```

### Create Directory
```bash
mkdir directory-name
```

### Remove File
```bash
rm file-name
```

### Remove Directory
```bash
rm -rf directory-name
```

### Copy File
```bash
cp source destination
```

### Move File
```bash
mv source destination
```

---

## 🔧 Troubleshooting Commands

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Kill Process on Port
```bash
# macOS/Linux
lsof -ti:3456 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :3456
taskkill /PID <PID> /F
```

### Check Node Version
```bash
node --version
```

### Check npm Version
```bash
npm --version
```

---

## 📝 Documentation Files

| File | Purpose |
|------|---------|
| `READY_FOR_DEPLOYMENT.md` | Quick deployment guide |
| `DEPLOYMENT_CHECKLIST.md` | Detailed checklist |
| `GITHUB_SETUP.md` | GitHub setup guide |
| `CURRENT_STATUS.md` | Project status |
| `FINAL_SUMMARY.md` | Project summary |
| `QUICK_START.md` | Local setup |
| `TESTING_GUIDE.md` | Testing guide |

---

## 🌐 Important URLs

### Local Development
```
Frontend:  http://localhost:5173
Backend:   http://localhost:3456
Admin:     http://localhost:3456/admin.html
API:       http://localhost:3456/api/
```

### GitHub
```
Repository: https://github.com/YOUR_USERNAME/dropstudio-fun
```

### Vercel
```
Dashboard:  https://vercel.com/dashboard
Live URL:   https://dropstudio-fun.vercel.app (after deployment)
```

---

## 📋 Deployment Checklist

- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Deploy to Vercel
- [ ] Get live URL
- [ ] Test live deployment
- [ ] Verify all pages load
- [ ] Check console for errors
- [ ] Test responsive design

---

## 🎯 Quick Start (22 minutes)

```bash
# 1. Create GitHub repo (5 min)
# Go to https://github.com/new

# 2. Push to GitHub (2 min)
git remote add origin https://github.com/YOUR_USERNAME/dropstudio-fun.git
git push -u origin main

# 3. Deploy to Vercel (10 min)
# Go to https://vercel.com/dashboard
# Import GitHub repository
# Click Deploy

# 4. Verify (5 min)
# Visit your Vercel URL
# Test all features
```

---

## 💡 Pro Tips

### Development
- Use `npm run dev` to start both servers at once
- Check browser console (F12) for errors
- Use React DevTools extension for debugging
- Use Network tab to monitor API calls

### Git
- Commit frequently with clear messages
- Use feature branches for new features
- Create pull requests for code review
- Keep main branch clean

### Deployment
- Always test locally before deploying
- Check Vercel dashboard for deployment logs
- Monitor performance metrics
- Set up error alerts

---

## 🆘 Common Issues

### Port Already in Use
```bash
# Kill process on port 3456
lsof -ti:3456 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Dependencies Not Installed
```bash
npm install
```

### Build Fails
```bash
npm run build
# Check error messages
# Fix issues
# Try again
```

### Git Remote Issues
```bash
# Check current remote
git remote -v

# Remove old remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/dropstudio-fun.git
```

---

## 📞 Support

- **Vercel Support:** https://vercel.com/support
- **GitHub Support:** https://support.github.com
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev

---

**Last Updated:** May 3, 2026  
**Status:** Ready for Deployment ✅
