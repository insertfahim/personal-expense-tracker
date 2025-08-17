const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message:
                    existingUser.email === email
                        ? "User with this email already exists"
                        : "Username already taken",
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password,
        });

        const savedUser = await user.save();

        // Generate token
        const token = generateToken(savedUser._id);

        // Remove password from response
        const userResponse = {
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            createdAt: savedUser.createdAt,
        };

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: userResponse,
                token,
            },
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err) => ({
                field: err.path,
                message: err.message,
            }));

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors,
            });
        }

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(`Login attempt for email: ${email}`); // Debug log

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User not found for email: ${email}`); // Debug log
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Remove password from response
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
        };

        res.json({
            success: true,
            message: "Login successful",
            data: {
                user: userResponse,
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const userResponse = {
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            createdAt: req.user.createdAt,
        };

        res.json({
            success: true,
            data: userResponse,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
};
