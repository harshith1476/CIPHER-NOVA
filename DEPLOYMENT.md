# 🚀 Deployment Guide - AI-Powered Retailer Recommendation System

## 📋 Overview
This guide covers deploying your complete AI-powered retail recommendation system to Netlify with serverless functions.

## 🏗️ Architecture
- **Frontend**: React + TypeScript (Static Site)
- **Backend**: Serverless Functions (Node.js/Express)
- **Database**: MongoDB Atlas (Cloud)
- **AI Services**: Gemini AI, OpenAI (Optional)
- **Hosting**: Netlify

## 🔧 Pre-Deployment Setup

### 1. Environment Variables
Set these in Netlify Dashboard → Site Settings → Environment Variables:

```bash
# Required for AI Features
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key (optional)

# Database (MongoDB Atlas recommended for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/retailer_recommendations

# Security
SECRET_KEY=your-production-secret-key
CORS_ORIGINS=https://your-site-name.netlify.app

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# API Configuration
API_RATE_LIMIT=1000 per hour
LOG_LEVEL=INFO
NODE_ENV=production
```

### 2. MongoDB Atlas Setup (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for Netlify)
5. Get connection string and update MONGODB_URI

## 🚀 Deployment Steps

### Option 1: Automatic Deployment (Recommended)
1. Push code to GitHub repository
2. Connect GitHub repo to Netlify
3. Netlify will auto-detect build settings from `netlify.toml`
4. Set environment variables in Netlify dashboard
5. Deploy!

### Option 2: Manual Deployment
1. Build frontend locally: `cd frontend && npm run build`
2. Upload build folder to Netlify
3. Configure serverless functions
4. Set environment variables

## 📁 Project Structure
```
retailer-recommendation-system/
├── frontend/                 # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/                  # Original Flask backend (for reference)
├── netlify/
│   └── functions/
│       ├── api.js           # Main serverless API
│       └── package.json     # Function dependencies
├── netlify.toml             # Netlify configuration
├── .env                     # Local environment (not deployed)
├── .env.example            # Environment template
└── .gitignore              # Git ignore rules
```

## 🔒 Security Features
- ✅ API keys secured in environment variables
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Input validation
- ✅ Security headers
- ✅ HTTPS by default

## 🌟 Features Available in Production
- ✅ AI-powered product recommendations
- ✅ Interactive animated background
- ✅ Real-time analytics dashboard
- ✅ Smart shopping cart
- ✅ AI chatbot assistant
- ✅ Location-based services
- ✅ Indian Rupee pricing
- ✅ Mobile responsive design
- ✅ Professional footer & header

## 🔗 API Endpoints
Once deployed, your API will be available at:
- `https://your-site.netlify.app/.netlify/functions/api/health`
- `https://your-site.netlify.app/.netlify/functions/api/products`
- `https://your-site.netlify.app/.netlify/functions/api/recommendations`
- `https://your-site.netlify.app/.netlify/functions/api/auth/login`
- `https://your-site.netlify.app/.netlify/functions/api/chat`
- `https://your-site.netlify.app/.netlify/functions/api/analytics`

## 🐛 Troubleshooting

### Common Issues:
1. **Build Fails**: Check Node.js version (use 18.x)
2. **API Not Working**: Verify environment variables
3. **Database Connection**: Check MongoDB Atlas whitelist
4. **CORS Errors**: Update CORS_ORIGINS environment variable

### Logs:
- Netlify Functions: Site Dashboard → Functions → View logs
- Build Logs: Site Dashboard → Deploys → Build log

## 📊 Performance Optimizations
- ✅ Static asset caching (1 year)
- ✅ Gzip compression
- ✅ CDN distribution
- ✅ Lazy loading
- ✅ Code splitting
- ✅ Image optimization

## 🔄 Updates & Maintenance
1. Push changes to GitHub
2. Netlify auto-deploys from main branch
3. Monitor function usage in dashboard
4. Update environment variables as needed

## 💰 Cost Estimation
- **Netlify**: Free tier (100GB bandwidth, 125k function calls)
- **MongoDB Atlas**: Free tier (512MB storage)
- **Gemini AI**: Pay per API call
- **Total**: $0-10/month for small to medium traffic

## 🎯 Post-Deployment Checklist
- [ ] Test all API endpoints
- [ ] Verify AI chatbot works
- [ ] Check mobile responsiveness
- [ ] Test shopping cart functionality
- [ ] Verify analytics dashboard
- [ ] Test Features modal
- [ ] Check animated background
- [ ] Verify Indian Rupee pricing

## 🌐 Custom Domain (Optional)
1. Purchase domain from registrar
2. Add domain in Netlify: Site Settings → Domain Management
3. Update DNS records
4. SSL certificate auto-generated

Your AI-powered retail recommendation system is now ready for production! 🎉
