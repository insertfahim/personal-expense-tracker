"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { savingsGoalsAPI } from "@/lib/api";
import { SavingsGoal, SavingsGoalFormData } from "@/types";
import SavingsGoalForm from "@/components/SavingsGoalForm";
import AuthGuard from "@/components/AuthGuard";

interface EditSavingsGoalPageProps {
    params: {
        id: string;
    };
}

const EditSavingsGoalPage: React.FC<EditSavingsGoalPageProps> = ({
    params,
}) => {
    const router = useRouter();
    const { id } = params;

    const [goal, setGoal] = useState<SavingsGoal | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch goal details
    useEffect(() => {
        const fetchGoal = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await savingsGoalsAPI.getSavingsGoalById(id);

                if (response.success && response.data) {
                    setGoal(response.data);
                } else {
                    setError(
                        response.message || "Failed to fetch goal details"
                    );
                }
            } catch (err: unknown) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch goal details";
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGoal();
    }, [id]);

    // Handle update goal
    const handleUpdateGoal = async (data: SavingsGoalFormData) => {
        setIsSubmitting(true);
        try {
            const response = await savingsGoalsAPI.updateSavingsGoal(id, data);

            if (response.success) {
                router.push(`/savings-goals/${id}`);
            } else {
                setError(response.message || "Failed to update goal");
            }
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to update goal";
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        router.push(`/savings-goals/${id}`);
    };

    if (isLoading) {
        return (
            <AuthGuard>
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    </div>
                </div>
            </AuthGuard>
        );
    }

    if (error || !goal) {
        return (
            <AuthGuard>
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <div className="flex">
                                <AlertTriangle className="h-5 w-5 mr-2" />
                                <div>
                                    <p className="font-medium">
                                        Error loading savings goal
                                    </p>
                                    <p className="text-sm">
                                        {error || "Goal not found"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link
                                href="/savings-goals"
                                className="inline-flex items-center text-blue-600 hover:text-blue-700"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Savings Goals
                            </Link>
                        </div>
                    </div>
                </div>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href={`/savings-goals/${id}`}
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Goal Details
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Edit Savings Goal
                        </h1>
                    </div>

                    {/* Form */}
                    <div className="max-w-2xl mx-auto">
                        <SavingsGoalForm
                            initialData={goal}
                            onSubmit={handleUpdateGoal}
                            onCancel={handleCancel}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
};

export default EditSavingsGoalPage;
