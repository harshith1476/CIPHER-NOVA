@echo off
echo 🚀 Deploying AI-Powered Retailer Recommendation System
echo ================================================

echo.
echo 📦 Step 1: Installing Netlify CLI...
npm install -g netlify-cli

echo.
echo 🏗️ Step 2: Building frontend...
cd frontend
call npm install
call npm run build
cd ..

echo.
echo 📋 Step 3: Ready for deployment!
echo Run the following commands:
echo.
echo   netlify login
echo   netlify deploy --dir=frontend/build --functions=netlify/functions
echo   netlify deploy --prod --dir=frontend/build --functions=netlify/functions
echo.
echo 🌟 Your site will be deployed to Netlify!
echo Don't forget to set environment variables in Netlify dashboard.

pause
