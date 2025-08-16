require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

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
app.use((error, req, res, next) => {
    console.error("Error:", error);

    res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal server error",
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
});

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
