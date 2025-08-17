const SavingsGoal = require("../models/SavingsGoal");

// @desc    Get all savings goals
// @route   GET /api/savings-goals
// @access  Private
const getSavingsGoals = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required for savings goals",
            });
        }

        const { active } = req.query;

        let query = { user: req.user._id };

        // Filter by active status if provided
        if (active !== undefined) {
            query.isActive = active === "true";
        }

        const savingsGoals = await SavingsGoal.find(query).sort({
            targetDate: 1,
        });

        res.json({
            success: true,
            data: savingsGoals,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// @desc    Get single savings goal
// @route   GET /api/savings-goals/:id
// @access  Private
const getSavingsGoalById = async (req, res) => {
    try {
        const savingsGoal = await SavingsGoal.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!savingsGoal) {
            return res.status(404).json({
                success: false,
                message: "Savings goal not found",
            });
        }

        res.json({
            success: true,
            data: savingsGoal,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// @desc    Create a savings goal
// @route   POST /api/savings-goals
// @access  Private
const createSavingsGoal = async (req, res) => {
    try {
        const {
            title,
            targetAmount,
            currentAmount,
            startDate,
            targetDate,
            category,
            description,
            color,
        } = req.body;

        const savingsGoal = new SavingsGoal({
            user: req.user._id,
            title,
            targetAmount: parseFloat(targetAmount),
            currentAmount: parseFloat(currentAmount || 0),
            startDate: startDate ? new Date(startDate) : new Date(),
            targetDate: new Date(targetDate),
            category,
            description,
            color,
        });

        // If there's an initial contribution
        if (currentAmount && parseFloat(currentAmount) > 0) {
            savingsGoal.contributions.push({
                amount: parseFloat(currentAmount),
                date: new Date(),
                note: "Initial contribution",
            });
        }

        // Check if goal is already completed
        if (savingsGoal.currentAmount >= savingsGoal.targetAmount) {
            savingsGoal.isCompleted = true;
        }

        const savedSavingsGoal = await savingsGoal.save();

        res.status(201).json({
            success: true,
            message: "Savings goal created successfully",
            data: savedSavingsGoal,
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

// @desc    Update a savings goal
// @route   PATCH /api/savings-goals/:id
// @access  Private
const updateSavingsGoal = async (req, res) => {
    try {
        const {
            title,
            targetAmount,
            targetDate,
            category,
            description,
            color,
            isActive,
        } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (targetAmount !== undefined)
            updateData.targetAmount = parseFloat(targetAmount);
        if (targetDate !== undefined)
            updateData.targetDate = new Date(targetDate);
        if (category !== undefined) updateData.category = category;
        if (description !== undefined) updateData.description = description;
        if (color !== undefined) updateData.color = color;
        if (isActive !== undefined) updateData.isActive = isActive;

        const savingsGoal = await SavingsGoal.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!savingsGoal) {
            return res.status(404).json({
                success: false,
                message: "Savings goal not found",
            });
        }

        // Check if goal is now completed
        if (
            savingsGoal.currentAmount >= savingsGoal.targetAmount &&
            !savingsGoal.isCompleted
        ) {
            savingsGoal.isCompleted = true;
            await savingsGoal.save();
        }

        res.json({
            success: true,
            message: "Savings goal updated successfully",
            data: savingsGoal,
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

// @desc    Delete a savings goal
// @route   DELETE /api/savings-goals/:id
// @access  Private
const deleteSavingsGoal = async (req, res) => {
    try {
        const savingsGoal = await SavingsGoal.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!savingsGoal) {
            return res.status(404).json({
                success: false,
                message: "Savings goal not found",
            });
        }

        res.json({
            success: true,
            message: "Savings goal deleted successfully",
            data: savingsGoal,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// @desc    Add contribution to a savings goal
// @route   POST /api/savings-goals/:id/contributions
// @access  Private
const addContribution = async (req, res) => {
    try {
        const { amount, date, note } = req.body;

        if (!amount || parseFloat(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Contribution amount must be positive",
            });
        }

        const savingsGoal = await SavingsGoal.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!savingsGoal) {
            return res.status(404).json({
                success: false,
                message: "Savings goal not found",
            });
        }

        // Add contribution
        const contribution = {
            amount: parseFloat(amount),
            date: date ? new Date(date) : new Date(),
            note: note || "",
        };

        savingsGoal.contributions.push(contribution);

        // Update current amount
        savingsGoal.currentAmount += contribution.amount;

        // Check if goal is now completed
        if (
            savingsGoal.currentAmount >= savingsGoal.targetAmount &&
            !savingsGoal.isCompleted
        ) {
            savingsGoal.isCompleted = true;
        }

        await savingsGoal.save();

        res.status(201).json({
            success: true,
            message: "Contribution added successfully",
            data: savingsGoal,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// @desc    Remove contribution from a savings goal
// @route   DELETE /api/savings-goals/:id/contributions/:contributionId
// @access  Private
const removeContribution = async (req, res) => {
    try {
        const savingsGoal = await SavingsGoal.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!savingsGoal) {
            return res.status(404).json({
                success: false,
                message: "Savings goal not found",
            });
        }

        // Find contribution
        const contribution = savingsGoal.contributions.id(
            req.params.contributionId
        );

        if (!contribution) {
            return res.status(404).json({
                success: false,
                message: "Contribution not found",
            });
        }

        // Update current amount
        savingsGoal.currentAmount -= contribution.amount;
        if (savingsGoal.currentAmount < 0) savingsGoal.currentAmount = 0;

        // Remove contribution
        contribution.remove();

        // Update completion status
        savingsGoal.isCompleted =
            savingsGoal.currentAmount >= savingsGoal.targetAmount;

        await savingsGoal.save();

        res.json({
            success: true,
            message: "Contribution removed successfully",
            data: savingsGoal,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// @desc    Get savings goals summary
// @route   GET /api/savings-goals/summary
// @access  Private
const getSavingsGoalsSummary = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required for savings goals summary",
            });
        }

        const goals = await SavingsGoal.find({ user: req.user._id });

        // Calculate summary statistics
        const totalGoals = goals.length;
        const activeGoals = goals.filter(
            (goal) => goal.isActive && !goal.isCompleted
        ).length;
        const completedGoals = goals.filter((goal) => goal.isCompleted).length;

        let totalSaved = 0;
        let totalTarget = 0;

        goals.forEach((goal) => {
            totalSaved += goal.currentAmount;
            totalTarget += goal.targetAmount;
        });

        // Calculate overall progress
        const overallProgress =
            totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

        // Get upcoming goals (closest to target date)
        const upcomingGoals = goals
            .filter(
                (goal) =>
                    goal.isActive && !goal.isCompleted && goal.daysRemaining > 0
            )
            .sort((a, b) => a.targetDate - b.targetDate)
            .slice(0, 3);

        // Get goals closest to completion
        const nearCompletionGoals = goals
            .filter(
                (goal) =>
                    goal.isActive && !goal.isCompleted && goal.progress > 0
            )
            .sort((a, b) => b.progress - a.progress)
            .slice(0, 3);

        res.json({
            success: true,
            data: {
                totalGoals,
                activeGoals,
                completedGoals,
                totalSaved,
                totalTarget,
                overallProgress: Math.min(100, overallProgress),
                upcomingGoals,
                nearCompletionGoals,
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
    getSavingsGoals,
    getSavingsGoalById,
    createSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addContribution,
    removeContribution,
    getSavingsGoalsSummary,
};
