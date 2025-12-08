# Quick Deployment Guide - Render Blueprint

## What You're Seeing

The screen you showed is Render's Blueprint deployment interface. It's looking for a `render.yaml` file in your GitHub repository. **Good news: I've already created it!**

## Files I've Created for Deployment

✅ **render.yaml** - Main deployment configuration for Render
✅ **DEPLOYMENT.md** - Complete deployment guide
✅ **build.sh** - Build script for frontend
✅ **.env.example** - Environment variables template
✅ **Updated requirements.txt** - Added Gunicorn for production
✅ **Updated ImageUpload.jsx** - Uses environment-based API URLs

## Next Steps (Follow These Exactly)

### Step 1: Push to GitHub

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit the deployment files
git commit -m "Add Render deployment configuration"

# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/2dto3d.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. **Go back to that Render screen you showed me**
2. **Click "Retry"** - Render will now find the `render.yaml` file
3. **Review the configuration** - You'll see two services:
   - `2dto3d-backend` (Python/Flask API)
   - `2dto3d-frontend` (React/Vite static site)
4. **Click "Apply"** to start deployment
5. **Wait 5-10 minutes** for deployment to complete

### Step 3: Get Your URLs

After deployment, Render will give you two URLs:
- **Backend**: `https://2dto3d-backend.onrender.com` (or similar)
- **Frontend**: `https://2dto3d-frontend.onrender.com` (or similar)

### Step 4: Update Frontend with Backend URL

Once you have the backend URL:

1. Create a `.env.production` file:
```
VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com
```

2. Push the change:
```powershell
git add .env.production
git commit -m "Add production API URL"
git push
```

Render will automatically redeploy your frontend.

## That's It! 🎉

Your app will be live at: `https://2dto3d-frontend.onrender.com`

## Important Notes

- **Free tier**: Backend spins down after 15 minutes of inactivity
- **First request**: May take 30-60 seconds to wake up
- **Uploads**: Stored on persistent disk (1GB free)
- **No credit card needed** for free tier

## Troubleshooting

### "No render.yaml found"
- Make sure you've pushed all files to GitHub
- Check that `render.yaml` is in the root directory
- Try clicking "Retry" on the Render screen

### Backend Won't Start
- Check Render logs: Dashboard → 2dto3d-backend → Logs
- Verify Python version compatibility

### Frontend Shows API Errors
- Make sure you've set `VITE_API_URL` environment variable
- Check CORS settings in backend
- Verify backend is running

## Need Help?

Check the full deployment guide in `DEPLOYMENT.md` for more detailed instructions and alternative deployment options.
