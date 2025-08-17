@echo off
echo ===============================================
echo Personal Expense Tracker - Environment Setup
echo ===============================================
echo.

echo 🚨 CRITICAL: Environment Variables Not Set!
echo.
echo Your API is returning 404 because the required environment 
echo variables are not configured on Vercel.
echo.

echo ===== REQUIRED ENVIRONMENT VARIABLES =====
echo.
echo 1. MONGODB_URI
echo    Value: mongodb+srv://admin:admin@mariyaquiz.gd34udu.mongodb.net/personal_expense_tracker?retryWrites=true&w=majority&appName=mariyaquiz
echo.
echo 2. JWT_SECRET  
echo    Value: your-super-secure-jwt-key-change-this-in-production-please-change-this-12345
echo.
echo 3. NODE_ENV
echo    Value: production
echo.

echo ===== HOW TO SET THEM =====
echo.
echo Method 1 - Vercel Dashboard (Recommended):
echo   1. Go to https://vercel.com/dashboard
echo   2. Click your project
echo   3. Go to Settings → Environment Variables  
echo   4. Add each variable above
echo   5. Make sure to select ALL environments (Production, Preview, Development)
echo.
echo Method 2 - Vercel CLI:
echo   vercel env add MONGODB_URI production
echo   vercel env add JWT_SECRET production  
echo   vercel env add NODE_ENV production
echo.

echo ===== WHAT TO DO NEXT =====
echo.
echo 1. Set the environment variables (see above)
echo 2. Come back and run this script again
echo 3. It will deploy your app with the environment variables
echo.

echo Press any key when you have set the environment variables...
pause > nul

echo.
echo Checking if Vercel CLI is available...
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
)

echo.
echo Building frontend...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo Deploying to Vercel...
cd ..
vercel --prod

echo.
echo ===============================================
echo Deployment Complete!
echo ===============================================
echo.
echo Now test your API:
echo 1. Go to [your-deployment-url]/diagnostics
echo 2. Click "Test Health Check"
echo 3. You should see mongodb: "connected" in the response
echo.
echo If you still get 404 or errors:
echo - Check Vercel Dashboard → Functions → View Logs
echo - Verify environment variables are set correctly
echo.
pause
