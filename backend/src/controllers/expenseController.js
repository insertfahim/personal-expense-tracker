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
        const { startDate, endDate } = req.query;
        let matchQuery = {};

        // Add user filter if authenticated
        if (req.user) {
            matchQuery.user = req.user._id;
        }

        // Add date range filter
        if (startDate || endDate) {
            matchQuery.date = {};
            if (startDate) matchQuery.date.$gte = new Date(startDate);
            if (endDate) matchQuery.date.$lte = new Date(endDate);
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

        // Get monthly statistics (using date range if provided)
        let monthlyMatchQuery = { ...matchQuery };

        // If no date range is specified, default to current year
        if (!startDate && !endDate) {
            const currentYear = new Date().getFullYear();
            monthlyMatchQuery.date = {
                $gte: new Date(`${currentYear}-01-01`),
                $lte: new Date(`${currentYear}-12-31`),
            };
        }

        const monthlyStats = await Expense.aggregate([
            {
                $match: monthlyMatchQuery,
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

// @desc    Get expense heatmap data
// @route   GET /api/expenses/heatmap
// @access  Public (or Private if auth is enabled)
const getExpenseHeatmap = async (req, res) => {
    try {
        const { year, month } = req.query;

        // Default to current year and month if not provided
        const currentDate = new Date();
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();
        const targetMonth = month ? parseInt(month) : null;

        let matchQuery = {};

        // Add user filter if authenticated
        if (req.user) {
            matchQuery.user = req.user._id;
        }

        // Add date range filter
        if (targetMonth) {
            // For specific month
            const startDate = new Date(targetYear, targetMonth - 1, 1);
            const endDate = new Date(targetYear, targetMonth, 0); // Last day of month
            matchQuery.date = {
                $gte: startDate,
                $lte: endDate,
            };
        } else {
            // For entire year
            const startDate = new Date(targetYear, 0, 1);
            const endDate = new Date(targetYear, 11, 31);
            matchQuery.date = {
                $gte: startDate,
                $lte: endDate,
            };
        }

        // Get daily expense data
        const dailyData = await Expense.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        day: { $dayOfMonth: "$date" },
                    },
                    total: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        ]);

        // Transform data for heatmap
        const heatmapData = dailyData.map((item) => ({
            date: `${item._id.year}-${String(item._id.month).padStart(
                2,
                "0"
            )}-${String(item._id.day).padStart(2, "0")}`,
            value: item.total,
            count: item.count,
        }));

        // Get weekday distribution
        const weekdayData = await Expense.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: { $dayOfWeek: "$date" }, // 1 for Sunday, 2 for Monday, ..., 7 for Saturday
                    total: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Transform weekday data
        const weekdays = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        const weekdayStats = weekdayData.map((item) => ({
            dayOfWeek: item._id,
            name: weekdays[item._id - 1],
            total: item.total,
            count: item.count,
            average: item.total / item.count,
        }));

        // Calculate statistics
        let maxDay = { date: null, value: 0 };
        let totalSpent = 0;
        let totalDays = 0;

        heatmapData.forEach((day) => {
            if (day.value > maxDay.value) {
                maxDay = { date: day.date, value: day.value };
            }
            totalSpent += day.value;
            totalDays++;
        });

        const avgPerDay = totalDays > 0 ? totalSpent / totalDays : 0;

        res.json({
            success: true,
            data: {
                heatmap: heatmapData,
                weekdayStats,
                stats: {
                    maxDay,
                    totalSpent,
                    totalDays,
                    avgPerDay,
                },
                period: {
                    year: targetYear,
                    month: targetMonth,
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
    getExpenseHeatmap,
};
