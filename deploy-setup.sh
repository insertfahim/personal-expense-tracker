#!/bin/bash
echo "Deploying Personal Expense Tracker to Vercel..."

# Install dependencies in api directory
cd api && npm install && cd ..

# Install dependencies in frontend
cd frontend && npm install && cd ..

# Install dependencies in backend (for local development)
cd backend && npm install && cd ..

echo "Dependencies installed. Ready for deployment!"
echo "Run 'vercel --prod' to deploy to production"
