@echo off
:: Personal Expense Tracker Deployment Script for Windows

echo 🚀 Starting deployment process...

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

echo 📦 Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install backend dependencies
    exit /b 1
)

echo 🔧 Setting up backend environment...
if not exist .env (
    copy .env.example .env
    echo ⚠️  Please update the .env file with your configuration
)

echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)

echo 🔧 Setting up frontend environment...
if not exist .env.local (
    copy .env.local.example .env.local
    echo ⚠️  Please update the .env.local file with your configuration
)

echo 🏗️  Building frontend for production...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to build frontend
    exit /b 1
)

echo ✅ Deployment setup complete!
echo.
echo 🏃‍♂️ To start the application:
echo 1. Backend: cd backend ^&^& npm start
echo 2. Frontend: cd frontend ^&^& npm start
echo.
echo 🔗 Application URLs:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:5000

cd ..
