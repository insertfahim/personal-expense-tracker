"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
    ArrowRight,
    TrendingUp,
    BarChart3,
    PieChart,
    DollarSign,
    RefreshCw,
    AlertTriangle,
} from "lucide-react";
import PredictiveChart from "@/components/PredictiveChart";
import { usePredictiveAnalytics } from "@/hooks/usePredictiveAnalytics";
import ExportButton from "@/components/ExportButton";
import { exportForecastToPDF } from "@/lib/exportUtils";

const ForecastPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [forecastMonths, setForecastMonths] = useState<number>(3);

    const { forecast, isLoading, error, refresh } = usePredictiveAnalytics({
        months: forecastMonths,
        enabled: isAuthenticated,
    });

    const handleMonthsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setForecastMonths(parseInt(e.target.value));
    };

    if (!isAuthenticated) {
        return <ForecastFeaturePage />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Spending Forecast
                            </h1>
                            <p className="text-gray-600">
                                Predictive analytics based on your spending
                                patterns
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex items-center">
                                <label
                                    htmlFor="months"
                                    className="mr-2 text-sm text-gray-700"
                                >
                                    Forecast:
                                </label>
                                <select
                                    id="months"
                                    value={forecastMonths}
                                    onChange={handleMonthsChange}
                                    className="border rounded-md px-3 py-1 text-sm"
                                >
                                    <option value="1">1 Month</option>
                                    <option value="3">3 Months</option>
                                    <option value="6">6 Months</option>
                                    <option value="12">12 Months</option>
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
                                    forecast && exportForecastToPDF(forecast)
                                }
                                disabled={!forecast}
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
                                Error loading forecast data
                            </p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Predictive Chart */}
                <div className="mb-8">
                    <PredictiveChart data={forecast} isLoading={isLoading} />
                </div>

                {/* Disclaimer */}
                <div className="mb-8 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                    <h3 className="font-medium mb-1">Forecast Disclaimer</h3>
                    <p className="text-sm">
                        Predictions are based on your historical spending
                        patterns and may not accurately reflect future expenses.
                        The forecast should be used as a general guideline only
                        and not for critical financial decisions.
                    </p>
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
                        href="/budgets"
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center justify-center"
                    >
                        <DollarSign className="h-5 w-5 mr-2" />
                        Budget Management
                    </Link>
                </div>
            </div>
        </div>
    );
};

const ForecastFeaturePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <TrendingUp className="h-16 w-16 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold mb-6">
                            Predictive Spending Analytics
                        </h1>
                        <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
                            Forecast your future expenses based on historical
                            spending patterns. Plan ahead with data-driven
                            predictions and insights.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center"
                            >
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href="/login"
                                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
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
                        Forecast Features
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Make informed financial decisions with our advanced
                        predictive analytics
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {forecastFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border"
                        >
                            <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-lg mb-6 mx-auto">
                                <feature.icon className="h-8 w-8 text-indigo-600" />
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
                        Ready to See Your Financial Future?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Join thousands of users who are making smarter financial
                        decisions with predictive analytics
                    </p>
                    <Link
                        href="/register"
                        className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center"
                    >
                        Start Forecasting Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

const forecastFeatures = [
    {
        icon: TrendingUp,
        title: "Spending Trend Analysis",
        description:
            "Identify whether your spending is increasing or decreasing over time with trend analysis.",
    },
    {
        icon: BarChart3,
        title: "Monthly Forecasting",
        description:
            "Get predictions for your spending in the coming months based on historical patterns.",
    },
    {
        icon: PieChart,
        title: "Category-Based Predictions",
        description:
            "See forecasts for each spending category to better plan your budget allocation.",
    },
    {
        icon: DollarSign,
        title: "Financial Planning",
        description:
            "Use predictive data to make informed decisions about future financial commitments.",
    },
    {
        icon: RefreshCw,
        title: "Adaptive Predictions",
        description:
            "Forecasts that automatically adjust as your spending habits change over time.",
    },
    {
        icon: AlertTriangle,
        title: "Spending Alerts",
        description:
            "Get notified about potential budget overruns before they happen.",
    },
];

export default ForecastPage;
