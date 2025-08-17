"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useExpenses } from "@/hooks/useExpenses";
import AuthGuard from "@/components/AuthGuard";
import {
    formatCurrency,
    formatDate,
    getCategoryColor,
    getCategoryIcon,
} from "@/lib/utils";
import { ExpenseCategory } from "@/types";
import {
    PlusCircle,
    Search,
    Filter,
    Edit,
    Trash2,
    ArrowLeft,
    Calendar,
    DollarSign,
} from "lucide-react";

const categories: ExpenseCategory[] = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Healthcare",
    "Bills",
    "Others",
];

export default function ExpensesPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const { expenses, totalAmount, pagination, isLoading, deleteExpense } =
        useExpenses({
            category: selectedCategory === "all" ? undefined : selectedCategory,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            limit: 20,
        });

    // Filter expenses by search term
    const filteredExpenses = expenses.filter((expense) =>
        expense.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteExpense = async (id: string) => {
        if (confirm("Are you sure you want to delete this expense?")) {
            await deleteExpense(id);
        }
    };

    const setDateRange = (days: number) => {
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - days);

        setStartDate(startDate.toISOString().split("T")[0]);
        setEndDate(today.toISOString().split("T")[0]);
    };

    const setCurrentMonth = () => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        setStartDate(startOfMonth.toISOString().split("T")[0]);
        setEndDate(today.toISOString().split("T")[0]);
    };

    if (isLoading && expenses.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">
                                Loading expenses...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Expenses
                                </h1>
                                <p className="text-gray-600">
                                    Manage and track all your expenses
                                </p>
                            </div>
                            <Link
                                href="/add-expense"
                                className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <PlusCircle className="h-5 w-5 mr-2" />
                                Add Expense
                            </Link>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center">
                                <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Total Amount
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(totalAmount)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center">
                                <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Total Expenses
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {filteredExpenses.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center">
                                <Filter className="h-8 w-8 text-purple-600 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Average
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {filteredExpenses.length > 0
                                            ? formatCurrency(
                                                  totalAmount /
                                                      filteredExpenses.length
                                              )
                                            : "$0.00"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <div className="flex flex-col space-y-4">
                            {/* First Row: Search and Category */}
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* Search */}
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search expenses..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Category Filter */}
                                <div className="lg:w-64">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) =>
                                            setSelectedCategory(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">
                                            All Categories
                                        </option>
                                        {categories.map((category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Second Row: Date Range Filters */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-700">
                                        Date Range:
                                    </span>
                                </div>

                                {/* Start Date */}
                                <div className="flex items-center gap-2">
                                    <label
                                        htmlFor="startDate"
                                        className="text-sm text-gray-600"
                                    >
                                        From:
                                    </label>
                                    <input
                                        id="startDate"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) =>
                                            setStartDate(e.target.value)
                                        }
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>

                                {/* End Date */}
                                <div className="flex items-center gap-2">
                                    <label
                                        htmlFor="endDate"
                                        className="text-sm text-gray-600"
                                    >
                                        To:
                                    </label>
                                    <input
                                        id="endDate"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) =>
                                            setEndDate(e.target.value)
                                        }
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>

                                {/* Clear Date Filters Button */}
                                {(startDate || endDate) && (
                                    <button
                                        onClick={() => {
                                            setStartDate("");
                                            setEndDate("");
                                        }}
                                        className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        Clear Dates
                                    </button>
                                )}
                            </div>

                            {/* Quick Date Presets */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    Quick select:
                                </span>
                                <button
                                    onClick={() => setDateRange(7)}
                                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                                >
                                    Last 7 days
                                </button>
                                <button
                                    onClick={() => setDateRange(30)}
                                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                                >
                                    Last 30 days
                                </button>
                                <button
                                    onClick={() => setCurrentMonth()}
                                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                                >
                                    This month
                                </button>
                                <button
                                    onClick={() => setDateRange(90)}
                                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                                >
                                    Last 3 months
                                </button>
                            </div>

                            {/* Filter Summary */}
                            {(selectedCategory !== "all" ||
                                startDate ||
                                endDate ||
                                searchTerm) && (
                                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
                                    <span className="text-sm text-gray-600">
                                        Active filters:
                                    </span>
                                    {selectedCategory !== "all" && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                            Category: {selectedCategory}
                                        </span>
                                    )}
                                    {startDate && (
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                            From:{" "}
                                            {new Date(
                                                startDate
                                            ).toLocaleDateString()}
                                        </span>
                                    )}
                                    {endDate && (
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                            To:{" "}
                                            {new Date(
                                                endDate
                                            ).toLocaleDateString()}
                                        </span>
                                    )}
                                    {searchTerm && (
                                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                            Search: &quot;{searchTerm}&quot;
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Expenses List */}
                    {filteredExpenses.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                No expenses found
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {expenses.length === 0
                                    ? "Start tracking your expenses by adding your first expense."
                                    : "No expenses match your current filters. Try adjusting your search term, category, or date range."}
                            </p>
                            <Link
                                href="/add-expense"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <PlusCircle className="h-5 w-5 mr-2" />
                                {expenses.length === 0
                                    ? "Add Your First Expense"
                                    : "Add New Expense"}
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Expense
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredExpenses.map((expense) => (
                                            <tr
                                                key={expense._id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {expense.title}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <span className="text-lg mr-2">
                                                            {getCategoryIcon(
                                                                expense.category
                                                            )}
                                                        </span>
                                                        <span
                                                            className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                                                                expense.category
                                                            )}`}
                                                        >
                                                            {expense.category}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {formatCurrency(
                                                            expense.amount
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600">
                                                        {formatDate(
                                                            expense.date
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Link
                                                            href={`/expenses/${expense._id}/edit`}
                                                            className="text-blue-600 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteExpense(
                                                                    expense._id
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.pages > 1 && (
                                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                            Previous
                                        </button>
                                        <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                            Next
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Showing{" "}
                                                <span className="font-medium">
                                                    {(pagination.current - 1) *
                                                        20 +
                                                        1}
                                                </span>{" "}
                                                to{" "}
                                                <span className="font-medium">
                                                    {Math.min(
                                                        pagination.current * 20,
                                                        pagination.total
                                                    )}
                                                </span>{" "}
                                                of{" "}
                                                <span className="font-medium">
                                                    {pagination.total}
                                                </span>{" "}
                                                results
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}
