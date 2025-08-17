"use client";

import React from "react";
import { SavingsGoal } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
    Edit,
    Trash2,
    PlusCircle,
    Calendar,
    DollarSign,
    Clock,
} from "lucide-react";
import Link from "next/link";

interface SavingsGoalCardProps {
    goal: SavingsGoal;
    onEdit?: () => void;
    onDelete?: () => void;
    onAddContribution?: () => void;
    showActions?: boolean;
}

const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({
    goal,
    onEdit,
    onDelete,
    onAddContribution,
    showActions = true,
}) => {
    // Calculate days remaining text
    const getDaysRemainingText = (days: number) => {
        if (days === 0) return "Due today";
        if (days === 1) return "1 day left";
        return `${days} days left`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {/* Color header */}
            <div className="h-2" style={{ backgroundColor: goal.color }}></div>

            {/* Content */}
            <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {goal.title}
                        </h3>
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 mt-1">
                            {goal.category}
                        </span>
                    </div>

                    {/* Status badge */}
                    {goal.isCompleted ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Completed
                        </span>
                    ) : !goal.isActive ? (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                            Inactive
                        </span>
                    ) : goal.daysRemaining === 0 ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            Due Today
                        </span>
                    ) : (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            Active
                        </span>
                    )}
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">
                            {formatCurrency(goal.currentAmount)} of{" "}
                            {formatCurrency(goal.targetAmount)}
                        </span>
                        <span className="font-medium">
                            {goal.progress.toFixed(0)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="h-2.5 rounded-full"
                            style={{
                                width: `${goal.progress}%`,
                                backgroundColor: goal.color,
                            }}
                        ></div>
                    </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                            <p className="text-xs text-gray-500">Remaining</p>
                            <p className="text-sm font-medium">
                                {formatCurrency(goal.remainingAmount)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                            <p className="text-xs text-gray-500">Target Date</p>
                            <p className="text-sm font-medium">
                                {formatDate(goal.targetDate)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                            <p className="text-xs text-gray-500">Time Left</p>
                            <p className="text-sm font-medium">
                                {goal.isCompleted
                                    ? "Completed"
                                    : getDaysRemainingText(goal.daysRemaining)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                            <p className="text-xs text-gray-500">
                                Daily Target
                            </p>
                            <p className="text-sm font-medium">
                                {goal.isCompleted || goal.daysRemaining === 0
                                    ? "N/A"
                                    : formatCurrency(goal.dailySavingsNeeded)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {goal.description && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {goal.description}
                        </p>
                    </div>
                )}

                {/* Actions */}
                {showActions && (
                    <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex space-x-2">
                            {onEdit && (
                                <button
                                    onClick={onEdit}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={onDelete}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {onAddContribution &&
                            !goal.isCompleted &&
                            goal.isActive && (
                                <button
                                    onClick={onAddContribution}
                                    className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                                >
                                    <PlusCircle className="h-4 w-4 mr-1" />
                                    Add Contribution
                                </button>
                            )}

                        <Link
                            href={`/savings-goals/${goal._id}`}
                            className="text-sm text-gray-600 hover:text-gray-800"
                        >
                            View Details
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavingsGoalCard;
