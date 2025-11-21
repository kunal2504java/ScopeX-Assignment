# Deployment Guide - Render

## Prerequisites

1. **GitHub Account** - Your code must be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com)

## Step 1: Push Code to GitHub

If you haven't already, initialize git and push to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ScopeX Admin Dashboard"

# Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/scopex-admin.git

# Push to GitHub
git push -u origin main
```

## Step 2: Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the `scopex-admin` repository

## Step 3: Configure the Web Service

Fill in the following settings:

### Basic Settings
- **Name**: `scopex-admin` (or your preferred name)
- **Region**: Choose closest to you (e.g., Oregon)
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (or `.` if needed)
- **Runtime**: `Node`

### Build & Deploy Settings
- **Build Command**: 
  ```bash
  bash render-build.sh
  ```

- **Start Command**: 
  ```bash
  npm start
  ```

### Environment Variables

Click **"Advanced"** and add these environment variables:

1. **DATABASE_URL**
   - For SQLite on Render, use:
   ```
   file:/opt/render/project/src/prisma/dev.db
   ```
   - **Note**: Free tier Render doesn't persist files. For production, consider:
     - PostgreSQL (Render provides free PostgreSQL)
     - Or use a persistent disk (paid feature)

2. **JWT_SECRET**
   - Click "Generate" or use a strong secret:
   ```
   your-super-secret-jwt-key-change-this-in-production-12345
   ```

3. **NODE_VERSION** (optional)
   ```
   18.17.0
   ```

## Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Install dependencies
   - Generate Prisma Client
   - Run migrations
   - Seed the database
   - Build Next.js
   - Start the server

3. Wait for deployment (usually 5-10 minutes for first deploy)

## Step 5: Access Your App

Once deployed, Render will provide a URL like:
```
https://scopex-admin.onrender.com
```

### Default Login Credentials

After seeding, you can login with:

- **Admin**:
  - Email: `admin@example.com`
  - Password: `admin123`

- **Manager**:
  - Email: `manager@example.com`
  - Password: `manager123`

- **User**:
  - Email: `user@example.com`
  - Password: `user123`

## Important Notes for SQLite on Render

⚠️ **SQLite Limitation**: Render's free tier doesn't persist file storage. Your database will reset on every deploy or when the service restarts.

### Recommended: Switch to PostgreSQL

For a production deployment, use PostgreSQL:

1. In Render Dashboard, create a **PostgreSQL** database (free tier available)
2. Copy the **Internal Database URL**
3. Update your `DATABASE_URL` environment variable
4. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

5. Redeploy

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify `render-build.sh` has correct permissions

### Database Issues
- For SQLite: Remember it resets on restart
- For PostgreSQL: Check connection string format
- Run migrations manually if needed:
  ```bash
  npx prisma migrate deploy
  ```

### Environment Variables Not Working
- Double-check spelling and values
- Restart the service after changing env vars
- Check logs for specific errors

## Monitoring

- **Logs**: View real-time logs in Render dashboard
- **Metrics**: Monitor CPU, memory usage
- **Auto-Deploy**: Enable to deploy on every git push

## Custom Domain (Optional)

1. Go to your service settings
2. Click **"Custom Domain"**
3. Add your domain and follow DNS instructions

---

## Alternative: Quick Deploy Button

You can also add this to your README for one-click deploy:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

This uses the `render.yaml` file for automatic configuration.
