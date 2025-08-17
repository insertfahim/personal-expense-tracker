// Vercel serverless function entry point
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { generalLimiter } = require("../backend/src/middleware/rateLimiter");

const app = express();

// Security middleware
app.use(helmet());
app.use(generalLimiter);

// CORS configuration for Vercel
app.use(
    cors({
        origin: [
            process.env.FRONTEND_URL,
            "http://localhost:3000",
            "https://expense-tracker-by-fahim.vercel.app",
            "https://*.vercel.app",
            // Allow all vercel preview deployments
            /https:\/\/.*\.vercel\.app$/,
        ].filter(Boolean),
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("=> Using existing database connection");
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
};

// Routes
app.use("/api/auth", require("../backend/src/routes/auth"));
app.use("/api/expenses", require("../backend/src/routes/expenses"));
app.use("/api/budgets", require("../backend/src/routes/budgets"));
app.use("/api/predictive", require("../backend/src/routes/predictive"));
app.use("/api/savings-goals", require("../backend/src/routes/savingsGoals"));

// Health check route
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Personal Expense Tracker API is running!",
        timestamp: new Date().toISOString(),
    });
});

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found",
    });
});

// Global error handler
app.use(require("../backend/src/middleware/errorHandler"));

// Serverless function wrapper
module.exports = async (req, res) => {
    await connectDB();
    return app(req, res);
};
