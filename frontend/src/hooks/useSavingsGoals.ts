"use client";

import { useState, useEffect, useCallback } from "react";
import {
    SavingsGoal,
    SavingsGoalFormData,
    ContributionFormData,
    SavingsGoalsSummary,
    ApiResponse,
} from "@/types";
import { savingsGoalsAPI } from "@/lib/api";
import toast from "react-hot-toast";

interface UseSavingsGoalsOptions {
    active?: boolean;
    autoFetch?: boolean;
    enabled?: boolean; // Add enabled option
}

interface UseSavingsGoalsReturn {
    goals: SavingsGoal[];
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    createGoal: (data: SavingsGoalFormData) => Promise<boolean>;
    updateGoal: (
        id: string,
        data: Partial<SavingsGoalFormData>
    ) => Promise<boolean>;
    deleteGoal: (id: string) => Promise<boolean>;
    addContribution: (
        goalId: string,
        data: ContributionFormData
    ) => Promise<boolean>;
    removeContribution: (
        goalId: string,
        contributionId: string
    ) => Promise<boolean>;
}

export const useSavingsGoals = (
    options: UseSavingsGoalsOptions = {}
): UseSavingsGoalsReturn => {
    const { active, autoFetch = true, enabled = true } = options;

    const [goals, setGoals] = useState<SavingsGoal[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGoals = useCallback(async () => {
        // Don't fetch if disabled (user not authenticated)
        if (!enabled) {
            setGoals([]);
            setIsLoading(false);
            setError(null);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const params = {
                ...(active !== undefined && { active }),
            };

            const response: ApiResponse<SavingsGoal[]> =
                await savingsGoalsAPI.getSavingsGoals(params);

            if (response.success && response.data) {
                setGoals(response.data);
            } else {
                setError(response.message || "Failed to fetch savings goals");
                toast.error(
                    response.message || "Failed to fetch savings goals"
                );
            }
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch savings goals";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [active, enabled]);

    const createGoal = async (data: SavingsGoalFormData): Promise<boolean> => {
        try {
            const response = await savingsGoalsAPI.createSavingsGoal(data);

            if (response.success && response.data) {
                toast.success("Savings goal created successfully!");
                await fetchGoals();
                return true;
            } else {
                toast.error(
                    response.message || "Failed to create savings goal"
                );
                return false;
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to create savings goal";
            toast.error(errorMessage);
            return false;
        }
    };

    const updateGoal = async (
        id: string,
        data: Partial<SavingsGoalFormData>
    ): Promise<boolean> => {
        try {
            const response = await savingsGoalsAPI.updateSavingsGoal(id, data);

            if (response.success && response.data) {
                toast.success("Savings goal updated successfully!");
                await fetchGoals();
                return true;
            } else {
                toast.error(
                    response.message || "Failed to update savings goal"
                );
                return false;
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to update savings goal";
            toast.error(errorMessage);
            return false;
        }
    };

    const deleteGoal = async (id: string): Promise<boolean> => {
        try {
            const response = await savingsGoalsAPI.deleteSavingsGoal(id);

            if (response.success) {
                toast.success("Savings goal deleted successfully!");
                await fetchGoals();
                return true;
            } else {
                toast.error(
                    response.message || "Failed to delete savings goal"
                );
                return false;
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to delete savings goal";
            toast.error(errorMessage);
            return false;
        }
    };

    const addContribution = async (
        goalId: string,
        data: ContributionFormData
    ): Promise<boolean> => {
        try {
            const response = await savingsGoalsAPI.addContribution(
                goalId,
                data
            );

            if (response.success && response.data) {
                toast.success("Contribution added successfully!");
                await fetchGoals();
                return true;
            } else {
                toast.error(response.message || "Failed to add contribution");
                return false;
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to add contribution";
            toast.error(errorMessage);
            return false;
        }
    };

    const removeContribution = async (
        goalId: string,
        contributionId: string
    ): Promise<boolean> => {
        try {
            const response = await savingsGoalsAPI.removeContribution(
                goalId,
                contributionId
            );

            if (response.success && response.data) {
                toast.success("Contribution removed successfully!");
                await fetchGoals();
                return true;
            } else {
                toast.error(
                    response.message || "Failed to remove contribution"
                );
                return false;
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to remove contribution";
            toast.error(errorMessage);
            return false;
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchGoals();
        }
    }, [fetchGoals, autoFetch]);

    return {
        goals,
        isLoading,
        error,
        refresh: fetchGoals,
        createGoal,
        updateGoal,
        deleteGoal,
        addContribution,
        removeContribution,
    };
};

// Hook for savings goals summary
export const useSavingsGoalsSummary = (enabled: boolean = true) => {
    const [summary, setSummary] = useState<SavingsGoalsSummary | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = useCallback(async () => {
        // Don't fetch if disabled (user not authenticated)
        if (!enabled) {
            setSummary(null);
            setIsLoading(false);
            setError(null);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response: ApiResponse<SavingsGoalsSummary> =
                await savingsGoalsAPI.getSavingsGoalsSummary();

            if (response.success && response.data) {
                setSummary(response.data);
            } else {
                setError(
                    response.message || "Failed to fetch savings goals summary"
                );
            }
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch savings goals summary";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [enabled]);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    return {
        summary,
        isLoading,
        error,
        refresh: fetchSummary,
    };
};
