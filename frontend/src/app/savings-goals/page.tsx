"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
    ArrowRight,
    Target,
    PlusCircle,
    BarChart3,
    DollarSign,
    Filter,
    RefreshCw,
    AlertTriangle,
} from "lucide-react";
import {
    useSavingsGoals,
    useSavingsGoalsSummary,
} from "@/hooks/useSavingsGoals";
import SavingsGoalForm from "@/components/SavingsGoalForm";
import SavingsGoalCard from "@/components/SavingsGoalCard";
import SavingsGoalSummary from "@/components/SavingsGoalSummary";
import ContributionForm from "@/components/ContributionForm";
import { SavingsGoalFormData, ContributionFormData } from "@/types";

const SavingsGoalsPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [showContributionForm, setShowContributionForm] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filterActive, setFilterActive] = useState<boolean | undefined>(true);
    const [filterCategory, setFilterCategory] = useState<string>("all");

    // Fetch goals and summary
    const {
        goals,
        isLoading,
        error,
        createGoal,
        deleteGoal,
        addContribution,
        refresh,
    } = useSavingsGoals({
        active: filterActive,
        enabled: isAuthenticated,
    });
    const { summary, isLoading: isSummaryLoading } =
        useSavingsGoalsSummary(isAuthenticated);

    // Filter goals by category
    const filteredGoals =
        filterCategory === "all"
            ? goals
            : goals.filter((goal) => goal.category === filterCategory);

    // Handle form submission
    const handleCreateGoal = async (data: SavingsGoalFormData) => {
        setIsSubmitting(true);
        try {
            const success = await createGoal(data);
            if (success) {
                setShowForm(false);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle contribution form submission
    const handleAddContribution = async (data: ContributionFormData) => {
        if (!selectedGoal) return;

        setIsSubmitting(true);
        try {
            const success = await addContribution(selectedGoal, data);
            if (success) {
                setShowContributionForm(false);
                setSelectedGoal(null);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle delete goal
    const handleDeleteGoal = async (id: string) => {
        if (confirm("Are you sure you want to delete this savings goal?")) {
            await deleteGoal(id);
        }
    };

    // Open contribution form for a specific goal
    const openContributionForm = (goalId: string) => {
        setSelectedGoal(goalId);
        setShowContributionForm(true);
    };

    if (!isAuthenticated) {
        return <SavingsGoalsFeaturePage />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Savings Goals
                            </h1>
                            <p className="text-gray-600">
                                Track and manage your financial goals
                            </p>
                        </div>

                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlusCircle className="h-5 w-5 mr-2" />
                            New Goal
                        </button>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="mb-8">
                    <SavingsGoalSummary
                        summary={summary}
                        isLoading={isSummaryLoading}
                    />
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="max-w-md w-full">
                            <SavingsGoalForm
                                onSubmit={handleCreateGoal}
                                onCancel={() => setShowForm(false)}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    </div>
                )}

                {/* Contribution Form Modal */}
                {showContributionForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="max-w-md w-full">
                            <ContributionForm
                                onSubmit={handleAddContribution}
                                onCancel={() => {
                                    setShowContributionForm(false);
                                    setSelectedGoal(null);
                                }}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center">
                            <Filter className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-700">
                                Filters:
                            </span>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={
                                    filterActive === undefined
                                        ? "all"
                                        : filterActive
                                        ? "active"
                                        : "inactive"
                                }
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFilterActive(
                                        value === "all"
                                            ? undefined
                                            : value === "active"
                                    );
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <select
                                value={filterCategory}
                                onChange={(e) =>
                                    setFilterCategory(e.target.value)
                                }
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Categories</option>
                                {[
                                    "Emergency",
                                    "Vacation",
                                    "Education",
                                    "Home",
                                    "Vehicle",
                                    "Retirement",
                                    "Investment",
                                    "Debt",
                                    "Others",
                                ].map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={refresh}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center ml-auto"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Goals Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        <div className="flex">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            <div>
                                <p className="font-medium">
                                    Error loading savings goals
                                </p>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                ) : filteredGoals.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            {goals.length === 0
                                ? "No savings goals found"
                                : "No goals match your current filters"}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {goals.length === 0
                                ? "Start tracking your financial goals by creating your first savings goal."
                                : "Try adjusting your filters to see more goals."}
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlusCircle className="h-5 w-5 mr-2" />
                            {goals.length === 0
                                ? "Create Your First Goal"
                                : "Create New Goal"}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGoals.map((goal) => (
                            <SavingsGoalCard
                                key={goal._id}
                                goal={goal}
                                onDelete={() => handleDeleteGoal(goal._id)}
                                onAddContribution={() =>
                                    openContributionForm(goal._id)
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const SavingsGoalsFeaturePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <Target className="h-16 w-16 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold mb-6">
                            Achieve Your Financial Goals
                        </h1>
                        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            Set, track, and reach your savings goals with our
                            powerful goal tracking system. Visualize your
                            progress and stay motivated to achieve financial
                            success.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
                            >
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href="/login"
                                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Savings Goal Features
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Powerful tools to help you achieve your financial dreams
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {savingsGoalFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border"
                        >
                            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 mx-auto">
                                <feature.icon className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 text-center">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Ready to Achieve Your Financial Goals?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Join thousands of users who are already on their way to
                        financial success
                    </p>
                    <Link
                        href="/register"
                        className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
                    >
                        Start Tracking Your Goals
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

const savingsGoalFeatures = [
    {
        icon: Target,
        title: "Goal Setting",
        description:
            "Set specific, measurable, and time-bound financial goals with customizable targets.",
    },
    {
        icon: BarChart3,
        title: "Progress Tracking",
        description:
            "Visualize your progress with beautiful progress bars and detailed statistics.",
    },
    {
        icon: DollarSign,
        title: "Contribution Management",
        description:
            "Record and track contributions towards your goals with detailed history.",
    },
    {
        icon: ArrowRight,
        title: "Target Dates",
        description:
            "Set target dates for your goals and get insights on daily savings needed.",
    },
    {
        icon: PlusCircle,
        title: "Multiple Goals",
        description:
            "Track multiple savings goals simultaneously for different financial objectives.",
    },
    {
        icon: RefreshCw,
        title: "Goal Categories",
        description:
            "Organize your goals by categories like Emergency, Vacation, Education, and more.",
    },
];

export default SavingsGoalsPage;
