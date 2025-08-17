"use client";

import React, { useState } from "react";
import { BudgetComparison as BudgetComparisonType } from "@/types";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface BudgetComparisonProps {
    data: BudgetComparisonType;
    isLoading: boolean;
}

const BudgetComparison: React.FC<BudgetComparisonProps> = ({
    data,
    isLoading,
}) => {
    const [sortBy, setSortBy] = useState<string>("percentage");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortDirection("desc");
        }
    };

    const sortedComparison = [...data.comparison].sort((a, b) => {
        const aValue = a[sortBy as keyof typeof a];
        const bValue = b[sortBy as keyof typeof b];

        if (typeof aValue === "number" && typeof bValue === "number") {
            return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        return 0;
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const { year, month } = data.period;
    const monthName = new Date(year, month - 1).toLocaleString("default", {
        month: "long",
    });

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                    Budget Comparison - {monthName} {year}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    Compare your actual spending against budget targets
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Total Budget
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                ${data.totals.budgetAmount.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Actual Spending
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                ${data.totals.actualAmount.toFixed(2)}
                            </p>
                        </div>
                        <div
                            className={`${
                                data.totals.percentage >= 100
                                    ? "bg-red-100"
                                    : "bg-green-100"
                            } p-2 rounded-full`}
                        >
                            {data.totals.percentage >= 100 ? (
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            ) : (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full ${
                                    data.totals.percentage >= 100
                                        ? "bg-red-600"
                                        : "bg-blue-600"
                                }`}
                                style={{
                                    width: `${Math.min(
                                        100,
                                        data.totals.percentage
                                    )}%`,
                                }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                            <p className="text-xs text-gray-500">
                                {data.totals.percentage.toFixed(1)}% of budget
                            </p>
                            <p className="text-xs text-gray-500">
                                ${data.totals.remaining.toFixed(2)} remaining
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Status
                            </p>
                            <p
                                className={`text-xl font-bold ${
                                    data.totals.percentage >= 100
                                        ? "text-red-600"
                                        : "text-green-600"
                                }`}
                            >
                                {data.totals.percentage >= 100
                                    ? "Over Budget"
                                    : "Under Budget"}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        {data.totals.percentage >= 100
                            ? `$${(
                                  data.totals.actualAmount -
                                  data.totals.budgetAmount
                              ).toFixed(2)} over budget`
                            : `$${data.totals.remaining.toFixed(
                                  2
                              )} under budget`}
                    </p>
                </div>
            </div>

            {/* Comparison Table */}
            <div className="px-6 pb-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort("category")}
                                >
                                    Category
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort("budgetAmount")}
                                >
                                    Budget
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort("actualAmount")}
                                >
                                    Actual
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort("percentage")}
                                >
                                    % Used
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort("remaining")}
                                >
                                    Remaining
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedComparison.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {item.category}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            ${item.budgetAmount.toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            ${item.actualAmount.toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-grow mr-2">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${
                                                            item.percentage >=
                                                            100
                                                                ? "bg-red-600"
                                                                : "bg-blue-600"
                                                        }`}
                                                        style={{
                                                            width: `${Math.min(
                                                                100,
                                                                item.percentage
                                                            )}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div
                                                className={`text-sm font-medium ${
                                                    item.percentage >= 100
                                                        ? "text-red-600"
                                                        : "text-gray-900"
                                                }`}
                                            >
                                                {item.percentage.toFixed(1)}%
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div
                                            className={`text-sm ${
                                                item.remaining <= 0
                                                    ? "text-red-600"
                                                    : "text-green-600"
                                            }`}
                                        >
                                            ${item.remaining.toFixed(2)}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BudgetComparison;
