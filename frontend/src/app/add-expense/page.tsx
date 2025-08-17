"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { expenseSchema } from "@/lib/validation";
import { useExpenses } from "@/hooks/useExpenses";
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
    const { createExpense } = useExpenses({ autoFetch: false });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(expenseSchema),
        defaultValues: {
            date: formatDateForInput(new Date()),
            category: "Others",
        },
    });
    const onSubmit = async (data: Record<string, string | number>) => {
        const success = await createExpense(data as unknown as ExpenseFormData);
        if (success) {
            reset();
            router.push("/expenses");
        }
    };
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
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Add New Expense
                            </h1>
                            <p className="text-gray-600">
                                Track your spending by adding a new expense
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white shadow rounded-lg p-6">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Title Field */}
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Title *
                            </label>
                            <div className="mt-1">
                                <input
                                    {...register("title")}
                                    type="text"
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="e.g., Lunch at restaurant, Gas for car"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Amount and Category Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Amount Field */}
                            <div>
                                <label
                                    htmlFor="amount"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Amount ($) *
                                </label>
                                <div className="mt-1">
                                    <input
                                        {...register("amount", {
                                            valueAsNumber: true,
                                        })}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="0.00"
                                    />
                                    {errors.amount && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.amount.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Category Field */}
                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Category *
                                </label>
                                <div className="mt-1">
                                    <select
                                        {...register("category")}
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        {categories.map((category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
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
                            </div>
                        </div>

                        {/* Date Field */}
                        <div>
                            <label
                                htmlFor="date"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Date *
                            </label>
                            <div className="mt-1">
                                <input
                                    {...register("date")}
                                    type="date"
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {errors.date && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.date.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting
                                    ? "Adding Expense..."
                                    : "Add Expense"}
                            </button>
                            <button
                                type="button"
                                onClick={() => reset()}
                                className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Clear Form
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tips */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">
                        Tips for better expense tracking:
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>
                            • Be specific with titles (e.g., &quot;Grocery
                            shopping at Walmart&quot; vs &quot;Shopping&quot;)
                        </li>
                        <li>
                            • Choose the most appropriate category for better
                            analytics
                        </li>
                        <li>
                            • Add expenses as soon as possible to avoid
                            forgetting
                        </li>
                        <li>• Double-check amounts for accuracy</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
