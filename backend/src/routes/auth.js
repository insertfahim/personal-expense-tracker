const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
} = require("../controllers/authController");
const {
    validateUserRegistration,
    validateUserLogin,
    handleValidationErrors,
} = require("../middleware/validation");
const { authenticateToken } = require("../middleware/auth");

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post(
    "/register",
    validateUserRegistration,
    handleValidationErrors,
    registerUser
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", validateUserLogin, handleValidationErrors, loginUser);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get("/profile", authenticateToken, getUserProfile);

module.exports = router;
