const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: [
                "Food",
                "Transport",
                "Shopping",
                "Entertainment",
                "Healthcare",
                "Bills",
                "Others",
            ],
        },
        amount: {
            type: Number,
            required: [true, "Budget amount is required"],
            min: [0, "Budget amount must be positive"],
        },
        period: {
            type: String,
            required: [true, "Budget period is required"],
            enum: ["monthly", "yearly"],
            default: "monthly",
        },
        month: {
            type: Number,
            min: 1,
            max: 12,
            validate: {
                validator: function (v) {
                    return this.period !== "monthly" || (v >= 1 && v <= 12);
                },
                message: "Month must be between 1 and 12 for monthly budgets",
            },
        },
        year: {
            type: Number,
            validate: {
                validator: function (v) {
                    return v >= 2000;
                },
                message: "Year must be 2000 or later",
            },
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create compound index for user, category, period, month, and year
BudgetSchema.index(
    {
        user: 1,
        category: 1,
        period: 1,
        month: 1,
        year: 1,
    },
    { unique: true }
);

module.exports = mongoose.model("Budget", BudgetSchema);
