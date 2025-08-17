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
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            const allowedOrigins = [
                process.env.FRONTEND_URL,
                "http://localhost:3000",
                "https://expense-tracker-by-fahim.vercel.app",
            ].filter(Boolean);

            // Allow any vercel deployment
            if (origin.includes(".vercel.app")) {
                return callback(null, true);
            }

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                console.log(`CORS blocked origin: ${origin}`);
                callback(null, true); // Allow all origins for now to debug
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        preflightContinue: false,
        optionsSuccessStatus: 200,
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

// Routes - Note: Vercel strips the /api prefix, so routes are relative
app.use("/auth", require("../backend/src/routes/auth"));
app.use("/expenses", require("../backend/src/routes/expenses"));
app.use("/budgets", require("../backend/src/routes/budgets"));
app.use("/predictive", require("../backend/src/routes/predictive"));
app.use("/savings-goals", require("../backend/src/routes/savingsGoals"));

// Health check route with more diagnostic info
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Personal Expense Tracker API is running!",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        mongodb: isConnected ? "connected" : "disconnected",
        cors: {
            origin: req.headers.origin || "no-origin",
            userAgent: req.headers["user-agent"] || "no-user-agent",
        },
        vercel: {
            region: process.env.VERCEL_REGION || "unknown",
            url: process.env.VERCEL_URL || "unknown",
        },
        requestPath: req.path,
        requestUrl: req.url,
    });
});

// Root endpoint for debugging
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API root - try /health for health check",
        availableEndpoints: [
            "/health",
            "/auth/login",
            "/expenses",
            "/budgets",
            "/predictive",
            "/savings-goals",
        ],
        requestInfo: {
            path: req.path,
            url: req.url,
            method: req.method,
        },
    });
});

// 404 handler with debugging info
app.use("*", (req, res) => {
    console.log(
        `404 - Path not found: ${req.path}, URL: ${req.url}, Method: ${req.method}`
    );
    res.status(404).json({
        success: false,
        message: "API endpoint not found",
        debug: {
            path: req.path,
            url: req.url,
            method: req.method,
            headers: req.headers,
            availableEndpoints: [
                "/health",
                "/auth/login",
                "/expenses",
                "/budgets",
                "/predictive",
                "/savings-goals",
            ],
        },
    });
});

// Global error handler
app.use(require("../backend/src/middleware/errorHandler"));

// Serverless function wrapper with better error handling
module.exports = async (req, res) => {
    try {
        console.log(`Incoming request: ${req.method} ${req.url}`);

        // Set CORS headers for all requests
        const origin = req.headers.origin;
        if (
            origin &&
            (origin.includes(".vercel.app") || origin.includes("localhost"))
        ) {
            res.setHeader("Access-Control-Allow-Origin", origin);
        }
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET,POST,PUT,PATCH,DELETE,OPTIONS"
        );
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type,Authorization,X-Requested-With"
        );

        // Handle preflight requests
        if (req.method === "OPTIONS") {
            res.status(200).end();
            return;
        }

        await connectDB();
        return app(req, res);
    } catch (error) {
        console.error("Serverless function error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Something went wrong",
        });
    }
};
