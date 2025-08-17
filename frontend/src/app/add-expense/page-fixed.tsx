"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { expenseSchema } from "@/lib/validation";
import { useExpenses } from "@/hooks/useExpenses";
import { useAuth } from "@/context/AuthContext";
import { ExpenseFormData, ExpenseCategory } from "@/types";
import { formatDateForInput } from "@/lib/utils";
import { PlusCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const categories: ExpenseCategory[] = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Healthcare",
    "Bills",
    "Others",
];

export default function AddExpensePage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const { createExpense } = useExpenses({ autoFetch: false });

    // Always call hooks at the top level
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ExpenseFormData>({
        resolver: yupResolver(expenseSchema),
        defaultValues: {
            date: formatDateForInput(new Date()),
            category: "Others" as ExpenseCategory,
        },
    });

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    const onSubmit = async (data: ExpenseFormData) => {
        try {
            const success = await createExpense(data);
            if (success) {
                reset();
                router.push("/expenses");
            }
        } catch (error) {
            console.error("Error creating expense:", error);
        }
    };

    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render the form if not authenticated (will redirect)
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center space-x-3">
                        <PlusCircle className="h-8 w-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Add New Expense
                        </h1>
                    </div>
                    <p className="mt-2 text-gray-600">
                        Record a new expense to keep track of your spending
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="px-6 py-8">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {/* Title */}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Title{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register("title")}
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="e.g., Grocery shopping, Coffee, etc."
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            {/* Amount */}
                            <div>
                                <label
                                    htmlFor="amount"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Amount{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-500">
                                        $
                                    </span>
                                    <input
                                        {...register("amount", {
                                            setValueAs: (value) =>
                                                value === ""
                                                    ? ""
                                                    : Number(value),
                                        })}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.amount && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.amount.message}
                                    </p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Category{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register("category")}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                >
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.category.message}
                                    </p>
                                )}
                            </div>

                            {/* Date */}
                            <div>
                                <label
                                    htmlFor="date"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register("date")}
                                    type="date"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                                {errors.date && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.date.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Adding...</span>
                                        </div>
                                    ) : (
                                        "Add Expense"
                                    )}
                                </button>
                                <Link
                                    href="/expenses"
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium text-center"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>

                    {/* Tips Section */}
                    <div className="bg-gray-50 px-6 py-4 border-t">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                            💡 Quick Tips
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Be descriptive with your expense titles</li>
                            <li>• Choose the most appropriate category</li>
                            <li>• Enter the exact amount you spent</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
