const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
    try {
        const { year, month, period } = req.query;

        let query = { user: req.user._id };

        // Filter by period if provided
        if (period) {
            query.period = period;
        }

        // Filter by year if provided
        if (year) {
            query.year = parseInt(year);
        }

        // Filter by month if provided
        if (month) {
            query.month = parseInt(month);
        }

        const budgets = await Budget.find(query).sort({ category: 1 });

        res.json({
            success: true,
            data: budgets,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// @desc    Get a single budget
// @route   GET /api/budgets/:id
// @access  Private
const getBudgetById = async (req, res) => {
    try {
        const budget = await Budget.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found",
            });
        }

        res.json({
            success: true,
            data: budget,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// @desc    Create a budget
// @route   POST /api/budgets
// @access  Private
const createBudget = async (req, res) => {
    try {
        const { category, amount, period, month, year } = req.body;

        // Validate monthly budget has month
        if (period === "monthly" && !month) {
            return res.status(400).json({
                success: false,
                message: "Month is required for monthly budgets",
            });
        }

        // Check if budget already exists
        const existingBudget = await Budget.findOne({
            user: req.user._id,
            category,
            period,
            ...(period === "monthly" && { month }),
            year,
        });

        if (existingBudget) {
            return res.status(400).json({
                success: false,
                message: "Budget for this category and period already exists",
            });
        }

        const budget = new Budget({
            user: req.user._id,
            category,
            amount: parseFloat(amount),
            period,
            ...(period === "monthly" && { month }),
            year,
        });

        const savedBudget = await budget.save();

        res.status(201).json({
            success: true,
            message: "Budget created successfully",
            data: savedBudget,
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

// @desc    Update a budget
// @route   PATCH /api/budgets/:id
// @access  Private
const updateBudget = async (req, res) => {
    try {
        const { amount, active } = req.body;

        const updateData = {};
        if (amount !== undefined) updateData.amount = parseFloat(amount);
        if (active !== undefined) updateData.active = active;

        const budget = await Budget.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found",
            });
        }

        res.json({
            success: true,
            message: "Budget updated successfully",
            data: budget,
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

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found",
            });
        }

        res.json({
            success: true,
            message: "Budget deleted successfully",
            data: budget,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// @desc    Get budget comparison with actual spending
// @route   GET /api/budgets/comparison
// @access  Private
const getBudgetComparison = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required for budget comparison",
            });
        }

        const { year, month } = req.query;

        // Default to current year and month if not provided
        const currentDate = new Date();
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();
        const targetMonth = month
            ? parseInt(month)
            : currentDate.getMonth() + 1;

        // Get monthly budgets
        const monthlyBudgets = await Budget.find({
            user: req.user._id,
            period: "monthly",
            month: targetMonth,
            year: targetYear,
            active: true,
        });

        // Get yearly budgets (will be prorated for the month)
        const yearlyBudgets = await Budget.find({
            user: req.user._id,
            period: "yearly",
            year: targetYear,
            active: true,
        });

        // Combine budgets (prorating yearly budgets)
        const budgetsByCategory = {};

        // Process monthly budgets
        monthlyBudgets.forEach((budget) => {
            budgetsByCategory[budget.category] = {
                budgetAmount: budget.amount,
                actualAmount: 0,
                percentage: 0,
                remaining: budget.amount,
            };
        });

        // Process yearly budgets (prorate by dividing by 12)
        yearlyBudgets.forEach((budget) => {
            const monthlyAmount = budget.amount / 12;

            if (budgetsByCategory[budget.category]) {
                // If category already exists from monthly budget, use the higher value
                if (
                    monthlyAmount >
                    budgetsByCategory[budget.category].budgetAmount
                ) {
                    budgetsByCategory[budget.category].budgetAmount =
                        monthlyAmount;
                    budgetsByCategory[budget.category].remaining =
                        monthlyAmount;
                }
            } else {
                budgetsByCategory[budget.category] = {
                    budgetAmount: monthlyAmount,
                    actualAmount: 0,
                    percentage: 0,
                    remaining: monthlyAmount,
                };
            }
        });

        // Get actual spending for the month
        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0); // Last day of month

        const expenses = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: "$category",
                    actualAmount: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
        ]);

        // Update actual spending in the budgets object
        expenses.forEach((expense) => {
            const category = expense._id;

            if (budgetsByCategory[category]) {
                budgetsByCategory[category].actualAmount = expense.actualAmount;
                budgetsByCategory[category].percentage = Math.min(
                    100,
                    (expense.actualAmount /
                        budgetsByCategory[category].budgetAmount) *
                        100
                );
                budgetsByCategory[category].remaining = Math.max(
                    0,
                    budgetsByCategory[category].budgetAmount -
                        expense.actualAmount
                );
            } else {
                // Expenses without a budget
                budgetsByCategory[category] = {
                    budgetAmount: 0,
                    actualAmount: expense.actualAmount,
                    percentage: 100, // 100% over budget
                    remaining: 0,
                };
            }
        });

        // Convert to array and add category
        const comparisonData = Object.entries(budgetsByCategory).map(
            ([category, data]) => ({
                category,
                ...data,
            })
        );

        // Calculate totals
        const totals = {
            budgetAmount: comparisonData.reduce(
                (sum, item) => sum + item.budgetAmount,
                0
            ),
            actualAmount: comparisonData.reduce(
                (sum, item) => sum + item.actualAmount,
                0
            ),
            remaining: comparisonData.reduce(
                (sum, item) => sum + item.remaining,
                0
            ),
        };

        totals.percentage =
            totals.budgetAmount > 0
                ? Math.min(
                      100,
                      (totals.actualAmount / totals.budgetAmount) * 100
                  )
                : 0;

        res.json({
            success: true,
            data: {
                comparison: comparisonData,
                totals,
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
    getBudgets,
    getBudgetById,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetComparison,
};
