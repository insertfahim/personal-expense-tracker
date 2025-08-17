"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
    ArrowRight,
    Calendar,
    DollarSign,
    BarChart3,
    PieChart,
} from "lucide-react";
import BudgetManagement from "@/components/BudgetManagement";
import BudgetComparison from "@/components/BudgetComparison";
import { useBudgetComparison } from "@/hooks/useBudgets";
import ExportButton from "@/components/ExportButton";
import { exportBudgetComparisonToPDF } from "@/lib/exportUtils";

const BudgetPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

    // Only call the hook if user is authenticated
    const { comparison, isLoading } = useBudgetComparison(
        isAuthenticated ? year : undefined,
        isAuthenticated ? month : undefined
    );

    // Handle month/year selection
    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMonth(parseInt(e.target.value));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setYear(parseInt(e.target.value));
    };

    if (!isAuthenticated) {
        return <BudgetFeaturePage />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Budget Management
                            </h1>
                            <p className="text-gray-600">
                                Set budgets and track your spending against
                                targets
                            </p>
                        </div>

                        {/* Period Selector */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center">
                                <label
                                    htmlFor="month"
                                    className="mr-2 text-sm text-gray-700"
                                >
                                    Month:
                                </label>
                                <select
                                    id="month"
                                    value={month}
                                    onChange={handleMonthChange}
                                    className="border rounded-md px-3 py-1 text-sm"
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {new Date(0, i).toLocaleString(
                                                "default",
                                                { month: "long" }
                                            )}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center">
                                <label
                                    htmlFor="year"
                                    className="mr-2 text-sm text-gray-700"
                                >
                                    Year:
                                </label>
                                <select
                                    id="year"
                                    value={year}
                                    onChange={handleYearChange}
                                    className="border rounded-md px-3 py-1 text-sm"
                                >
                                    {Array.from(
                                        { length: 5 },
                                        (_, i) =>
                                            new Date().getFullYear() - 2 + i
                                    ).map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {comparison && (
                                <ExportButton
                                    onExportPDF={() =>
                                        exportBudgetComparisonToPDF(comparison)
                                    }
                                    disabled={!comparison}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Budget Comparison */}
                <div className="mb-8">
                    {comparison ? (
                        <BudgetComparison
                            data={comparison}
                            isLoading={isLoading}
                        />
                    ) : isLoading ? (
                        <div className="bg-white rounded-lg shadow-lg p-6 flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                            <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No Budget Comparison Available
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Set up budgets below to see how your spending
                                compares to your targets.
                            </p>
                        </div>
                    )}
                </div>

                {/* Budget Management */}
                <div className="mb-8">
                    <BudgetManagement year={year} month={month} />
                </div>

                {/* Quick Links */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/expenses"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                    >
                        <BarChart3 className="h-5 w-5 mr-2" />
                        View All Expenses
                    </Link>
                    <Link
                        href="/analytics"
                        className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
                    >
                        <PieChart className="h-5 w-5 mr-2" />
                        View Analytics
                    </Link>
                </div>
            </div>
        </div>
    );
};

const BudgetFeaturePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <DollarSign className="h-16 w-16 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold mb-6">
                            Smart Budget Management
                        </h1>
                        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            Take control of your finances with our comprehensive
                            budget tracking system. Set targets, monitor
                            progress, and achieve your financial goals.
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
                        Budget Features
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Powerful tools to help you stay on track with your
                        financial goals
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {budgetFeatures.map((feature, index) => (
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
                        Ready to Start Budgeting?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Join thousands of users who are already making smarter
                        financial decisions
                    </p>
                    <Link
                        href="/register"
                        className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
                    >
                        Create Your First Budget
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

const budgetFeatures = [
    {
        icon: PieChart,
        title: "Visual Budget Tracking",
        description:
            "See your spending against budgets with intuitive visual indicators and progress bars.",
    },
    {
        icon: Calendar,
        title: "Monthly & Yearly Budgets",
        description:
            "Set budgets for specific months or create annual budgets for long-term planning.",
    },
    {
        icon: BarChart3,
        title: "Category-Based Budgeting",
        description:
            "Create separate budgets for different expense categories to better control spending.",
    },
    {
        icon: DollarSign,
        title: "Real-time Comparisons",
        description:
            "Compare your actual spending against budget targets in real-time as you add expenses.",
    },
    {
        icon: ArrowRight,
        title: "Flexible Budget Management",
        description:
            "Easily adjust your budgets as your financial situation or goals change.",
    },
    {
        icon: Calendar,
        title: "Historical Budget Analysis",
        description:
            "Review past budget performance to improve your financial planning.",
    },
];

export default BudgetPage;
