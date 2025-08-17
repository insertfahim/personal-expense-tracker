"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Calendar,
    DollarSign,
    Target,
    ArrowRight,
    CheckCircle,
    Star,
} from "lucide-react";

const AnalyticsPage: React.FC = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <AnalyticsFeaturePage />;
    }

    return <AnalyticsDashboard />;
};

const AnalyticsFeaturePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <BarChart3 className="h-16 w-16 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold mb-6">
                            Powerful Analytics & Insights
                        </h1>
                        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            Get deep insights into your spending patterns with
                            our comprehensive analytics dashboard. Make informed
                            financial decisions with visual data
                            representations.
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
                        Analytics Features
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Transform your spending data into actionable insights
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {analyticsFeatures.map((feature, index) => (
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
                            <p className="text-gray-600 text-center mb-6">
                                {feature.description}
                            </p>
                            <div className="space-y-2">
                                {feature.points.map((point, pointIndex) => (
                                    <div
                                        key={pointIndex}
                                        className="flex items-center text-sm text-gray-600"
                                    >
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                                        {point}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Benefits Section */}
                <div className="bg-gray-100 rounded-2xl p-12 mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Why Choose Our Analytics?
                        </h2>
                        <p className="text-lg text-gray-600">
                            Make smarter financial decisions with data-driven
                            insights
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                                    <benefit.icon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Ready to Take Control of Your Finances?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Join thousands of users who are already making smarter
                        financial decisions
                    </p>
                    <Link
                        href="/register"
                        className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
                    >
                        Start Tracking Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

const AnalyticsDashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Analytics Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Track your spending patterns and financial insights
                    </p>
                </div>

                {/* Coming Soon Message */}
                <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                    <div className="flex justify-center mb-6">
                        <BarChart3 className="h-20 w-20 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Analytics Dashboard Coming Soon!
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        We&apos;re working hard to bring you comprehensive
                        analytics and insights about your expenses. This feature
                        will include interactive charts, spending trends,
                        category breakdowns, and much more.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <PieChart className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Category Breakdown
                            </h3>
                            <p className="text-sm text-gray-600">
                                Visual pie charts of your spending by category
                            </p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg">
                            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Spending Trends
                            </h3>
                            <p className="text-sm text-gray-600">
                                Track your spending patterns over time
                            </p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-lg">
                            <Target className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Budget Goals
                            </h3>
                            <p className="text-sm text-gray-600">
                                Set and track your financial goals
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/expenses"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            View Your Expenses
                        </Link>
                        <Link
                            href="/add-expense"
                            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                        >
                            Add New Expense
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const analyticsFeatures = [
    {
        icon: PieChart,
        title: "Category Analytics",
        description:
            "Visualize your spending across different categories with interactive pie charts",
        points: [
            "Interactive pie and donut charts",
            "Category-wise spending breakdown",
            "Monthly comparison views",
        ],
    },
    {
        icon: TrendingUp,
        title: "Spending Trends",
        description: "Track your spending patterns and trends over time",
        points: [
            "Daily, weekly, monthly trends",
            "Year-over-year comparisons",
            "Spending velocity tracking",
        ],
    },
    {
        icon: Calendar,
        title: "Time-based Analysis",
        description: "Analyze your expenses across different time periods",
        points: [
            "Custom date range selection",
            "Seasonal spending patterns",
            "Peak spending identification",
        ],
    },
    {
        icon: DollarSign,
        title: "Budget Tracking",
        description:
            "Set budgets and track your progress against financial goals",
        points: [
            "Category-wise budget limits",
            "Real-time budget alerts",
            "Goal achievement tracking",
        ],
    },
    {
        icon: Target,
        title: "Financial Goals",
        description:
            "Set and monitor your short-term and long-term financial objectives",
        points: [
            "Savings goal tracking",
            "Expense reduction targets",
            "Progress visualization",
        ],
    },
    {
        icon: BarChart3,
        title: "Advanced Reports",
        description:
            "Generate detailed reports for comprehensive financial analysis",
        points: [
            "Exportable reports",
            "Custom report generation",
            "Multi-format downloads",
        ],
    },
];

const benefits = [
    {
        icon: Star,
        title: "Make Informed Decisions",
        description:
            "Use data-driven insights to make better financial choices and optimize your spending habits.",
    },
    {
        icon: TrendingUp,
        title: "Identify Patterns",
        description:
            "Discover spending patterns and trends that you might not notice in day-to-day transactions.",
    },
    {
        icon: Target,
        title: "Achieve Financial Goals",
        description:
            "Set realistic budgets and goals based on your actual spending data and track progress.",
    },
    {
        icon: CheckCircle,
        title: "Stay on Track",
        description:
            "Get alerts and notifications when you're approaching budget limits or spending unusually.",
    },
];

export default AnalyticsPage;
