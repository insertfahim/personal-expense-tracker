"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useExpenses } from "@/hooks/useExpenses";
import {
    BarChart3,
    DollarSign,
    LineChart,
    Shield,
    Clock,
    Filter,
    Zap,
    Smartphone,
    Target,
} from "lucide-react";

export default function Dashboard() {
    const { isAuthenticated } = useAuth();
    const { expenses, totalAmount, isLoading } = useExpenses({
        autoFetch: isAuthenticated,
    });

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                {/* Hero Section */}
                <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            <span className="block">
                                Personal Expense Tracker
                            </span>
                            <span className="block text-indigo-600 dark:text-indigo-400 mt-2">
                                Take Control of Your Finances
                            </span>
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
                            The most comprehensive, user-friendly expense
                            tracking solution designed to transform your
                            financial habits.
                        </p>
                        <div className="mt-10 flex justify-center gap-4 flex-wrap">
                            <Link
                                href="/register"
                                className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-medium text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                href="/login"
                                className="rounded-md bg-white px-6 py-3 text-lg font-medium text-indigo-600 shadow-md border border-indigo-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-indigo-400 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Why We're Top 1% */}
                <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Why Our Expense Tracker is in the Top 1%
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-md flex items-center justify-center mb-4">
                                <LineChart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Advanced Analytics Dashboard
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Interactive charts, detailed insights, and
                                spending trends analysis that helps you
                                understand where your money goes with
                                unprecedented clarity.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-md flex items-center justify-center mb-4">
                                <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Enterprise-Grade Security
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Bank-level security with JWT authentication,
                                password hashing, and secure data storage
                                ensures your financial information stays
                                private.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-md flex items-center justify-center mb-4">
                                <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Real-Time Updates
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Instant data synchronization and real-time
                                analytics that update as you add expenses,
                                giving you an up-to-the-minute view of your
                                finances.
                            </p>
                        </div>

                        {/* Card 4 */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-md flex items-center justify-center mb-4">
                                <Filter className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Comprehensive Categorization
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Smart expense categorization with detailed
                                filtering options helps you organize and analyze
                                your spending with precision.
                            </p>
                        </div>

                        {/* Card 5 */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-md flex items-center justify-center mb-4">
                                <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Performance Optimized
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Built with Next.js and optimized for speed, our
                                application delivers lightning-fast performance
                                even with thousands of expense records.
                            </p>
                        </div>

                        {/* Card 6 */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-md flex items-center justify-center mb-4">
                                <Smartphone className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Mobile-First Design
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Fully responsive design ensures a seamless
                                experience across all devices, allowing you to
                                track expenses anytime, anywhere.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-indigo-50 dark:bg-gray-900 rounded-lg my-12">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Powerful Features That Make a Difference
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                Advanced Expense Management
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    "Create, read, update, and delete expenses with ease",
                                    "Categorize expenses into 7 different categories",
                                    "Advanced search & filtering capabilities",
                                    "Date range filtering with custom presets",
                                    "Bulk operations support for efficient management",
                                    "Real-time form validation and error handling",
                                ].map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start"
                                    >
                                        <svg
                                            className="h-6 w-6 text-green-500 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                Comprehensive Analytics
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    "Interactive charts showing spending distribution",
                                    "Monthly trends with detailed insights",
                                    "Category breakdown with percentages",
                                    "Key metrics dashboard with total spent, averages",
                                    "Smart insights with month-over-month comparisons",
                                    "Real-time updates as expenses change",
                                ].map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start"
                                    >
                                        <svg
                                            className="h-6 w-6 text-green-500 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        What Our Users Say
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "This expense tracker has completely transformed how I manage my finances. The analytics are incredible!",
                                author: "Sarah Johnson",
                                role: "Financial Analyst",
                            },
                            {
                                quote: "I've tried many expense trackers, but this one stands out with its intuitive interface and powerful features.",
                                author: "Michael Chen",
                                role: "Software Engineer",
                            },
                            {
                                quote: "The real-time analytics have helped me identify spending patterns I never noticed before. Highly recommended!",
                                author: "Emily Rodriguez",
                                role: "Small Business Owner",
                            },
                        ].map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                                            {testimonial.author.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {testimonial.author}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 italic">
                                    &quot;{testimonial.quote}&quot;
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="bg-indigo-700 dark:bg-indigo-900 rounded-2xl shadow-xl overflow-hidden">
                        <div className="px-6 py-12 sm:px-12 lg:px-16">
                            <div className="max-w-3xl mx-auto text-center">
                                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                                    Ready to Take Control of Your Finances?
                                </h2>
                                <p className="mt-4 text-lg leading-6 text-indigo-100">
                                    Join thousands of users who have transformed
                                    their financial habits with our expense
                                    tracker.
                                </p>
                                <div className="mt-8 flex justify-center">
                                    <div className="inline-flex rounded-md shadow">
                                        <Link
                                            href="/register"
                                            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
                                        >
                                            Get Started Free
                                        </Link>
                                    </div>
                                    <div className="ml-3 inline-flex">
                                        <Link
                                            href="/login"
                                            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-900"
                                        >
                                            Login
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Welcome to your expense tracker dashboard
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-center">
                            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                                Total Expenses
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isLoading
                                    ? "Loading..."
                                    : `$${totalAmount.toFixed(2)}`}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-center">
                            <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                                Transactions
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isLoading ? "Loading..." : expenses.length}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-center">
                            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                                Savings Goals
                            </p>
                            <Link
                                href="/savings-goals"
                                className="text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Manage Goals
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-center">
                            <Link
                                href="/add-expense"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                            >
                                Add Expense
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-center">
                            <Link
                                href="/expenses"
                                className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors inline-block"
                            >
                                View Expenses
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-center">
                            <Link
                                href="/analytics"
                                className="border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors inline-block"
                            >
                                View Analytics
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="text-center text-gray-600">
                    {isLoading ? (
                        <p>Loading your expenses...</p>
                    ) : expenses.length === 0 ? (
                        <p>Start by adding your first expense!</p>
                    ) : (
                        <p>Keep tracking your expenses to stay on budget!</p>
                    )}
                </div>
            </div>
        </div>
    );
}
