import { format, parseISO } from "date-fns";
import { ExpenseCategory } from "@/types";

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};

/**
 * Format date for display
 */
export const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, "MMM dd, yyyy");
};

/**
 * Format date for input field (YYYY-MM-DD)
 */
export const formatDateForInput = (date: string | Date): string => {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, "yyyy-MM-dd");
};

/**
 * Get category color for UI
 */
export const getCategoryColor = (category: ExpenseCategory): string => {
    const colors: Record<ExpenseCategory, string> = {
        Food: "bg-red-100 text-red-800 border-red-200",
        Transport: "bg-blue-100 text-blue-800 border-blue-200",
        Shopping: "bg-purple-100 text-purple-800 border-purple-200",
        Entertainment: "bg-pink-100 text-pink-800 border-pink-200",
        Healthcare: "bg-green-100 text-green-800 border-green-200",
        Bills: "bg-yellow-100 text-yellow-800 border-yellow-200",
        Others: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[category];
};

/**
 * Get category icon
 */
export const getCategoryIcon = (category: ExpenseCategory): string => {
    const icons: Record<ExpenseCategory, string> = {
        Food: "🍽️",
        Transport: "🚗",
        Shopping: "🛒",
        Entertainment: "🎬",
        Healthcare: "🏥",
        Bills: "📄",
        Others: "📦",
    };
    return icons[category];
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Generate random ID
 */
export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
};

/**
 * Get month name from month number
 */
export const getMonthName = (monthNumber: number): string => {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    return months[monthNumber - 1] || "Unknown";
};

/**
 * Truncate text
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};
