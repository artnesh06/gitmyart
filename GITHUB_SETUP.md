# GitHub Setup & Deployment Guide

## Current Status
✅ React rebuild complete and verified
✅ Both servers running (Backend: 3456, Frontend: 5173)
✅ All commits pushed to local main branch
✅ Ready for GitHub deployment

## Step 1: Create GitHub Repository

### Option A: Using GitHub Web Interface (Recommended)
1. Go to https://github.com/new
2. Fill in the form:
   - **Repository name:** `dropstudio-fun`
   - **Description:** Multi-chain NFT staking and raffle platform
   - **Visibility:** Public (or Private if preferred)
   - **Initialize repository:** Leave unchecked (we already have local commits)
3. Click "Create repository"

### Option B: Using GitHub CLI (if installed)
```bash
gh repo create dropstudio-fun --public --source=. --remote=origin --push
```

## Step 2: Add Remote and Push to GitHub

After creating the repository on GitHub, run these commands:

```bash
# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/dropstudio-fun.git

# Verify the remote was added
git remote -v

# Push the main branch to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Verify on GitHub

1. Go to https://github.com/YOUR_USERNAME/dropstudio-fun
2. Verify all commits are there
3. Check that all files are visible

## Step 4: Deploy to Vercel

### Prerequisites
- Vercel account (you already have one)
- GitHub repository created and pushed

### Deployment Steps

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard

2. **Create New Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Search for "dropstudio-fun"
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** React
   - **Root Directory:** ./ (default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Environment Variables**
   - Add any required environment variables (if needed)
   - For now, you can skip this

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (usually 2-3 minutes)

6. **Get Your Live URL**
   - After deployment, Vercel will provide a URL like:
   - `https://dropstudio-fun.vercel.app`

## Step 5: Configure Backend (Optional)

If you want to deploy the backend separately:

### Option A: Vercel Serverless Functions
- Not ideal for this project (better for stateless APIs)

### Option B: Contabo VPS (Recommended)
1. Purchase a Contabo VPS ($5.99/month for 10 SSD)
2. SSH into the server
3. Clone the repository
4. Install Node.js and dependencies
5. Run `npm start` with a process manager (PM2)
6. Configure domain/DNS

### Option C: Railway, Render, or Fly.io
- Similar setup to Contabo
- Easier deployment process
- Slightly higher cost

## Current Local URLs

While developing locally:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3456
- **Admin Panel:** http://localhost:3456/admin.html

## Git Workflow for Future Updates

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit:**
   ```bash
   git add .
   git commit -m "feat: description of changes"
   ```

3. **Push to GitHub:**
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. **Create Pull Request:**
   - Go to GitHub repository
   - Click "Compare & pull request"
   - Add description
   - Click "Create pull request"

5. **Merge to main:**
   - Review the PR
   - Click "Merge pull request"
   - Delete the branch

6. **Vercel Auto-Deploy:**
   - Vercel automatically deploys when you push to main
   - Check deployment status at https://vercel.com/dashboard

## Troubleshooting

### Build Fails on Vercel
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify environment variables are set

### Frontend Can't Connect to Backend
- Update API base URL in code
- Configure CORS on backend
- Use environment variables for API URL

### Database Issues
- SQLite doesn't work well on serverless
- Consider migrating to PostgreSQL for production
- Or use Contabo VPS for full backend

## Next Steps

1. Create GitHub repository
2. Push code to GitHub
3. Deploy to Vercel
4. Test the live deployment
5. Configure custom domain (optional)
6. Set up backend deployment (optional)

---

**Questions?** Check the deployment logs or contact support.
