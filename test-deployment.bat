@echo off
echo === Vercel Deployment Test ===

REM Check if vercel is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Vercel CLI not found. Installing...
    npm install -g vercel
)

echo 1. Checking project configuration...
type vercel.json | findstr "builds routes env" 

echo.
echo 2. Testing local build...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo 3. Ready to deploy to Vercel...
cd ..
echo Run: vercel --prod
echo.
echo After deployment, test these endpoints:
echo - GET [your-deployment-url]/api/health
echo - POST [your-deployment-url]/api/auth/login
echo.
echo === Manual Testing Instructions ===
echo 1. Deploy with: vercel --prod
echo 2. Copy the deployment URL
echo 3. Open [deployment-url]/diagnostics in browser
echo 4. Test the API endpoints
echo.
pause
