import * as yup from "yup";

export const expenseSchema = yup.object({
    title: yup
        .string()
        .required("Title is required")
        .min(3, "Title must be at least 3 characters long")
        .max(100, "Title cannot exceed 100 characters"),
    amount: yup
        .number()
        .required("Amount is required")
        .positive("Amount must be greater than 0")
        .max(1000000, "Amount cannot exceed $1,000,000"),
    category: yup
        .string()
        .required("Category is required")
        .oneOf(
            [
                "Food",
                "Transport",
                "Shopping",
                "Entertainment",
                "Healthcare",
                "Bills",
                "Others",
            ],
            "Invalid category"
        ),
    date: yup
        .string()
        .required("Date is required")
        .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export const loginSchema = yup.object({
    email: yup
        .string()
        .required("Email is required")
        .email("Please enter a valid email address"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters long"),
});

export const registerSchema = yup.object({
    username: yup
        .string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters long")
        .max(30, "Username cannot exceed 30 characters")
        .matches(
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers, and underscores"
        ),
    email: yup
        .string()
        .required("Email is required")
        .email("Please enter a valid email address"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters long")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
});

export type ExpenseFormData = yup.InferType<typeof expenseSchema>;
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;
