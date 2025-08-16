const { body, validationResult } = require("express-validator");

// Validation rules for expenses
const validateExpense = [
    body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters long")
        .trim(),

    body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .isNumeric()
        .withMessage("Amount must be a number")
        .isFloat({ min: 0.01 })
        .withMessage("Amount must be greater than 0"),

    body("category")
        .notEmpty()
        .withMessage("Category is required")
        .isIn([
            "Food",
            "Transport",
            "Shopping",
            "Entertainment",
            "Healthcare",
            "Bills",
            "Others",
        ])
        .withMessage("Invalid category"),

    body("date")
        .notEmpty()
        .withMessage("Date is required")
        .isISO8601()
        .withMessage("Date must be a valid date"),
];

// Validation rules for user registration
const validateUserRegistration = [
    body("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters")
        .trim(),

    body("email")
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

// Validation rules for user login
const validateUserLogin = [
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("password").notEmpty().withMessage("Password is required"),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array(),
        });
    }

    next();
};

module.exports = {
    validateExpense,
    validateUserRegistration,
    validateUserLogin,
    handleValidationErrors,
};
