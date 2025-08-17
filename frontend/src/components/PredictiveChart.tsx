"use client";

import React from "react";
import { ForecastData } from "@/types";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    Area,
    AreaChart,
} from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface PredictiveChartProps {
    data: ForecastData | null;
    isLoading: boolean;
}

const PredictiveChart: React.FC<PredictiveChartProps> = ({
    data,
    isLoading,
}) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                <p className="text-lg font-medium mb-2">
                    No forecast data available
                </p>
                <p className="text-sm text-center">
                    Add more expenses to generate spending forecasts
                </p>
            </div>
        );
    }

    // Combine historical and forecast data for the chart
    const chartData = [
        ...data.historical.map((item) => ({
            month: `${item.year}-${String(item.month).padStart(2, "0")}`,
            actual: item.total,
            predicted: null,
        })),
        ...data.forecast.map((item) => ({
            month: `${item.year}-${String(item.month).padStart(2, "0")}`,
            actual: null,
            predicted: item.predicted,
        })),
    ];

    // Format confidence level as percentage
    const confidencePercentage = Math.round(data.confidence * 100);

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                    Spending Forecast
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    Predicted spending based on your historical patterns
                </p>
            </div>

            <div className="p-6">
                {/* Trend Indicator */}
                <div className="flex items-center mb-6">
                    <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full ${
                            data.trend === "increasing"
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-600"
                        } mr-4`}
                    >
                        {data.trend === "increasing" ? (
                            <TrendingUp className="h-6 w-6" />
                        ) : (
                            <TrendingDown className="h-6 w-6" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">
                            {data.trend === "increasing"
                                ? "Spending Trend: Increasing"
                                : "Spending Trend: Decreasing"}
                        </h3>
                        <p className="text-sm text-gray-600">
                            Forecast confidence: {confidencePercentage}%
                        </p>
                    </div>
                </div>

                {/* Main Chart */}
                <div className="h-80 mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient
                                    id="colorActual"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#3B82F6"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#3B82F6"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient
                                    id="colorPredicted"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#10B981"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#10B981"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleString("default", {
                                        month: "short",
                                    });
                                }}
                            />
                            <YAxis />
                            <Tooltip
                                formatter={(value: number) => [
                                    `$${value.toFixed(2)}`,
                                    "",
                                ]}
                                labelFormatter={(label) => {
                                    const date = new Date(label);
                                    return date.toLocaleString("default", {
                                        month: "long",
                                        year: "numeric",
                                    });
                                }}
                            />
                            <Legend />
                            <ReferenceLine
                                x={
                                    data.historical[data.historical.length - 1]
                                        ?.month
                                }
                                stroke="#888"
                                strokeDasharray="3 3"
                                label="Now"
                            />
                            <Area
                                type="monotone"
                                dataKey="actual"
                                stroke="#3B82F6"
                                fillOpacity={1}
                                fill="url(#colorActual)"
                                name="Historical"
                                strokeWidth={2}
                                connectNulls
                            />
                            <Area
                                type="monotone"
                                dataKey="predicted"
                                stroke="#10B981"
                                fillOpacity={1}
                                fill="url(#colorPredicted)"
                                name="Forecast"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                connectNulls
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Forecast Table */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Next Month Category Forecast
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Category
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Forecast Amount
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Trend
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Confidence
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.categoryForecasts
                                    .sort((a, b) => b.nextMonth - a.nextMonth)
                                    .map((category, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {category.category}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    $
                                                    {category.nextMonth.toFixed(
                                                        2
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        category.trend ===
                                                        "increasing"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-green-100 text-green-800"
                                                    }`}
                                                >
                                                    {category.trend ===
                                                    "increasing" ? (
                                                        <TrendingUp className="h-3 w-3 mr-1" />
                                                    ) : (
                                                        <TrendingDown className="h-3 w-3 mr-1" />
                                                    )}
                                                    {category.trend ===
                                                    "increasing"
                                                        ? "Increasing"
                                                        : "Decreasing"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {Math.round(
                                                        category.confidence *
                                                            100
                                                    )}
                                                    %
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictiveChart;
