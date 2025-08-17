"use client";

import React, { useState, useEffect } from "react";
import { BudgetFormData, Budget, ExpenseCategory } from "@/types";
import { X } from "lucide-react";

interface BudgetFormProps {
    onSubmit: (data: BudgetFormData) => Promise<void>;
    onCancel: () => void;
    initialData?: Budget;
    isSubmitting: boolean;
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Healthcare",
    "Bills",
    "Others",
];

const MONTHS = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
];

const BudgetForm: React.FC<BudgetFormProps> = ({
    onSubmit,
    onCancel,
    initialData,
    isSubmitting,
}) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [formData, setFormData] = useState<BudgetFormData>({
        category: initialData?.category || "Food",
        amount: initialData?.amount || 0,
        period: initialData?.period || "monthly",
        month: initialData?.month || currentMonth,
        year: initialData?.year || currentYear,
        active: initialData?.active !== false, // default to true if not specified
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Update form when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                category: initialData.category,
                amount: initialData.amount,
                period: initialData.period,
                month: initialData.month || currentMonth,
                year: initialData.year,
                active: initialData.active,
            });
        }
    }, [initialData, currentMonth]);

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.category) {
            newErrors.category = "Category is required";
        }

        if (!formData.amount || formData.amount <= 0) {
            newErrors.amount = "Amount must be greater than zero";
        }

        if (!formData.period) {
            newErrors.period = "Period is required";
        }

        if (formData.period === "monthly" && !formData.month) {
            newErrors.month = "Month is required for monthly budgets";
        }

        if (!formData.year) {
            newErrors.year = "Year is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            await onSubmit(formData);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        // Handle different input types
        if (type === "number") {
            setFormData({
                ...formData,
                [name]: parseFloat(value) || 0,
            });
        } else if (name === "active") {
            setFormData({
                ...formData,
                active: (e.target as HTMLInputElement).checked,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    {initialData ? "Edit Budget" : "Create New Budget"}
                </h2>
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    {/* Category */}
                    <div>
                        <label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            disabled={!!initialData} // Can't change category when editing
                        >
                            {EXPENSE_CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.category}
                            </p>
                        )}
                    </div>

                    {/* Amount */}
                    <div>
                        <label
                            htmlFor="amount"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Budget Amount
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">
                                    $
                                </span>
                            </div>
                            <input
                                type="number"
                                name="amount"
                                id="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </div>
                        {errors.amount && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.amount}
                            </p>
                        )}
                    </div>

                    {/* Period */}
                    <div>
                        <label
                            htmlFor="period"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Budget Period
                        </label>
                        <select
                            id="period"
                            name="period"
                            value={formData.period}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            disabled={!!initialData} // Can't change period when editing
                        >
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        {errors.period && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.period}
                            </p>
                        )}
                    </div>

                    {/* Month (only for monthly budgets) */}
                    {formData.period === "monthly" && (
                        <div>
                            <label
                                htmlFor="month"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Month
                            </label>
                            <select
                                id="month"
                                name="month"
                                value={formData.month}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                disabled={!!initialData} // Can't change month when editing
                            >
                                {MONTHS.map((month) => (
                                    <option
                                        key={month.value}
                                        value={month.value}
                                    >
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                            {errors.month && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.month}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Year */}
                    <div>
                        <label
                            htmlFor="year"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Year
                        </label>
                        <select
                            id="year"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            disabled={!!initialData} // Can't change year when editing
                        >
                            {Array.from(
                                { length: 5 },
                                (_, i) => currentYear - 2 + i
                            ).map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                        {errors.year && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.year}
                            </p>
                        )}
                    </div>

                    {/* Active status (only for editing) */}
                    {initialData && (
                        <div className="flex items-center">
                            <input
                                id="active"
                                name="active"
                                type="checkbox"
                                checked={formData.active}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="active"
                                className="ml-2 block text-sm text-gray-700"
                            >
                                Active
                            </label>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {isSubmitting
                            ? "Saving..."
                            : initialData
                            ? "Update"
                            : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BudgetForm;
