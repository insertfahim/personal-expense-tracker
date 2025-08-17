"use client";

import React from "react";
import { HeatmapData } from "@/types";
import { Calendar, BarChart3, AlertTriangle } from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    Legend,
} from "recharts";

interface ExpenseHeatmapProps {
    data: HeatmapData | null;
    isLoading: boolean;
}

const ExpenseHeatmap: React.FC<ExpenseHeatmapProps> = ({ data, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!data || data.heatmap.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-lg font-medium mb-2">
                    No expense data available
                </p>
                <p className="text-sm text-center">
                    Add some expenses to see your spending patterns
                </p>
            </div>
        );
    }

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Calculate color intensity based on value
    const getColorIntensity = (value: number) => {
        const maxValue = data.stats.maxDay.value;
        const minValue = 0;
        const normalizedValue = Math.min(
            1,
            (value - minValue) / (maxValue - minValue || 1)
        );

        // Generate color from blue (low) to red (high)
        const r = Math.round(normalizedValue * 255);
        const g = Math.round(100 - normalizedValue * 100);
        const b = Math.round(255 - normalizedValue * 255);

        return `rgb(${r}, ${g}, ${b})`;
    };

    // Get month name
    const getMonthName = (month: number | null) => {
        if (!month) return "";
        return new Date(2000, month - 1).toLocaleString("default", {
            month: "long",
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                    Expense Heatmap{" "}
                    {data.period.month
                        ? `- ${getMonthName(data.period.month)}`
                        : ""}{" "}
                    {data.period.year}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    Visualize your spending patterns by day and weekday
                </p>
            </div>

            <div className="p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-sm font-medium text-gray-500">
                            Highest Spending Day
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                            ${data.stats.maxDay.value.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                            {data.stats.maxDay.date
                                ? formatDate(data.stats.maxDay.date)
                                : "N/A"}
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-sm font-medium text-gray-500">
                            Total Spent
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                            ${data.stats.totalSpent.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                            {data.stats.totalDays} days with expenses
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-sm font-medium text-gray-500">
                            Average Per Day
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                            ${data.stats.avgPerDay.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                            Daily average when spending occurred
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-sm font-medium text-gray-500">
                            Most Expensive Day
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                            {data.weekdayStats.length > 0
                                ? data.weekdayStats.sort(
                                      (a, b) => b.average - a.average
                                  )[0].name
                                : "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                            Based on average spending
                        </p>
                    </div>
                </div>

                {/* Calendar Heatmap */}
                <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Daily Spending Calendar
                    </h3>
                    <div className="grid grid-cols-7 gap-2">
                        {/* Day labels */}
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                            (day) => (
                                <div
                                    key={day}
                                    className="text-center text-xs font-medium text-gray-500"
                                >
                                    {day}
                                </div>
                            )
                        )}

                        {/* Generate calendar grid */}
                        {(() => {
                            // Get the first day of the month/year
                            const firstDay = data.period.month
                                ? new Date(
                                      data.period.year,
                                      data.period.month - 1,
                                      1
                                  )
                                : new Date(data.period.year, 0, 1);

                            // Get the last day of the month/year
                            const lastDay = data.period.month
                                ? new Date(
                                      data.period.year,
                                      data.period.month,
                                      0
                                  )
                                : new Date(data.period.year, 11, 31);

                            // Calculate days in period
                            const daysInPeriod =
                                Math.ceil(
                                    (lastDay.getTime() - firstDay.getTime()) /
                                        (1000 * 60 * 60 * 24)
                                ) + 1;

                            // Calculate offset for first day of month
                            const firstDayOffset = firstDay.getDay();

                            // Create a map of date strings to heatmap items for easy lookup
                            const dateMap = new Map();
                            data.heatmap.forEach((item) => {
                                dateMap.set(item.date, item);
                            });

                            // Generate cells
                            const cells = [];

                            // Add empty cells for offset
                            for (let i = 0; i < firstDayOffset; i++) {
                                cells.push(
                                    <div
                                        key={`empty-${i}`}
                                        className="aspect-square bg-gray-100 rounded opacity-30"
                                    ></div>
                                );
                            }

                            // Add day cells
                            for (let i = 0; i < daysInPeriod; i++) {
                                const currentDate = new Date(firstDay);
                                currentDate.setDate(firstDay.getDate() + i);

                                const dateString = `${currentDate.getFullYear()}-${String(
                                    currentDate.getMonth() + 1
                                ).padStart(2, "0")}-${String(
                                    currentDate.getDate()
                                ).padStart(2, "0")}`;
                                const heatmapItem = dateMap.get(dateString);

                                const hasData = !!heatmapItem;
                                const value = hasData ? heatmapItem.value : 0;
                                const count = hasData ? heatmapItem.count : 0;

                                cells.push(
                                    <div
                                        key={dateString}
                                        className={`aspect-square rounded flex flex-col items-center justify-center text-xs ${
                                            hasData
                                                ? "text-white"
                                                : "text-gray-400 bg-gray-100"
                                        }`}
                                        style={{
                                            backgroundColor: hasData
                                                ? getColorIntensity(value)
                                                : undefined,
                                        }}
                                        title={`${currentDate.toLocaleDateString()}: $${value.toFixed(
                                            2
                                        )} (${count} expenses)`}
                                    >
                                        <span className="font-semibold">
                                            {currentDate.getDate()}
                                        </span>
                                        {hasData && (
                                            <span className="text-[0.65rem] opacity-80">
                                                ${value.toFixed(0)}
                                            </span>
                                        )}
                                    </div>
                                );
                            }

                            return cells;
                        })()}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center mt-4">
                        <div className="flex items-center">
                            <div className="text-xs text-gray-500 mr-2">
                                Less
                            </div>
                            <div className="flex">
                                {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity) => (
                                    <div
                                        key={intensity}
                                        className="w-6 h-4"
                                        style={{
                                            backgroundColor: getColorIntensity(
                                                intensity *
                                                    data.stats.maxDay.value
                                            ),
                                        }}
                                    ></div>
                                ))}
                            </div>
                            <div className="text-xs text-gray-500 ml-2">
                                More
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weekday Analysis */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Spending by Day of Week
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data.weekdayStats.sort(
                                    (a, b) => a.dayOfWeek - b.dayOfWeek
                                )}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value: number) => [
                                        `$${value.toFixed(2)}`,
                                        "",
                                    ]}
                                />
                                <Legend />
                                <Bar
                                    name="Total Spent"
                                    dataKey="total"
                                    fill="#3B82F6"
                                >
                                    {data.weekdayStats.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={getColorIntensity(
                                                entry.total
                                            )}
                                        />
                                    ))}
                                </Bar>
                                <Bar
                                    name="Average per Day"
                                    dataKey="average"
                                    fill="#10B981"
                                >
                                    {data.weekdayStats.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`rgba(16, 185, 129, ${
                                                0.5 +
                                                entry.average /
                                                    (data.stats.maxDay.value *
                                                        2)
                                            })`}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseHeatmap;
