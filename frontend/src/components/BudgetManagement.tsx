"use client";

import React, { useState } from "react";
import { Budget, BudgetFormData } from "@/types";
import { useBudgets } from "@/hooks/useBudgets";
import BudgetForm from "./BudgetForm";
import { Edit, Trash2, Plus, AlertTriangle } from "lucide-react";

interface BudgetManagementProps {
    year?: number;
    month?: number;
}

const BudgetManagement: React.FC<BudgetManagementProps> = ({ year, month }) => {
    const [showForm, setShowForm] = useState(false);
    const [editingBudget, setEditingBudget] = useState<Budget | undefined>(
        undefined
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
        null
    );

    const {
        budgets,
        isLoading,
        error,
        createBudget,
        updateBudget,
        deleteBudget,
    } = useBudgets({
        year,
        month,
        autoFetch: true,
    });

    const handleCreateBudget = async (data: BudgetFormData) => {
        setIsSubmitting(true);
        try {
            const success = await createBudget(data);
            if (success) {
                setShowForm(false);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateBudget = async (data: BudgetFormData) => {
        if (!editingBudget) return;

        setIsSubmitting(true);
        try {
            const success = await updateBudget(editingBudget._id, data);
            if (success) {
                setEditingBudget(undefined);
                setShowForm(false);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteBudget = async (id: string) => {
        await deleteBudget(id);
        setShowDeleteConfirm(null);
    };

    const handleEditClick = (budget: Budget) => {
        setEditingBudget(budget);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingBudget(undefined);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-medium">Error loading budgets</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Budget Management
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Set and manage your budget targets
                    </p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Budget
                    </button>
                )}
            </div>

            {showForm && (
                <div className="p-6 border-b border-gray-200">
                    <BudgetForm
                        onSubmit={
                            editingBudget
                                ? handleUpdateBudget
                                : handleCreateBudget
                        }
                        onCancel={handleCancelForm}
                        initialData={editingBudget}
                        isSubmitting={isSubmitting}
                    />
                </div>
            )}

            <div className="px-6 py-4">
                {budgets.length === 0 ? (
                    <div className="text-center py-8">
                        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            No Budgets Set
                        </h3>
                        <p className="text-gray-600 mb-4">
                            You haven't set any budgets yet. Create a budget to
                            track your spending.
                        </p>
                        {!showForm && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create First Budget
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Category
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Amount
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Period
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {budgets.map((budget) => (
                                    <tr
                                        key={budget._id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {budget.category}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                ${budget.amount.toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {budget.period === "monthly"
                                                    ? `${new Date(
                                                          0,
                                                          budget.month! - 1
                                                      ).toLocaleString(
                                                          "default",
                                                          { month: "long" }
                                                      )} ${budget.year}`
                                                    : `${budget.year} (Yearly)`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    budget.active
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {budget.active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {showDeleteConfirm ===
                                            budget._id ? (
                                                <div className="flex items-center justify-end space-x-2">
                                                    <span className="text-xs text-red-600">
                                                        Confirm?
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteBudget(
                                                                budget._id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Yes
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setShowDeleteConfirm(
                                                                null
                                                            )
                                                        }
                                                        className="text-gray-600 hover:text-gray-900"
                                                    >
                                                        No
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-end space-x-3">
                                                    <button
                                                        onClick={() =>
                                                            handleEditClick(
                                                                budget
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setShowDeleteConfirm(
                                                                budget._id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BudgetManagement;
