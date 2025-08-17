"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
    ArrowRight,
    Calendar,
    BarChart3,
    PieChart,
    RefreshCw,
    AlertTriangle,
    TrendingUp,
} from "lucide-react";
import ExpenseHeatmap from "@/components/ExpenseHeatmap";
import { useExpenseHeatmap } from "@/hooks/useExpenseHeatmap";
import ExportButton from "@/components/ExportButton";
import { exportHeatmapToPDF } from "@/lib/exportUtils";

const HeatmapPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [month, setMonth] = useState<number | null>(
        new Date().getMonth() + 1
    );

    const { heatmapData, isLoading, error, refresh } = useExpenseHeatmap({
        year,
        month,
    });

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setYear(parseInt(e.target.value));
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setMonth(value === "all" ? null : parseInt(value));
    };

    if (!isAuthenticated) {
        return <HeatmapFeaturePage />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Expense Heatmap
                            </h1>
                            <p className="text-gray-600">
                                Visualize your spending patterns by day and
                                weekday
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex items-center">
                                <label
                                    htmlFor="month"
                                    className="mr-2 text-sm text-gray-700"
                                >
                                    Month:
                                </label>
                                <select
                                    id="month"
                                    value={month === null ? "all" : month}
                                    onChange={handleMonthChange}
                                    className="border rounded-md px-3 py-1 text-sm"
                                >
                                    <option value="all">All Months</option>
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
                            <button
                                onClick={refresh}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </button>
                            <ExportButton
                                onExportPDF={() =>
                                    heatmapData &&
                                    exportHeatmapToPDF(heatmapData)
                                }
                                disabled={!heatmapData}
                            />
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                        <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-medium">
                                Error loading heatmap data
                            </p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Heatmap */}
                <div className="mb-8">
                    <ExpenseHeatmap data={heatmapData} isLoading={isLoading} />
                </div>

                {/* Quick Links */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/analytics"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                    >
                        <PieChart className="h-5 w-5 mr-2" />
                        View Analytics
                    </Link>
                    <Link
                        href="/forecast"
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center justify-center"
                    >
                        <TrendingUp className="h-5 w-5 mr-2" />
                        View Forecast
                    </Link>
                </div>
            </div>
        </div>
    );
};

const HeatmapFeaturePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-green-600 to-teal-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <Calendar className="h-16 w-16 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold mb-6">
                            Expense Heatmap Visualization
                        </h1>
                        <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
                            Discover your spending patterns with our powerful
                            calendar heatmap. Identify high-spending days and
                            understand your financial habits.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center"
                            >
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href="/login"
                                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
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
                        Heatmap Features
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Visualize your spending patterns like never before
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {heatmapFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border"
                        >
                            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-6 mx-auto">
                                <feature.icon className="h-8 w-8 text-green-600" />
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
                        Ready to Visualize Your Spending?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Join thousands of users who are gaining insights from
                        their spending patterns
                    </p>
                    <Link
                        href="/register"
                        className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center"
                    >
                        Start Visualizing Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

const heatmapFeatures = [
    {
        icon: Calendar,
        title: "Calendar Heatmap",
        description:
            "Visualize your spending intensity across days with an intuitive color-coded calendar.",
    },
    {
        icon: BarChart3,
        title: "Weekday Analysis",
        description:
            "Discover which days of the week you spend the most money on average.",
    },
    {
        icon: AlertTriangle,
        title: "High-Spending Detection",
        description:
            "Easily identify your highest spending days and patterns throughout the month or year.",
    },
    {
        icon: RefreshCw,
        title: "Historical Patterns",
        description:
            "View and compare spending patterns across different months and years.",
    },
    {
        icon: PieChart,
        title: "Spending Insights",
        description:
            "Gain valuable insights into your spending habits with detailed statistics.",
    },
    {
        icon: Calendar,
        title: "Monthly & Yearly Views",
        description:
            "Switch between monthly and yearly views to analyze different time periods.",
    },
];

export default HeatmapPage;
