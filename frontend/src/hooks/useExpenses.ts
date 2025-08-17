"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Expense,
    ExpenseFormData,
    ExpenseListResponse,
    ExpenseStats,
    ApiResponse,
} from "@/types";
import { expenseAPI } from "@/lib/api";
import toast from "react-hot-toast";

interface UseExpensesOptions {
    category?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    autoFetch?: boolean;
}

interface UseExpensesReturn {
    expenses: Expense[];
    totalAmount: number;
    pagination: {
        current: number;
        pages: number;
        total: number;
        hasNext: boolean;
        hasPrev: boolean;
    } | null;
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    createExpense: (data: ExpenseFormData) => Promise<boolean>;
    updateExpense: (
        id: string,
        data: Partial<ExpenseFormData>
    ) => Promise<boolean>;
    deleteExpense: (id: string) => Promise<boolean>;
}

export const useExpenses = (
    options: UseExpensesOptions = {}
): UseExpensesReturn => {
    const {
        category,
        startDate,
        endDate,
        page = 1,
        limit = 10,
        autoFetch = true,
    } = options;

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [pagination, setPagination] =
        useState<UseExpensesReturn["pagination"]>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchExpenses = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const params = {
                ...(category && category !== "all" && { category }),
                ...(startDate && { startDate }),
                ...(endDate && { endDate }),
                page,
                limit,
            };

            const response: ApiResponse<ExpenseListResponse> =
                await expenseAPI.getExpenses(params);

            if (response.success && response.data) {
                setExpenses(response.data.expenses);
                setTotalAmount(response.data.totalAmount);
                setPagination(response.data.pagination);
            } else {
                setError(response.message || "Failed to fetch expenses");
                toast.error(response.message || "Failed to fetch expenses");
            }
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to fetch expenses";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [category, startDate, endDate, page, limit]);

    const createExpense = async (data: ExpenseFormData): Promise<boolean> => {
        try {
            const response = await expenseAPI.createExpense(data);

            if (response.success && response.data) {
                toast.success("Expense created successfully!");
                await fetchExpenses();
                return true;
            } else {
                toast.error(response.message || "Failed to create expense");
                return false;
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to create expense";
            toast.error(errorMessage);
            return false;
        }
    };

    const updateExpense = async (
        id: string,
        data: Partial<ExpenseFormData>
    ): Promise<boolean> => {
        try {
            const response = await expenseAPI.updateExpense(id, data);

            if (response.success && response.data) {
                toast.success("Expense updated successfully!");
                await fetchExpenses();
                return true;
            } else {
                toast.error(response.message || "Failed to update expense");
                return false;
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to update expense";
            toast.error(errorMessage);
            return false;
        }
    };

    const deleteExpense = async (id: string): Promise<boolean> => {
        try {
            const response = await expenseAPI.deleteExpense(id);

            if (response.success) {
                toast.success("Expense deleted successfully!");
                await fetchExpenses();
                return true;
            } else {
                toast.error(response.message || "Failed to delete expense");
                return false;
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to delete expense";
            toast.error(errorMessage);
            return false;
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchExpenses();
        }
    }, [fetchExpenses, autoFetch]);

    return {
        expenses,
        totalAmount,
        pagination,
        isLoading,
        error,
        refresh: fetchExpenses,
        createExpense,
        updateExpense,
        deleteExpense,
    };
};

interface UseExpenseStatsOptions {
    startDate?: string;
    endDate?: string;
}

// Hook for expense statistics
export const useExpenseStats = (options: UseExpenseStatsOptions = {}) => {
    const { startDate, endDate } = options;
    const [stats, setStats] = useState<ExpenseStats | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const params = {
                ...(startDate && { startDate }),
                ...(endDate && { endDate }),
            };

            const response: ApiResponse<ExpenseStats> =
                await expenseAPI.getStats(params);

            if (response.success && response.data) {
                setStats(response.data);
            } else {
                setError(response.message || "Failed to fetch statistics");
            }
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch statistics";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        stats,
        isLoading,
        error,
        refresh: fetchStats,
    };
};
