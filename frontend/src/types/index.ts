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

// Budget types
export interface Budget {
    _id: string;
    user?: string;
    category: ExpenseCategory;
    amount: number;
    period: BudgetPeriod;
    month?: number;
    year: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export type BudgetPeriod = "monthly" | "yearly";

export interface BudgetFormData {
    category: ExpenseCategory;
    amount: number;
    period: BudgetPeriod;
    month?: number;
    year: number;
    active?: boolean;
}

export interface BudgetComparisonItem {
    category: ExpenseCategory;
    budgetAmount: number;
    actualAmount: number;
    percentage: number;
    remaining: number;
}

// Savings goal types
export type SavingsGoalCategory =
    | "Emergency"
    | "Vacation"
    | "Education"
    | "Home"
    | "Vehicle"
    | "Retirement"
    | "Investment"
    | "Debt"
    | "Others";

export interface SavingsGoalContribution {
    _id: string;
    amount: number;
    date: string;
    note?: string;
}

export interface SavingsGoal {
    _id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    startDate: string;
    targetDate: string;
    category: SavingsGoalCategory;
    description?: string;
    color: string;
    isCompleted: boolean;
    isActive: boolean;
    contributions: SavingsGoalContribution[];
    progress: number;
    remainingAmount: number;
    daysRemaining: number;
    dailySavingsNeeded: number;
    createdAt: string;
    updatedAt: string;
}

export interface SavingsGoalFormData {
    title: string;
    targetAmount: number;
    currentAmount?: number;
    startDate?: string;
    targetDate: string;
    category: SavingsGoalCategory;
    description?: string;
    color?: string;
}

export interface ContributionFormData {
    amount: number;
    date?: string;
    note?: string;
}

export interface SavingsGoalsSummary {
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    totalSaved: number;
    totalTarget: number;
    overallProgress: number;
    upcomingGoals: SavingsGoal[];
    nearCompletionGoals: SavingsGoal[];
}

// Heatmap types
export interface HeatmapItem {
    date: string;
    value: number;
    count: number;
}

export interface WeekdayStat {
    dayOfWeek: number;
    name: string;
    total: number;
    count: number;
    average: number;
}

export interface HeatmapData {
    heatmap: HeatmapItem[];
    weekdayStats: WeekdayStat[];
    stats: {
        maxDay: {
            date: string;
            value: number;
        };
        totalSpent: number;
        totalDays: number;
        avgPerDay: number;
    };
    period: {
        year: number;
        month: number | null;
    };
}

// Predictive analytics types
export interface HistoricalData {
    year: number;
    month: number;
    monthIndex: number;
    total: number;
    count: number;
}

export interface ForecastItem {
    year: number;
    month: number;
    monthName: string;
    predicted: number;
}

export interface CategoryForecast {
    category: ExpenseCategory;
    nextMonth: number;
    trend: "increasing" | "decreasing";
    confidence: number;
}

export interface ForecastData {
    historical: HistoricalData[];
    forecast: ForecastItem[];
    categoryForecasts: CategoryForecast[];
    confidence: number;
    trend: "increasing" | "decreasing";
}

export interface BudgetComparison {
    comparison: BudgetComparisonItem[];
    totals: {
        budgetAmount: number;
        actualAmount: number;
        percentage: number;
        remaining: number;
    };
    period: {
        year: number;
        month: number;
    };
}
