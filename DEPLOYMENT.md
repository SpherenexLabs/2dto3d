# Deployment Guide for 2Dto3D Application

## Prerequisites
- GitHub account
- Render account (free tier)
- Your code pushed to GitHub repository

## Step-by-Step Deployment Instructions

### 1. Push Your Code to GitHub (if not already done)

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit for deployment"

# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/2dto3d.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy on Render

1. **Go to Render Dashboard**: https://dashboard.render.com/

2. **Click "New +"** and select **"Blueprint"**

3. **Connect Your GitHub Repository**:
   - Authorize Render to access your GitHub
   - Select your `2dto3d` repository
   - Branch: `main`

4. **Render will automatically detect the `render.yaml` file** and create:
   - Backend API service (Python/Flask)
   - Frontend service (Static Site)

5. **Set Environment Variables** (if needed):
   - Backend service will automatically use the production settings

6. **Deploy**:
   - Click "Apply"
   - Wait for both services to deploy (5-10 minutes)

### 3. Get Your URLs

After deployment completes, you'll receive two URLs:
- **Frontend URL**: `https://2dto3d-frontend.onrender.com` (or similar)
- **Backend URL**: `https://2dto3d-backend.onrender.com` (or similar)

### 4. Update Frontend to Use Backend URL

After you get the backend URL, update your frontend code:

In `src/App.jsx` or `src/AppEnhanced.jsx`, find the API endpoint and update:

```javascript
// Replace localhost with your backend URL
const API_URL = 'https://2dto3d-backend.onrender.com';
```

Then commit and push the change:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

Render will automatically redeploy your frontend.

## Important Notes

### Free Tier Limitations
- Backend services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Enough for demos and testing

### File Uploads
- Uploaded files are stored on a persistent disk (1GB on free tier)
- Files persist between deployments

### CORS Configuration
- The backend is configured to accept requests from any origin
- For production, you should restrict CORS to your frontend URL only

## Troubleshooting

### Backend Not Starting
- Check the Render logs for errors
- Verify all dependencies in `requirements.txt`
- Ensure Python version is compatible

### Frontend Not Loading
- Check browser console for errors
- Verify the API URL is correct
- Check CORS settings

### 3D Models Not Loading
- Ensure models are in the `public/models` directory
- Check file paths in the code
- Verify model files are pushed to GitHub

## Alternative: Deploy Backend and Frontend Separately

If you prefer more control:

### Backend Only (Render Web Service)
1. New Web Service
2. Connect GitHub repo
3. Root directory: `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `gunicorn app:app`

### Frontend Only (Vercel)
1. Import project to Vercel
2. Framework: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable: `VITE_API_URL=your-backend-url`

## Support

If you encounter issues:
- Check Render logs: Dashboard → Service → Logs
- Check GitHub Actions (if enabled)
- Verify all files are committed and pushed

## Cost
- **Free tier** is sufficient for this application
- No credit card required for free tier
- Backend + Frontend = $0/month on free tier
