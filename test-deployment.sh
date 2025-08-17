#!/bin/bash

# Deployment verification script for Vercel
echo "=== Vercel Deployment Test ==="

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "1. Checking project configuration..."
cat vercel.json | grep -E "(builds|routes|env)" -A 2

echo -e "\n2. Testing local build..."
cd frontend
npm run build

echo -e "\n3. Deploying to Vercel..."
cd ..
vercel --prod

echo -e "\n4. Getting deployment URL..."
DEPLOYMENT_URL=$(vercel ls --format plain | head -n 1 | awk '{print $2}')
echo "Deployment URL: $DEPLOYMENT_URL"

echo -e "\n5. Testing API endpoints..."
echo "Testing health check:"
curl -X GET "$DEPLOYMENT_URL/api/health" -H "Content-Type: application/json" || echo "Health check failed"

echo -e "\nTesting login endpoint:"
curl -X POST "$DEPLOYMENT_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrongpassword"}' || echo "Login test failed"

echo -e "\n=== Test Complete ==="
