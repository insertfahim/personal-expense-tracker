export interface Expense {
    _id: string;
    title: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    user?: {
        _id: string;
        username: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

export type ExpenseCategory =
    | "Food"
    | "Transport"
    | "Shopping"
    | "Entertainment"
    | "Healthcare"
    | "Bills"
    | "Others";

export interface ExpenseFormData {
    title: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    errors?: Array<{
        field: string;
        message: string;
    }>;
}

export interface ExpenseListResponse {
    expenses: Expense[];
    pagination: {
        current: number;
        pages: number;
        total: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    totalAmount: number;
}

export interface ExpenseStats {
    categoryStats: Array<{
        _id: ExpenseCategory;
        total: number;
        count: number;
    }>;
    monthlyStats: Array<{
        _id: number;
        total: number;
        count: number;
    }>;
    totalStats: {
        totalAmount: number;
        totalExpenses: number;
        avgAmount: number;
    };
}

export interface User {
    _id: string;
    username: string;
    email: string;
    createdAt: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    username: string;
    email: string;
    password: string;
}
