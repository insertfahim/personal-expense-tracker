"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { expenseSchema } from "@/lib/validation";
import { useExpenses } from "@/hooks/useExpenses";
import { expenseAPI } from "@/lib/api";
import { ExpenseFormData, ExpenseCategory } from "@/types";
import { formatDateForInput } from "@/lib/utils";
import { Edit, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import toast from "react-hot-toast";

const categories: ExpenseCategory[] = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Healthcare",
    "Bills",
    "Others",
];

export default function EditExpensePage() {
    const router = useRouter();
    const params = useParams();
    const expenseId = params?.id as string;

    const { updateExpense } = useExpenses({ autoFetch: false });
    const [isLoadingExpense, setIsLoadingExpense] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<ExpenseFormData>({
        resolver: yupResolver(expenseSchema),
    });

    useEffect(() => {
        const fetchExpense = async () => {
            if (!expenseId) return;

            try {
                setIsLoadingExpense(true);
                const response = await expenseAPI.getExpenseById(expenseId);

                if (response.success && response.data) {
                    const expenseData = response.data;

                    // Set form values
                    setValue("title", expenseData.title);
                    setValue("amount", expenseData.amount);
                    setValue("category", expenseData.category);
                    setValue(
                        "date",
                        formatDateForInput(new Date(expenseData.date))
                    );
                } else {
                    toast.error("Failed to load expense");
                    router.push("/expenses");
                }
            } catch (error) {
                console.error("Error fetching expense:", error);
                toast.error("Failed to load expense");
                router.push("/expenses");
            } finally {
                setIsLoadingExpense(false);
            }
        };

        fetchExpense();
    }, [expenseId, setValue, router]);

    const onSubmit = async (data: ExpenseFormData) => {
        if (!expenseId) return;

        try {
            const success = await updateExpense(expenseId, data);
            if (success) {
                toast.success("Expense updated successfully!");
                router.push("/expenses");
            }
        } catch (error) {
            console.error("Error updating expense:", error);
            toast.error("Failed to update expense");
        }
    };

    if (isLoadingExpense) {
        return (
            <AuthGuard>
                <div className="min-h-screen bg-gray-50">
                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-2xl mx-auto">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600">
                                    Loading expense...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <Link
                                href="/expenses"
                                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Back to Expenses
                            </Link>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Edit className="h-6 w-6 text-blue-600" />
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Edit Expense
                                </h1>
                            </div>

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                {/* Title Field */}
                                <div>
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Title *
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            {...register("title")}
                                            type="text"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                                            className="block text-sm font-medium text-gray-700 mb-2"
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
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Category *
                                        </label>
                                        <div className="mt-1">
                                            <select
                                                {...register("category")}
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Date *
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            {...register("date")}
                                            type="date"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                        {errors.date && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.date.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isSubmitting
                                            ? "Updating..."
                                            : "Update Expense"}
                                    </button>
                                    <Link
                                        href="/expenses"
                                        className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-center"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
