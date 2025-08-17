"use client";

import { useState, useEffect, useCallback } from "react";
import { Budget, BudgetFormData, BudgetComparison, ApiResponse } from "@/types";
import { budgetAPI } from "@/lib/api";
import toast from "react-hot-toast";

interface UseBudgetsOptions {
    year?: number;
    month?: number;
    period?: string;
    autoFetch?: boolean;
}

interface UseBudgetsReturn {
    budgets: Budget[];
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    createBudget: (data: BudgetFormData) => Promise<boolean>;
    updateBudget: (
        id: string,
        data: Partial<BudgetFormData>
    ) => Promise<boolean>;
    deleteBudget: (id: string) => Promise<boolean>;
}

export const useBudgets = (
    options: UseBudgetsOptions = {}
): UseBudgetsReturn => {
    const { year, month, period, autoFetch = true } = options;

    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBudgets = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const params = {
                ...(year && { year }),
                ...(month && { month }),
                ...(period && { period }),
            };

            const response: ApiResponse<Budget[]> = await budgetAPI.getBudgets(
                params
            );

            if (response.success && response.data) {
                setBudgets(response.data);
            } else {
                setError(response.message || "Failed to fetch budgets");
                toast.error(response.message || "Failed to fetch budgets");
            }
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to fetch budgets";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [year, month, period]);

    const createBudget = async (data: BudgetFormData): Promise<boolean> => {
        try {
            const response = await budgetAPI.createBudget(data);

            if (response.success && response.data) {
                toast.success("Budget created successfully!");
                await fetchBudgets();
                return true;
            } else {
                toast.error(response.message || "Failed to create budget");
                return false;
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to create budget";
            toast.error(errorMessage);
            return false;
        }
    };

    const updateBudget = async (
        id: string,
        data: Partial<BudgetFormData>
    ): Promise<boolean> => {
        try {
            const response = await budgetAPI.updateBudget(id, data);

            if (response.success && response.data) {
                toast.success("Budget updated successfully!");
                await fetchBudgets();
                return true;
            } else {
                toast.error(response.message || "Failed to update budget");
                return false;
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to update budget";
            toast.error(errorMessage);
            return false;
        }
    };

    const deleteBudget = async (id: string): Promise<boolean> => {
        try {
            const response = await budgetAPI.deleteBudget(id);

            if (response.success) {
                toast.success("Budget deleted successfully!");
                await fetchBudgets();
                return true;
            } else {
                toast.error(response.message || "Failed to delete budget");
                return false;
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to delete budget";
            toast.error(errorMessage);
            return false;
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchBudgets();
        }
    }, [fetchBudgets, autoFetch]);

    return {
        budgets,
        isLoading,
        error,
        refresh: fetchBudgets,
        createBudget,
        updateBudget,
        deleteBudget,
    };
};

// Hook for budget comparison
export const useBudgetComparison = (year?: number, month?: number) => {
    const [comparison, setComparison] = useState<BudgetComparison | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchComparison = useCallback(async () => {
        // Don't fetch if year or month is not provided (user not authenticated)
        if (!year || !month) {
            setComparison(null);
            setIsLoading(false);
            setError(null);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const params = {
                ...(year && { year }),
                ...(month && { month }),
            };

            const response: ApiResponse<BudgetComparison> =
                await budgetAPI.getBudgetComparison(params);

            if (response.success && response.data) {
                setComparison(response.data);
            } else {
                setError(
                    response.message || "Failed to fetch budget comparison"
                );
            }
        } catch (err: unknown) {
            console.error("Budget comparison error:", err);
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch budget comparison";
            setError(errorMessage);
            setComparison(null);
        } finally {
            setIsLoading(false);
        }
    }, [year, month]);

    useEffect(() => {
        fetchComparison();
    }, [fetchComparison]);

    return {
        comparison,
        isLoading,
        error,
        refresh: fetchComparison,
    };
};
