const Expense = require("../models/Expense");

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Public (or Private if auth is enabled)
const getExpenses = async (req, res) => {
    try {
        const {
            category,
            startDate,
            endDate,
            page = 1,
            limit = 10,
        } = req.query;

        // Build query object
        let query = {};

        // Add user filter if authenticated
        if (req.user) {
            query.user = req.user._id;
        }

        // Add category filter
        if (category && category !== "all") {
            query.category = category;
        }

        // Add date range filter
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get expenses with pagination
        const expenses = await Expense.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate("user", "username email");

        // Get total count for pagination
        const total = await Expense.countDocuments(query);

        // Calculate total expense amount
        const totalAmount = await Expense.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        res.json({
            success: true,
            data: {
                expenses,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                    total,
                    hasNext: skip + expenses.length < total,
                    hasPrev: parseInt(page) > 1,
                },
                totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0,
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

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Public (or Private if auth is enabled)
const getExpenseById = async (req, res) => {
    try {
        let query = { _id: req.params.id };

        // Add user filter if authenticated
        if (req.user) {
            query.user = req.user._id;
        }

        const expense = await Expense.findOne(query).populate(
            "user",
            "username email"
        );

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found",
            });
        }

        res.json({
            success: true,
            data: expense,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Public (or Private if auth is enabled)
const createExpense = async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        const expenseData = {
            title,
            amount: parseFloat(amount),
            category,
            date: new Date(date),
        };

        // Add user if authenticated
        if (req.user) {
            expenseData.user = req.user._id;
        }

        const expense = new Expense(expenseData);
        const savedExpense = await expense.save();

        // Populate user data for response
        await savedExpense.populate("user", "username email");

        res.status(201).json({
            success: true,
            message: "Expense created successfully",
            data: savedExpense,
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

// @desc    Update expense
// @route   PATCH /api/expenses/:id
// @access  Public (or Private if auth is enabled)
const updateExpense = async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        let query = { _id: req.params.id };

        // Add user filter if authenticated
        if (req.user) {
            query.user = req.user._id;
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (amount !== undefined) updateData.amount = parseFloat(amount);
        if (category !== undefined) updateData.category = category;
        if (date !== undefined) updateData.date = new Date(date);

        const expense = await Expense.findOneAndUpdate(query, updateData, {
            new: true,
            runValidators: true,
        }).populate("user", "username email");

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found",
            });
        }

        res.json({
            success: true,
            message: "Expense updated successfully",
            data: expense,
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

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Public (or Private if auth is enabled)
const deleteExpense = async (req, res) => {
    try {
        let query = { _id: req.params.id };

        // Add user filter if authenticated
        if (req.user) {
            query.user = req.user._id;
        }

        const expense = await Expense.findOneAndDelete(query);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found",
            });
        }

        res.json({
            success: true,
            message: "Expense deleted successfully",
            data: expense,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// @desc    Get expense statistics
// @route   GET /api/expenses/stats
// @access  Public (or Private if auth is enabled)
const getExpenseStats = async (req, res) => {
    try {
        let matchQuery = {};

        // Add user filter if authenticated
        if (req.user) {
            matchQuery.user = req.user._id;
        }

        // Get category-wise statistics
        const categoryStats = await Expense.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { total: -1 } },
        ]);

        // Get monthly statistics for current year
        const currentYear = new Date().getFullYear();
        const monthlyStats = await Expense.aggregate([
            {
                $match: {
                    ...matchQuery,
                    date: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lte: new Date(`${currentYear}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: "$date" },
                    total: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Get total statistics
        const totalStats = await Expense.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    totalExpenses: { $sum: 1 },
                    avgAmount: { $avg: "$amount" },
                },
            },
        ]);

        res.json({
            success: true,
            data: {
                categoryStats,
                monthlyStats,
                totalStats: totalStats[0] || {
                    totalAmount: 0,
                    totalExpenses: 0,
                    avgAmount: 0,
                },
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

module.exports = {
    getExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseStats,
};
