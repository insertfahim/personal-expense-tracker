const rateLimit = require("express-rate-limit");

// Create different rate limiters for different endpoints
const createRateLimiter = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            error: "Too many requests",
            message,
            retryAfter: Math.ceil(windowMs / 1000),
        },
        standardHeaders: true,
        legacyHeaders: false,
        // Skip successful requests
        skipSuccessfulRequests: false,
        // Skip failed requests
        skipFailedRequests: false,
        // Custom key generator for rate limiting by IP
        keyGenerator: (req) => {
            return req.ip;
        },
    });
};

// General API rate limiter - 100 requests per 15 minutes
const generalLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    100, // limit each IP to 100 requests per windowMs
    "Too many requests from this IP, please try again later."
);

// Strict rate limiter for auth endpoints - 5 requests per 15 minutes
const authLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // limit each IP to 5 requests per windowMs
    "Too many authentication attempts, please try again later."
);

// Medium rate limiter for expense operations - 50 requests per 15 minutes
const expenseLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    50, // limit each IP to 50 requests per windowMs
    "Too many expense operations, please try again later."
);

module.exports = {
    generalLimiter,
    authLimiter,
    expenseLimiter,
};
