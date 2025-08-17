@echo off
echo ===================================
echo Personal Expense Tracker API Fix
echo ===================================
echo.

echo Step 1: Building frontend...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)
echo ✅ Frontend build successful!

echo.
echo Step 2: Preparing for deployment...
cd ..
echo Current directory: %CD%
echo.

echo Files that were fixed:
echo - api/index.js (Fixed routing for Vercel serverless functions)
echo - frontend/src/app/diagnostics/page.tsx (Fixed API testing)
echo - vercel.json (Cleaned up configuration)
echo.

echo Step 3: What was changed to fix the 404 error:
echo.
echo 🔧 MAIN ISSUE FIXED:
echo   - Changed API routes from "/api/health" to "/health"
echo   - Vercel strips the "/api" prefix when routing to serverless functions
echo   - Added debugging endpoints to help troubleshoot
echo.
echo 🔧 ADDITIONAL IMPROVEMENTS:
echo   - Enhanced CORS handling
echo   - Added request logging
echo   - Better error messages
echo   - New "Test API Root" button for debugging
echo.

echo Step 4: Deploy to Vercel
echo Run this command to deploy:
echo   vercel --prod
echo.

echo Step 5: After deployment, test at:
echo   [your-deployment-url]/diagnostics
echo.
echo The new "Test API Root" button will help debug routing issues.
echo.

echo ===================================
echo Ready to deploy? Press any key to continue with deployment...
echo Or Ctrl+C to cancel and deploy manually
pause > nul

echo.
echo Deploying to Vercel...
vercel --prod

echo.
echo ===================================
echo Deployment complete!
echo ===================================
echo.
echo Next steps:
echo 1. Copy your deployment URL
echo 2. Visit: [deployment-url]/diagnostics  
echo 3. Test the new "Test API Root" button first
echo 4. Then test "Test Health Check"
echo 5. Finally test "Test Login Endpoint"
echo.
echo If you still get 404 errors, check the Vercel function logs
echo in your Vercel dashboard under Functions tab.
echo.
pause
