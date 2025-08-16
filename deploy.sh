#!/bin/bash

# Personal Expense Tracker Deployment Script

echo "🚀 Starting deployment process..."

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running (for local development)
if ! pgrep -x "mongod" > /dev/null
then
    echo "⚠️  MongoDB is not running. Please start MongoDB or use MongoDB Atlas."
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "🔧 Setting up backend environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Please update the .env file with your configuration"
fi

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "🔧 Setting up frontend environment..."
if [ ! -f .env.local ]; then
    cp .env.local.example .env.local
    echo "⚠️  Please update the .env.local file with your configuration"
fi

echo "🏗️  Building frontend for production..."
npm run build

echo "✅ Deployment setup complete!"
echo ""
echo "🏃‍♂️ To start the application:"
echo "1. Backend: cd backend && npm start"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "🔗 Application URLs:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:5000"
