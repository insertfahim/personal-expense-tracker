require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { generalLimiter } = require("./middleware/rateLimiter");

const app = express();

// Security middleware
app.use(helmet());
app.use(generalLimiter);

// Middleware
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/expenses", require("./routes/expenses"));
app.use("/api/auth", require("./routes/auth"));

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
app.use(require("./middleware/errorHandler"));

// Database connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
        console.log(`📊 API Health Check: http://localhost:${PORT}/api/health`);
    });
};

startServer();
