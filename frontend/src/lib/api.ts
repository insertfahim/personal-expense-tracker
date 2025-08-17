import axios from "axios";

// Simple type for axios response
type ApiAxiosResponse<T = any> = { data: T };
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
    Budget,
    BudgetFormData,
    BudgetComparison,
    ForecastData,
    HeatmapData,
    SavingsGoal,
    SavingsGoalFormData,
    ContributionFormData,
    SavingsGoalsSummary,
} from "@/types";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

console.log("API_BASE_URL:", API_BASE_URL); // Debug log

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
    try {
        if (typeof window !== "undefined" && localStorage) {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
    } catch (error) {
        // Silently handle any localStorage access errors
        console.log("Error accessing localStorage:", error);
    }
    return config;
});

// Handle token expiration
api.interceptors.response.use(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (response: any) => {
        console.log("API Response received:", {
            status: response.status,
            url: response.config.url,
            data: response.data,
        });
        return response;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any) => {
        console.error("API Error:", error); // Debug log

        // Log more detailed error information
        if (error.response) {
            console.error("Error response:", {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers,
            });
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Request setup error:", error.message);
        }

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
        const response = await api.get("/expenses", { params });
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
    getStats: async (params?: {
        startDate?: string;
        endDate?: string;
    }): Promise<ApiResponse<ExpenseStats>> => {
        const response: AxiosResponse<ApiResponse<ExpenseStats>> =
            await api.get("/expenses/stats", { params });
        return response.data;
    },

    // Get expense heatmap data
    getHeatmap: async (params?: {
        year?: number;
        month?: number;
    }): Promise<ApiResponse<HeatmapData>> => {
        const response: AxiosResponse<ApiResponse<HeatmapData>> = await api.get(
            "/expenses/heatmap",
            { params }
        );
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
        console.log("authAPI.login called with:", data);
        console.log("API_BASE_URL:", API_BASE_URL);

        try {
            const response = (await api.post(
                "/auth/login",
                data
            )) as ApiAxiosResponse<ApiResponse<AuthResponse>>;
            console.log("Login API response:", response);
            return response.data;
        } catch (error) {
            console.error("Login API error:", error);
            throw error;
        }
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

// Budget API functions
export const budgetAPI = {
    // Get all budgets
    getBudgets: async (params?: {
        year?: number;
        month?: number;
        period?: string;
    }): Promise<ApiResponse<Budget[]>> => {
        const response: AxiosResponse<ApiResponse<Budget[]>> = await api.get(
            "/budgets",
            { params }
        );
        return response.data;
    },

    // Get single budget by ID
    getBudgetById: async (id: string): Promise<ApiResponse<Budget>> => {
        const response: AxiosResponse<ApiResponse<Budget>> = await api.get(
            `/budgets/${id}`
        );
        return response.data;
    },

    // Create new budget
    createBudget: async (
        data: BudgetFormData
    ): Promise<ApiResponse<Budget>> => {
        const response: AxiosResponse<ApiResponse<Budget>> = await api.post(
            "/budgets",
            data
        );
        return response.data;
    },

    // Update budget
    updateBudget: async (
        id: string,
        data: Partial<BudgetFormData>
    ): Promise<ApiResponse<Budget>> => {
        const response: AxiosResponse<ApiResponse<Budget>> = await api.patch(
            `/budgets/${id}`,
            data
        );
        return response.data;
    },

    // Delete budget
    deleteBudget: async (id: string): Promise<ApiResponse<Budget>> => {
        const response: AxiosResponse<ApiResponse<Budget>> = await api.delete(
            `/budgets/${id}`
        );
        return response.data;
    },

    // Get budget comparison
    getBudgetComparison: async (params?: {
        year?: number;
        month?: number;
    }): Promise<ApiResponse<BudgetComparison>> => {
        const response: AxiosResponse<ApiResponse<BudgetComparison>> =
            await api.get("/budgets/comparison", { params });
        return response.data;
    },
};

// Predictive API functions
export const predictiveAPI = {
    // Get spending forecast
    getForecast: async (params?: {
        months?: number;
    }): Promise<ApiResponse<ForecastData>> => {
        const response: AxiosResponse<ApiResponse<ForecastData>> =
            await api.get("/predictive/forecast", { params });
        return response.data;
    },
};

// Savings Goals API functions
export const savingsGoalsAPI = {
    // Get all savings goals
    getSavingsGoals: async (params?: {
        active?: boolean;
    }): Promise<ApiResponse<SavingsGoal[]>> => {
        const response: AxiosResponse<ApiResponse<SavingsGoal[]>> =
            await api.get("/savings-goals", { params });
        return response.data;
    },

    // Get single savings goal by ID
    getSavingsGoalById: async (
        id: string
    ): Promise<ApiResponse<SavingsGoal>> => {
        const response: AxiosResponse<ApiResponse<SavingsGoal>> = await api.get(
            `/savings-goals/${id}`
        );
        return response.data;
    },

    // Create new savings goal
    createSavingsGoal: async (
        data: SavingsGoalFormData
    ): Promise<ApiResponse<SavingsGoal>> => {
        const response: AxiosResponse<ApiResponse<SavingsGoal>> =
            await api.post("/savings-goals", data);
        return response.data;
    },

    // Update savings goal
    updateSavingsGoal: async (
        id: string,
        data: Partial<SavingsGoalFormData>
    ): Promise<ApiResponse<SavingsGoal>> => {
        const response: AxiosResponse<ApiResponse<SavingsGoal>> =
            await api.patch(`/savings-goals/${id}`, data);
        return response.data;
    },

    // Delete savings goal
    deleteSavingsGoal: async (
        id: string
    ): Promise<ApiResponse<SavingsGoal>> => {
        const response: AxiosResponse<ApiResponse<SavingsGoal>> =
            await api.delete(`/savings-goals/${id}`);
        return response.data;
    },

    // Add contribution to savings goal
    addContribution: async (
        goalId: string,
        data: ContributionFormData
    ): Promise<ApiResponse<SavingsGoal>> => {
        const response: AxiosResponse<ApiResponse<SavingsGoal>> =
            await api.post(`/savings-goals/${goalId}/contributions`, data);
        return response.data;
    },

    // Remove contribution from savings goal
    removeContribution: async (
        goalId: string,
        contributionId: string
    ): Promise<ApiResponse<SavingsGoal>> => {
        const response: AxiosResponse<ApiResponse<SavingsGoal>> =
            await api.delete(
                `/savings-goals/${goalId}/contributions/${contributionId}`
            );
        return response.data;
    },

    // Get savings goals summary
    getSavingsGoalsSummary: async (): Promise<
        ApiResponse<SavingsGoalsSummary>
    > => {
        const response: AxiosResponse<ApiResponse<SavingsGoalsSummary>> =
            await api.get("/savings-goals/summary");
        return response.data;
    },
};

export default api;
