# 🚀 Manual Deployment Instructions

Since the automated deployment encountered an error, here's how to deploy manually:

## 📋 Prerequisites
- Node.js installed
- Git repository (optional but recommended)

## 🛠️ Method 1: Using Netlify CLI (Recommended)

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Build the Frontend
```bash
cd frontend
npm install
npm run build
cd ..
```

### Step 3: Deploy to Netlify
```bash
# Login to Netlify
netlify login

# Deploy preview first
netlify deploy --dir=frontend/build --functions=netlify/functions

# Deploy to production
netlify deploy --prod --dir=frontend/build --functions=netlify/functions
```

## 🛠️ Method 2: Using Netlify Web Interface

### Step 1: Build Frontend Locally
```bash
cd frontend
npm install
npm run build
```

### Step 2: Deploy via Web Interface
1. Go to [Netlify](https://app.netlify.com)
2. Drag and drop the `frontend/build` folder
3. Configure functions manually in settings

## 🛠️ Method 3: GitHub Integration (Best for Long-term)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - AI Retail Recommendation System"
git remote add origin https://github.com/yourusername/retailer-recommendation-system.git
git push -u origin main
```

### Step 2: Connect to Netlify
1. Go to [Netlify](https://app.netlify.com)
2. Click "New site from Git"
3. Choose GitHub and select your repository
4. Build settings are auto-detected from `netlify.toml`

## ⚙️ Environment Variables Setup

After deployment, set these in Netlify Dashboard → Site Settings → Environment Variables:

```bash
# AI Services
GEMINI_API_KEY=AIzaSyA2PFm7KH_RDvlHEbiaYNu90HyDp_sWBN8
OPENAI_API_KEY=your-openai-key (optional)

# Database (Use MongoDB Atlas for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/retailer_recommendations

# Security
SECRET_KEY=your-production-secret-key-here
CORS_ORIGINS=https://your-site-name.netlify.app

# Optional
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
API_RATE_LIMIT=1000 per hour
LOG_LEVEL=INFO
NODE_ENV=production
```

## 🎯 Quick Deploy Script

I've created a `deploy.bat` file for Windows. Just double-click it to:
1. Install Netlify CLI
2. Build the frontend
3. Get deployment instructions

## ✅ Verification Steps

After deployment, test these URLs:
- `https://your-site.netlify.app` - Main site
- `https://your-site.netlify.app/.netlify/functions/api/health` - API health
- `https://your-site.netlify.app/.netlify/functions/api/products` - Products API

## 🔧 Troubleshooting

### Build Errors:
- Ensure Node.js version 16+ is installed
- Run `npm install` in frontend directory
- Check for TypeScript errors

### Function Errors:
- Verify `netlify/functions/package.json` exists
- Check environment variables are set
- Review function logs in Netlify dashboard

### API Errors:
- Confirm CORS_ORIGINS matches your site URL
- Verify environment variables are set correctly
- Check MongoDB connection string

## 🌟 Your Deployed Features

Once deployed, your site will have:
- ✅ Beautiful animated background with particles
- ✅ AI-powered product recommendations  
- ✅ Interactive Features modal (✨ Features button)
- ✅ Smart shopping cart with Indian Rupee pricing
- ✅ AI chatbot assistant
- ✅ Real-time analytics dashboard
- ✅ Location-based services
- ✅ Professional header and footer
- ✅ Mobile responsive design
- ✅ Serverless backend API

## 🎉 Success!

Your AI-powered retailer recommendation system is now live on the web! 

Share your deployed URL and showcase all the amazing features you've built! 🚀
