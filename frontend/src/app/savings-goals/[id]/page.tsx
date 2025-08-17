"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Target,
    PlusCircle,
    Edit,
    Trash2,
    Calendar,
    DollarSign,
    Clock,
    AlertTriangle,
} from "lucide-react";
import { savingsGoalsAPI } from "@/lib/api";
import { SavingsGoal, ContributionFormData } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import ContributionForm from "@/components/ContributionForm";
import AuthGuard from "@/components/AuthGuard";

interface SavingsGoalDetailPageProps {
    params: {
        id: string;
    };
}

const SavingsGoalDetailPage: React.FC<SavingsGoalDetailPageProps> = ({
    params,
}) => {
    const router = useRouter();
    const { id } = params;

    const [goal, setGoal] = useState<SavingsGoal | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showContributionForm, setShowContributionForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch goal details
    useEffect(() => {
        const fetchGoal = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await savingsGoalsAPI.getSavingsGoalById(id);

                if (response.success && response.data) {
                    setGoal(response.data);
                } else {
                    setError(
                        response.message || "Failed to fetch goal details"
                    );
                }
            } catch (err: unknown) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch goal details";
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGoal();
    }, [id]);

    // Handle add contribution
    const handleAddContribution = async (data: ContributionFormData) => {
        setIsSubmitting(true);
        try {
            const response = await savingsGoalsAPI.addContribution(id, data);

            if (response.success && response.data) {
                setGoal(response.data);
                setShowContributionForm(false);
            }
        } catch (error) {
            console.error("Failed to add contribution:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle delete contribution
    const handleDeleteContribution = async (contributionId: string) => {
        if (confirm("Are you sure you want to remove this contribution?")) {
            try {
                const response = await savingsGoalsAPI.removeContribution(
                    id,
                    contributionId
                );

                if (response.success && response.data) {
                    setGoal(response.data);
                }
            } catch (error) {
                console.error("Failed to delete contribution:", error);
            }
        }
    };

    // Handle delete goal
    const handleDeleteGoal = async () => {
        if (confirm("Are you sure you want to delete this savings goal?")) {
            try {
                const response = await savingsGoalsAPI.deleteSavingsGoal(id);

                if (response.success) {
                    router.push("/savings-goals");
                }
            } catch (error) {
                console.error("Failed to delete goal:", error);
            }
        }
    };

    // Calculate days remaining text
    const getDaysRemainingText = (days: number) => {
        if (days === 0) return "Due today";
        if (days === 1) return "1 day left";
        return `${days} days left`;
    };

    if (isLoading) {
        return (
            <AuthGuard>
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    </div>
                </div>
            </AuthGuard>
        );
    }

    if (error || !goal) {
        return (
            <AuthGuard>
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <div className="flex">
                                <AlertTriangle className="h-5 w-5 mr-2" />
                                <div>
                                    <p className="font-medium">
                                        Error loading savings goal
                                    </p>
                                    <p className="text-sm">
                                        {error || "Goal not found"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link
                                href="/savings-goals"
                                className="inline-flex items-center text-blue-600 hover:text-blue-700"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Savings Goals
                            </Link>
                        </div>
                    </div>
                </div>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href="/savings-goals"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Savings Goals
                        </Link>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="flex items-center">
                                    <h1 className="text-3xl font-bold text-gray-900 mr-3">
                                        {goal.title}
                                    </h1>
                                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                        {goal.category}
                                    </span>
                                </div>
                                {goal.description && (
                                    <p className="text-gray-600 mt-2">
                                        {goal.description}
                                    </p>
                                )}
                            </div>
                            <div className="mt-4 sm:mt-0 flex space-x-3">
                                <Link
                                    href={`/savings-goals/${goal._id}/edit`}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Link>
                                <button
                                    onClick={handleDeleteGoal}
                                    className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Contribution Form Modal */}
                    {showContributionForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="max-w-md w-full">
                                <ContributionForm
                                    onSubmit={handleAddContribution}
                                    onCancel={() =>
                                        setShowContributionForm(false)
                                    }
                                    isSubmitting={isSubmitting}
                                />
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Goal Details */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                {/* Color header */}
                                <div
                                    className="h-2"
                                    style={{ backgroundColor: goal.color }}
                                ></div>

                                <div className="p-6">
                                    {/* Status */}
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <span className="text-sm text-gray-500">
                                                Status
                                            </span>
                                            <div className="mt-1">
                                                {goal.isCompleted ? (
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                                        Completed
                                                    </span>
                                                ) : !goal.isActive ? (
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                                                        Inactive
                                                    </span>
                                                ) : goal.daysRemaining === 0 ? (
                                                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                                                        Due Today
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {!goal.isCompleted && goal.isActive && (
                                            <button
                                                onClick={() =>
                                                    setShowContributionForm(
                                                        true
                                                    )
                                                }
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <PlusCircle className="h-4 w-4 mr-2" />
                                                Add Contribution
                                            </button>
                                        )}
                                    </div>

                                    {/* Progress bar */}
                                    <div className="mb-8">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-medium text-gray-700">
                                                Progress
                                            </span>
                                            <span className="font-medium">
                                                {goal.progress.toFixed(0)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4">
                                            <div
                                                className="h-4 rounded-full"
                                                style={{
                                                    width: `${goal.progress}%`,
                                                    backgroundColor: goal.color,
                                                }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-sm mt-2">
                                            <span className="text-gray-600">
                                                {formatCurrency(
                                                    goal.currentAmount
                                                )}{" "}
                                                saved
                                            </span>
                                            <span className="text-gray-600">
                                                Goal:{" "}
                                                {formatCurrency(
                                                    goal.targetAmount
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center">
                                                <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Remaining
                                                    </p>
                                                    <p className="text-lg font-medium text-gray-900">
                                                        {formatCurrency(
                                                            goal.remainingAmount
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center">
                                                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Target Date
                                                    </p>
                                                    <p className="text-lg font-medium text-gray-900">
                                                        {formatDate(
                                                            goal.targetDate
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center">
                                                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Time Left
                                                    </p>
                                                    <p className="text-lg font-medium text-gray-900">
                                                        {goal.isCompleted
                                                            ? "Completed"
                                                            : getDaysRemainingText(
                                                                  goal.daysRemaining
                                                              )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center">
                                                <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Daily Target
                                                    </p>
                                                    <p className="text-lg font-medium text-gray-900">
                                                        {goal.isCompleted ||
                                                        goal.daysRemaining === 0
                                                            ? "N/A"
                                                            : formatCurrency(
                                                                  goal.dailySavingsNeeded
                                                              )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            Goal Timeline
                                        </h3>
                                        <div className="flex items-center mb-4">
                                            <div className="w-3 h-3 rounded-full bg-blue-600 mr-3"></div>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Started
                                                </p>
                                                <p className="text-base font-medium">
                                                    {formatDate(goal.startDate)}
                                                </p>
                                            </div>
                                            <div className="flex-1 mx-4 border-t border-dashed border-gray-300"></div>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Target
                                                </p>
                                                <p className="text-base font-medium">
                                                    {formatDate(
                                                        goal.targetDate
                                                    )}
                                                </p>
                                            </div>
                                            <div className="w-3 h-3 rounded-full bg-green-600 ml-3"></div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="h-1.5 rounded-full bg-blue-600"
                                                style={{
                                                    width: `${Math.min(
                                                        100,
                                                        (goal.daysRemaining /
                                                            (new Date(
                                                                goal.targetDate
                                                            ).getTime() -
                                                                new Date(
                                                                    goal.startDate
                                                                ).getTime())) *
                                                            (1000 *
                                                                60 *
                                                                60 *
                                                                24) *
                                                            100
                                                    )}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Contributions */}
                        <div>
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Contributions
                                    </h2>
                                </div>

                                <div className="p-6">
                                    {goal.contributions.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                                No Contributions Yet
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                Start adding contributions to
                                                track your progress.
                                            </p>
                                            {!goal.isCompleted &&
                                                goal.isActive && (
                                                    <button
                                                        onClick={() =>
                                                            setShowContributionForm(
                                                                true
                                                            )
                                                        }
                                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        <PlusCircle className="h-4 w-4 mr-2" />
                                                        Add First Contribution
                                                    </button>
                                                )}
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <p className="text-sm text-gray-600">
                                                    {goal.contributions.length}{" "}
                                                    total contributions
                                                </p>
                                                <p className="text-sm font-medium">
                                                    Total:{" "}
                                                    {formatCurrency(
                                                        goal.currentAmount
                                                    )}
                                                </p>
                                            </div>

                                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                                {[...goal.contributions]
                                                    .sort(
                                                        (a, b) =>
                                                            new Date(
                                                                b.date
                                                            ).getTime() -
                                                            new Date(
                                                                a.date
                                                            ).getTime()
                                                    )
                                                    .map((contribution) => (
                                                        <div
                                                            key={
                                                                contribution._id
                                                            }
                                                            className="bg-gray-50 rounded-lg p-4 flex justify-between"
                                                        >
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    {formatCurrency(
                                                                        contribution.amount
                                                                    )}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    {formatDate(
                                                                        contribution.date
                                                                    )}
                                                                </p>
                                                                {contribution.note && (
                                                                    <p className="text-sm text-gray-500 mt-1">
                                                                        {
                                                                            contribution.note
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteContribution(
                                                                        contribution._id
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-700 p-1 h-fit"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
};

export default SavingsGoalDetailPage;
