const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            minlength: [3, "Title must be at least 3 characters long"],
            trim: true,
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0.01, "Amount must be greater than 0"],
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
            default: "Others",
        },
        date: {
            type: Date,
            required: [true, "Date is required"],
            default: Date.now,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false, // Made optional for now, will be required if JWT auth is implemented
        },
    },
    {
        timestamps: true,
    }
);

// Index for better query performance
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ category: 1 });

module.exports = mongoose.model("Expense", expenseSchema);
