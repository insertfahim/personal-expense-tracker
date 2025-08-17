const mongoose = require("mongoose");

const SavingsGoalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Goal title is required"],
            trim: true,
            maxlength: [100, "Goal title cannot be more than 100 characters"],
        },
        targetAmount: {
            type: Number,
            required: [true, "Target amount is required"],
            min: [1, "Target amount must be positive"],
        },
        currentAmount: {
            type: Number,
            default: 0,
            min: [0, "Current amount cannot be negative"],
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        targetDate: {
            type: Date,
            required: [true, "Target date is required"],
            validate: {
                validator: function (value) {
                    return value > this.startDate;
                },
                message: "Target date must be after start date",
            },
        },
        category: {
            type: String,
            enum: [
                "Emergency",
                "Vacation",
                "Education",
                "Home",
                "Vehicle",
                "Retirement",
                "Investment",
                "Debt",
                "Others",
            ],
            default: "Others",
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot be more than 500 characters"],
        },
        color: {
            type: String,
            default: "#3B82F6", // Default blue color
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        contributions: [
            {
                amount: {
                    type: Number,
                    required: true,
                    min: [0.01, "Contribution amount must be positive"],
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
                note: {
                    type: String,
                    trim: true,
                    maxlength: [200, "Note cannot be more than 200 characters"],
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Virtual for progress percentage
SavingsGoalSchema.virtual("progress").get(function () {
    if (this.targetAmount <= 0) return 0;
    const percentage = (this.currentAmount / this.targetAmount) * 100;
    return Math.min(100, Math.max(0, percentage));
});

// Virtual for remaining amount
SavingsGoalSchema.virtual("remainingAmount").get(function () {
    return Math.max(0, this.targetAmount - this.currentAmount);
});

// Virtual for days remaining
SavingsGoalSchema.virtual("daysRemaining").get(function () {
    const now = new Date();
    const targetDate = new Date(this.targetDate);
    const diffTime = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
});

// Virtual for daily savings needed
SavingsGoalSchema.virtual("dailySavingsNeeded").get(function () {
    const daysRemaining = this.daysRemaining;
    if (daysRemaining <= 0) return 0;
    return this.remainingAmount / daysRemaining;
});

// Set toJSON option to include virtuals
SavingsGoalSchema.set("toJSON", { virtuals: true });
SavingsGoalSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("SavingsGoal", SavingsGoalSchema);
