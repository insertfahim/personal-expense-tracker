"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { BarChart3, PieChart, CreditCard, DollarSign } from "lucide-react";

export default function Dashboard() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center">
                        <div className="mb-8">
                            <BarChart3 className="h-20 w-20 text-blue-600 mx-auto mb-4" />
                            <h1 className="text-5xl font-bold text-gray-900 mb-4">
                                Personal Expense Tracker
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Take control of your finances. Track expenses,
                                analyze spending patterns, and make informed
                                financial decisions with our intuitive expense
                                tracker.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Link
                                href="/register"
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                href="/login"
                                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
                            >
                                Sign In
                            </Link>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">
                                    Track Expenses
                                </h3>
                                <p className="text-gray-600">
                                    Easily add, edit, and categorize your daily
                                    expenses
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <PieChart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">
                                    Visual Analytics
                                </h3>
                                <p className="text-gray-600">
                                    Beautiful charts and graphs to understand
                                    your spending
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">
                                    Budget Management
                                </h3>
                                <p className="text-gray-600">
                                    Set budgets and monitor your spending
                                    patterns
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-center">
                            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                                Total Expenses
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                $0.00
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
                                0
                            </p>
                        </div>
                    </div>

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
                </div>

                <div className="text-center text-gray-600">
                    <p>Start by adding your first expense!</p>
                </div>
            </div>
        </div>
    );
}
