const express = require("express");
const router = express.Router();
const {
    getExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseStats,
} = require("../controllers/expenseController");
const {
    validateExpense,
    handleValidationErrors,
} = require("../middleware/validation");
const { optionalAuth } = require("../middleware/auth");

// Apply optional authentication to all routes
// This allows the app to work with or without authentication
router.use(optionalAuth);

// @route   GET /api/expenses/stats
// @desc    Get expense statistics
// @access  Public (or Private if auth is enabled)
router.get("/stats", getExpenseStats);

// @route   GET /api/expenses
// @desc    Get all expenses
// @access  Public (or Private if auth is enabled)
router.get("/", getExpenses);

// @route   GET /api/expenses/:id
// @desc    Get single expense
// @access  Public (or Private if auth is enabled)
router.get("/:id", getExpenseById);

// @route   POST /api/expenses
// @desc    Create new expense
// @access  Public (or Private if auth is enabled)
router.post("/", validateExpense, handleValidationErrors, createExpense);

// @route   PATCH /api/expenses/:id
// @desc    Update expense
// @access  Public (or Private if auth is enabled)
router.patch("/:id", validateExpense, handleValidationErrors, updateExpense);

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
// @access  Public (or Private if auth is enabled)
router.delete("/:id", deleteExpense);

module.exports = router;
