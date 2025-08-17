"use client";

import React, { useState, useEffect } from "react";
import { SavingsGoalFormData, SavingsGoal, SavingsGoalCategory } from "@/types";
import { X } from "lucide-react";

interface SavingsGoalFormProps {
    onSubmit: (data: SavingsGoalFormData) => Promise<void>;
    onCancel: () => void;
    initialData?: SavingsGoal;
    isSubmitting: boolean;
}

const GOAL_CATEGORIES: SavingsGoalCategory[] = [
    "Emergency",
    "Vacation",
    "Education",
    "Home",
    "Vehicle",
    "Retirement",
    "Investment",
    "Debt",
    "Others",
];

const COLOR_OPTIONS = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
    "#F97316", // Orange
    "#EC4899", // Pink
    "#6B7280", // Gray
];

const SavingsGoalForm: React.FC<SavingsGoalFormProps> = ({
    onSubmit,
    onCancel,
    initialData,
    isSubmitting,
}) => {
    const today = new Date().toISOString().split("T")[0];
    const defaultTargetDate = new Date();
    defaultTargetDate.setMonth(defaultTargetDate.getMonth() + 3); // Default target 3 months from now

    const [formData, setFormData] = useState<SavingsGoalFormData>({
        title: initialData?.title || "",
        targetAmount: initialData?.targetAmount || 0,
        currentAmount: initialData?.currentAmount || 0,
        startDate: initialData?.startDate
            ? initialData.startDate.split("T")[0]
            : today,
        targetDate: initialData?.targetDate
            ? initialData.targetDate.split("T")[0]
            : defaultTargetDate.toISOString().split("T")[0],
        category: initialData?.category || "Others",
        description: initialData?.description || "",
        color: initialData?.color || COLOR_OPTIONS[0],
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Update form when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                targetAmount: initialData.targetAmount,
                currentAmount: initialData.currentAmount,
                startDate: initialData.startDate.split("T")[0],
                targetDate: initialData.targetDate.split("T")[0],
                category: initialData.category,
                description: initialData.description || "",
                color: initialData.color,
            });
        }
    }, [initialData]);

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!formData.targetAmount || formData.targetAmount <= 0) {
            newErrors.targetAmount = "Target amount must be greater than zero";
        }

        if (formData.currentAmount && formData.currentAmount < 0) {
            newErrors.currentAmount = "Current amount cannot be negative";
        }

        if (!formData.targetDate) {
            newErrors.targetDate = "Target date is required";
        } else if (
            formData.startDate &&
            new Date(formData.targetDate) <= new Date(formData.startDate)
        ) {
            newErrors.targetDate = "Target date must be after start date";
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
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type } = e.target;

        // Handle different input types
        if (type === "number") {
            setFormData({
                ...formData,
                [name]: parseFloat(value) || 0,
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
                    {initialData
                        ? "Edit Savings Goal"
                        : "Create New Savings Goal"}
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
                    {/* Title */}
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Goal Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="e.g., Emergency Fund, Vacation to Hawaii"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Target Amount */}
                    <div>
                        <label
                            htmlFor="targetAmount"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Target Amount
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">
                                    $
                                </span>
                            </div>
                            <input
                                type="number"
                                name="targetAmount"
                                id="targetAmount"
                                value={formData.targetAmount}
                                onChange={handleChange}
                                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </div>
                        {errors.targetAmount && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.targetAmount}
                            </p>
                        )}
                    </div>

                    {/* Current Amount (only for new goals) */}
                    {!initialData && (
                        <div>
                            <label
                                htmlFor="currentAmount"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Initial Contribution (Optional)
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">
                                        $
                                    </span>
                                </div>
                                <input
                                    type="number"
                                    name="currentAmount"
                                    id="currentAmount"
                                    value={formData.currentAmount}
                                    onChange={handleChange}
                                    className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            {errors.currentAmount && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.currentAmount}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="startDate"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                id="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                max={formData.targetDate}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="targetDate"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Target Date
                            </label>
                            <input
                                type="date"
                                name="targetDate"
                                id="targetDate"
                                value={formData.targetDate}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                min={formData.startDate}
                            />
                            {errors.targetDate && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.targetDate}
                                </p>
                            )}
                        </div>
                    </div>

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
                        >
                            {GOAL_CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Color
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {COLOR_OPTIONS.map((color) => (
                                <div
                                    key={color}
                                    onClick={() =>
                                        setFormData({ ...formData, color })
                                    }
                                    className={`w-8 h-8 rounded-full cursor-pointer ${
                                        formData.color === color
                                            ? "ring-2 ring-offset-2 ring-blue-500"
                                            : ""
                                    }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description (Optional)
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Add notes about your savings goal..."
                        />
                    </div>
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

export default SavingsGoalForm;
