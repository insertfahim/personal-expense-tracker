"use client";

import React from "react";
import { SavingsGoalsSummary } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Target, CheckCircle, Clock, DollarSign } from "lucide-react";
import SavingsGoalCard from "./SavingsGoalCard";

interface SavingsGoalSummaryProps {
    summary: SavingsGoalsSummary | null;
    isLoading: boolean;
}

const SavingsGoalSummary: React.FC<SavingsGoalSummaryProps> = ({
    summary,
    isLoading,
}) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Savings Goals Available
                </h3>
                <p className="text-gray-600 mb-4">
                    Start by creating your first savings goal.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                    Savings Goals Summary
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    Track your progress towards financial goals
                </p>
            </div>

            <div className="p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex items-center">
                            <Target className="h-8 w-8 text-blue-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">
                                    Total Goals
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {summary.totalGoals}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {summary.activeGoals} active,{" "}
                                    {summary.completedGoals} completed
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex items-center">
                            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">
                                    Total Saved
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(summary.totalSaved)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    of {formatCurrency(summary.totalTarget)}{" "}
                                    target
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex items-center">
                            <CheckCircle className="h-8 w-8 text-purple-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">
                                    Overall Progress
                                </p>
                                <div className="flex items-center">
                                    <p className="text-2xl font-bold text-gray-900">
                                        {summary.overallProgress.toFixed(0)}%
                                    </p>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                    <div
                                        className="h-1.5 rounded-full bg-purple-600"
                                        style={{
                                            width: `${summary.overallProgress}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex items-center">
                            <Clock className="h-8 w-8 text-orange-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">
                                    Upcoming Goals
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {summary.upcomingGoals.length}
                                </p>
                                <p className="text-xs text-gray-500">
                                    goals with upcoming deadlines
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Goals */}
                {summary.upcomingGoals.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Upcoming Goals
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {summary.upcomingGoals.map((goal) => (
                                <SavingsGoalCard
                                    key={goal._id}
                                    goal={goal}
                                    showActions={false}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Near Completion */}
                {summary.nearCompletionGoals.length > 0 && (
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Almost There
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {summary.nearCompletionGoals.map((goal) => (
                                <SavingsGoalCard
                                    key={goal._id}
                                    goal={goal}
                                    showActions={false}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavingsGoalSummary;
