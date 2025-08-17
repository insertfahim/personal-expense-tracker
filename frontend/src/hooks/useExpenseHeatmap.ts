"use client";

import { useState, useEffect, useCallback } from "react";
import { HeatmapData, ApiResponse } from "@/types";
import { expenseAPI } from "@/lib/api";

interface UseExpenseHeatmapOptions {
    year?: number;
    month?: number | null;
    autoFetch?: boolean;
}

interface UseExpenseHeatmapReturn {
    heatmapData: HeatmapData | null;
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

export const useExpenseHeatmap = (
    options: UseExpenseHeatmapOptions = {}
): UseExpenseHeatmapReturn => {
    const {
        year = new Date().getFullYear(),
        month = null,
        autoFetch = true,
    } = options;

    const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHeatmap = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const params = {
                year,
                ...(month !== null && { month }),
            };

            const response: ApiResponse<HeatmapData> =
                await expenseAPI.getHeatmap(params);

            if (response.success && response.data) {
                setHeatmapData(response.data);
            } else {
                setError(response.message || "Failed to fetch heatmap data");
            }
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch heatmap data";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [year, month]);

    useEffect(() => {
        if (autoFetch) {
            fetchHeatmap();
        }
    }, [fetchHeatmap, autoFetch]);

    return {
        heatmapData,
        isLoading,
        error,
        refresh: fetchHeatmap,
    };
};
