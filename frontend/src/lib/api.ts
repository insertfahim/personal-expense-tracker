import axios, { AxiosResponse } from "axios";
import {
    ApiResponse,
    Expense,
    ExpenseFormData,
    ExpenseListResponse,
    ExpenseStats,
    AuthResponse,
    LoginFormData,
    RegisterFormData,
    User,
} from "@/types";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token to requests if available
// eslint-disable-next-line @typescript-eslint/no-explicit-any
api.interceptors.request.use((config: any) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle token expiration
api.interceptors.response.use(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (response: any) => response,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any) => {
        console.error("API Error:", error); // Debug log

        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                // Optionally redirect to login
                window.location.href = "/login";
            }
        }

        // Log network errors
        if (error.code === "NETWORK_ERROR" || !error.response) {
            console.error("Network Error:", {
                message: error.message,
                config: {
                    baseURL: error.config?.baseURL,
                    url: error.config?.url,
                    method: error.config?.method,
                },
            });
        }

        return Promise.reject(error);
    }
);

// Expense API functions
export const expenseAPI = {
    // Get all expenses with optional filters
    getExpenses: async (params?: {
        category?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<ExpenseListResponse>> => {
        const response: AxiosResponse<ApiResponse<ExpenseListResponse>> =
            await api.get("/expenses", { params });
        return response.data;
    },

    // Get single expense by ID
    getExpenseById: async (id: string): Promise<ApiResponse<Expense>> => {
        const response: AxiosResponse<ApiResponse<Expense>> = await api.get(
            `/expenses/${id}`
        );
        return response.data;
    },

    // Create new expense
    createExpense: async (
        data: ExpenseFormData
    ): Promise<ApiResponse<Expense>> => {
        const response: AxiosResponse<ApiResponse<Expense>> = await api.post(
            "/expenses",
            data
        );
        return response.data;
    },

    // Update expense
    updateExpense: async (
        id: string,
        data: Partial<ExpenseFormData>
    ): Promise<ApiResponse<Expense>> => {
        const response: AxiosResponse<ApiResponse<Expense>> = await api.patch(
            `/expenses/${id}`,
            data
        );
        return response.data;
    },

    // Delete expense
    deleteExpense: async (id: string): Promise<ApiResponse<Expense>> => {
        const response: AxiosResponse<ApiResponse<Expense>> = await api.delete(
            `/expenses/${id}`
        );
        return response.data;
    },

    // Get expense statistics
    getStats: async (): Promise<ApiResponse<ExpenseStats>> => {
        const response: AxiosResponse<ApiResponse<ExpenseStats>> =
            await api.get("/expenses/stats");
        return response.data;
    },
};

// Auth API functions
export const authAPI = {
    // Register new user
    register: async (
        data: RegisterFormData
    ): Promise<ApiResponse<AuthResponse>> => {
        const response: AxiosResponse<ApiResponse<AuthResponse>> =
            await api.post("/auth/register", data);
        return response.data;
    },

    // Login user
    login: async (data: LoginFormData): Promise<ApiResponse<AuthResponse>> => {
        const response: AxiosResponse<ApiResponse<AuthResponse>> =
            await api.post("/auth/login", data);
        return response.data;
    },

    // Get current user profile
    getProfile: async (): Promise<ApiResponse<User>> => {
        const response: AxiosResponse<ApiResponse<User>> = await api.get(
            "/auth/profile"
        );
        return response.data;
    },
};

// Health check
export const healthCheck = async (): Promise<
    ApiResponse<{ message: string; timestamp: string }>
> => {
    const response: AxiosResponse<
        ApiResponse<{ message: string; timestamp: string }>
    > = await api.get("/health");
    return response.data;
};

export default api;
