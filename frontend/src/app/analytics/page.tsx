"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
    BarChart3,
    PieChart,
    TrendingUp,
    DollarSign,
    Target,
    ArrowRight,
    CheckCircle,
    Star,
    RefreshCw,
    Calendar,
    Download,
} from "lucide-react";
import DateRangePicker from "@/components/DateRangePicker";
import ExportButton from "@/components/ExportButton";
import { exportAnalyticsToPDF } from "@/lib/exportUtils";
import { format } from "date-fns";
import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { useExpenseStats } from "@/hooks/useExpenses";

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
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [formattedStartDate, setFormattedStartDate] = useState<
        string | undefined
    >(undefined);
    const [formattedEndDate, setFormattedEndDate] = useState<
        string | undefined
    >(undefined);

    const { stats, isLoading, error, refresh } = useExpenseStats({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
    });

    useEffect(() => {
        setFormattedStartDate(
            startDate ? format(startDate, "yyyy-MM-dd") : undefined
        );
        setFormattedEndDate(
            endDate ? format(endDate, "yyyy-MM-dd") : undefined
        );
    }, [startDate, endDate]);

    const handleDateChange = (start: Date | null, end: Date | null) => {
        setStartDate(start);
        setEndDate(end);
    };

    // Color palette for charts
    const colors = useMemo(
        () => [
            "#3B82F6", // Blue
            "#10B981", // Green
            "#F59E0B", // Yellow
            "#EF4444", // Red
            "#8B5CF6", // Purple
            "#06B6D4", // Cyan
            "#F97316", // Orange
        ],
        []
    );

    // Prepare data for category pie chart
    const categoryData = useMemo(() => {
        return (
            stats?.categoryStats?.map((item, index) => ({
                name: item._id,
                value: item.total,
                count: item.count,
                color: colors[index % colors.length],
            })) || []
        );
    }, [stats?.categoryStats, colors]);

    // Prepare monthly trend data
    const monthlyTrendData = useMemo(() => {
        return (
            stats?.monthlyStats?.map((item) => ({
                month: format(new Date(2024, item._id - 1), "MMM"),
                amount: item.total,
                count: item.count,
            })) || []
        );
    }, [stats?.monthlyStats]);

    // Find highest spending category
    const highestSpendingCategory = useMemo(() => {
        if (!categoryData.length) return null;
        return categoryData.reduce((prev, current) =>
            prev.value > current.value ? prev : current
        );
    }, [categoryData]);

    // Calculate spending trend (comparison with previous period)
    const spendingTrend = useMemo(() => {
        const currentMonth = new Date().getMonth();
        const currentMonthData = monthlyTrendData.find(
            (item) => format(new Date(2024, currentMonth), "MMM") === item.month
        );
        const previousMonthData = monthlyTrendData.find(
            (item) =>
                format(new Date(2024, currentMonth - 1), "MMM") === item.month
        );

        if (!currentMonthData || !previousMonthData) return null;

        const change =
            ((currentMonthData.amount - previousMonthData.amount) /
                previousMonthData.amount) *
            100;
        return {
            change: change.toFixed(1),
            isIncrease: change > 0,
            current: currentMonthData.amount,
            previous: previousMonthData.amount,
        };
    }, [monthlyTrendData]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-4">
                        <p className="font-semibold">Error loading analytics</p>
                        <p className="text-sm">{error}</p>
                    </div>
                    <button
                        onClick={refresh}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Analytics Dashboard
                            </h1>
                            <p className="text-gray-600">
                                Insights into your spending patterns and
                                financial habits
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <DateRangePicker
                                startDate={startDate}
                                endDate={endDate}
                                onDateChange={handleDateChange}
                            />
                            <button
                                onClick={refresh}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </button>
                            <ExportButton
                                onExportPDF={() =>
                                    stats && exportAnalyticsToPDF(stats)
                                }
                                disabled={!stats}
                            />
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    Total Spent
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    $
                                    {stats?.totalStats?.totalAmount?.toFixed(
                                        2
                                    ) || "0.00"}
                                </p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <DollarSign className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        {spendingTrend && (
                            <div className="mt-3 flex items-center text-sm">
                                <span
                                    className={`flex items-center ${
                                        spendingTrend.isIncrease
                                            ? "text-red-600"
                                            : "text-green-600"
                                    }`}
                                >
                                    <TrendingUp
                                        className={`h-4 w-4 mr-1 ${
                                            spendingTrend.isIncrease
                                                ? "rotate-0"
                                                : "rotate-180"
                                        }`}
                                    />
                                    {Math.abs(parseFloat(spendingTrend.change))}
                                    % vs last month
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    Total Expenses
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.totalStats?.totalExpenses || 0}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <BarChart3 className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    Average Amount
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    $
                                    {stats?.totalStats?.avgAmount?.toFixed(2) ||
                                        "0.00"}
                                </p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <Target className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    Top Category
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                    {highestSpendingCategory?.name || "N/A"}
                                </p>
                                {highestSpendingCategory && (
                                    <p className="text-sm text-gray-600">
                                        $
                                        {highestSpendingCategory.value.toFixed(
                                            2
                                        )}
                                    </p>
                                )}
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <PieChart className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Category Distribution Pie Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-lg border">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            Spending by Category
                        </h2>
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <RechartsPieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => [
                                            `$${value.toFixed(2)}`,
                                            "Amount",
                                        ]}
                                        labelFormatter={(label) =>
                                            `Category: ${label}`
                                        }
                                    />
                                    <Legend />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                <PieChart className="h-16 w-16 mb-4 text-gray-300" />
                                <p className="text-lg font-medium mb-2">
                                    No data available
                                </p>
                                <p className="text-sm text-center">
                                    Add some expenses to see your spending
                                    breakdown by category
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Monthly Trend Bar Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-lg border">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            Monthly Spending Trend
                        </h2>
                        {monthlyTrendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value: number) => [
                                            `$${value.toFixed(2)}`,
                                            "Amount",
                                        ]}
                                        labelFormatter={(label) =>
                                            `Month: ${label}`
                                        }
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="amount"
                                        fill="#3B82F6"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                <BarChart3 className="h-16 w-16 mb-4 text-gray-300" />
                                <p className="text-lg font-medium mb-2">
                                    No trend data
                                </p>
                                <p className="text-sm text-center">
                                    Add expenses over multiple months to see
                                    trends
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Category Breakdown Table */}
                <div className="bg-white rounded-lg shadow-lg border">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Category Breakdown
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        {categoryData.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Number of Expenses
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Average
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Percentage
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {categoryData
                                        .sort((a, b) => b.value - a.value)
                                        .map((category) => {
                                            const totalAmount =
                                                stats?.totalStats
                                                    ?.totalAmount || 1;
                                            const percentage =
                                                (category.value / totalAmount) *
                                                100;
                                            const average =
                                                category.value / category.count;

                                            return (
                                                <tr
                                                    key={category.name}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div
                                                                className="w-4 h-4 rounded-full mr-3"
                                                                style={{
                                                                    backgroundColor:
                                                                        category.color,
                                                                }}
                                                            ></div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {category.name}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                        $
                                                        {category.value.toFixed(
                                                            2
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {category.count}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        ${average.toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                                                                <div
                                                                    className="h-2 rounded-full"
                                                                    style={{
                                                                        width: `${percentage}%`,
                                                                        backgroundColor:
                                                                            category.color,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className="font-medium">
                                                                {percentage.toFixed(
                                                                    1
                                                                )}
                                                                %
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center">
                                    <BarChart3 className="h-16 w-16 text-gray-300 mb-4" />
                                    <p className="text-lg font-medium text-gray-900 mb-2">
                                        No expense data
                                    </p>
                                    <p className="text-gray-500 mb-6">
                                        Start adding expenses to see detailed
                                        analytics
                                    </p>
                                    <Link
                                        href="/add-expense"
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
                                    >
                                        <DollarSign className="h-5 w-5 mr-2" />
                                        Add Your First Expense
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/expenses"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                    >
                        <BarChart3 className="h-5 w-5 mr-2" />
                        View All Expenses
                    </Link>
                    <Link
                        href="/budgets"
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center justify-center"
                    >
                        <DollarSign className="h-5 w-5 mr-2" />
                        Budget Comparison
                    </Link>
                    <Link
                        href="/forecast"
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center justify-center"
                    >
                        <TrendingUp className="h-5 w-5 mr-2" />
                        View Forecast
                    </Link>
                    <Link
                        href="/heatmap"
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center justify-center"
                    >
                        <Calendar className="h-5 w-5 mr-2" />
                        View Heatmap
                    </Link>
                    <Link
                        href="/add-expense"
                        className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
                    >
                        <DollarSign className="h-5 w-5 mr-2" />
                        Add New Expense
                    </Link>
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
