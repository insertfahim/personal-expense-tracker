# Vercel Environment Variables Setup Guide

## 🚨 IMPORTANT: Your API is failing because environment variables aren't set on Vercel!

### Step 1: Set Environment Variables on Vercel Dashboard

Go to your Vercel dashboard and set these environment variables:

#### Method 1: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click on your "personal-expense-tracker" project
3. Go to "Settings" tab
4. Click "Environment Variables" in the sidebar
5. Add these variables one by one:

**Required Environment Variables:**

| Name          | Value                                                                                                                              | Environment                      |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `MONGODB_URI` | `mongodb+srv://admin:admin@mariyaquiz.gd34udu.mongodb.net/personal_expense_tracker?retryWrites=true&w=majority&appName=mariyaquiz` | Production, Preview, Development |
| `JWT_SECRET`  | `your-super-secure-jwt-key-change-this-in-production-please-change-this-12345`                                                     | Production, Preview, Development |
| `NODE_ENV`    | `production`                                                                                                                       | Production                       |

**Important Notes:**

-   Make sure to check ALL environments (Production, Preview, Development) for each variable
-   The JWT_SECRET should be a long, random string in production
-   Don't include quotes around the values

#### Method 2: Via Vercel CLI (Alternative)

If you prefer using the command line:

```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Login to your account
vercel login

# Set environment variables
vercel env add MONGODB_URI production
# When prompted, enter: mongodb+srv://admin:admin@mariyaquiz.gd34udu.mongodb.net/personal_expense_tracker?retryWrites=true&w=majority&appName=mariyaquiz

vercel env add JWT_SECRET production
# When prompted, enter: your-super-secure-jwt-key-change-this-in-production-please-change-this-12345

vercel env add NODE_ENV production
# When prompted, enter: production
```

### Step 2: Redeploy After Setting Environment Variables

After setting the environment variables, you MUST redeploy:

```bash
vercel --prod
```

### Step 3: Test the API

After redeployment:

1. Go to [your-deployment-url]/diagnostics
2. Test the "Test Health Check" button
3. You should now see a successful response instead of 404

### Step 4: Expected Success Response

After setting environment variables and redeploying, your health check should return:

```json
{
    "success": true,
    "message": "Personal Expense Tracker API is running!",
    "timestamp": "2025-08-17T...",
    "environment": "production",
    "mongodb": "connected",
    "cors": {
        "origin": "https://your-domain.vercel.app",
        "userAgent": "Mozilla/5.0..."
    },
    "vercel": {
        "region": "iad1",
        "url": "your-deployment-url"
    }
}
```

### Troubleshooting

If you still get errors after setting environment variables:

1. **Check Vercel Function Logs:**

    - Go to Vercel Dashboard → Your Project → Functions tab
    - Click on your function to see logs
    - Look for MongoDB connection errors

2. **Verify Environment Variables:**

    - Go to Settings → Environment Variables
    - Make sure all three variables are set for "Production"

3. **Common Issues:**
    - MongoDB URI might have special characters that need URL encoding
    - JWT_SECRET too short (should be at least 32 characters)
    - Environment variables not applied to the right environment

### Security Note

✅ **Good:** Environment variables are now set securely through Vercel Dashboard
❌ **Bad:** Previously they were exposed in vercel.json (now removed)

This is much more secure and follows best practices!
