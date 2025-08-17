"use client";

import { useState, useEffect, useCallback } from "react";
import { ForecastData, ApiResponse } from "@/types";
import { predictiveAPI } from "@/lib/api";

interface UsePredictiveAnalyticsOptions {
    months?: number;
    autoFetch?: boolean;
    enabled?: boolean; // Add enabled option
}

interface UsePredictiveAnalyticsReturn {
    forecast: ForecastData | null;
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

export const usePredictiveAnalytics = (
    options: UsePredictiveAnalyticsOptions = {}
): UsePredictiveAnalyticsReturn => {
    const { months = 3, autoFetch = true, enabled = true } = options;

    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchForecast = useCallback(async () => {
        // Don't fetch if disabled (user not authenticated)
        if (!enabled) {
            setForecast(null);
            setIsLoading(false);
            setError(null);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const params = { months };

            const response: ApiResponse<ForecastData> =
                await predictiveAPI.getForecast(params);

            if (response.success && response.data) {
                setForecast(response.data);
            } else {
                setError(response.message || "Failed to fetch forecast data");
            }
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch forecast data";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [months, enabled]);

    useEffect(() => {
        if (autoFetch) {
            fetchForecast();
        }
    }, [fetchForecast, autoFetch]);

    return {
        forecast,
        isLoading,
        error,
        refresh: fetchForecast,
    };
};
