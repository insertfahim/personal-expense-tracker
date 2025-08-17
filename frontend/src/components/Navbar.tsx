"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { User, LogOut, BarChart3, PlusCircle, Menu } from "lucide-react";
import { useState } from "react";

const Navbar: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-lg border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3">
                            <BarChart3 className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">
                                ExpenseTracker
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/expenses"
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Expenses
                        </Link>
                        <Link
                            href="/analytics"
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Analytics
                        </Link>
                        <Link
                            href="/add-expense"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                            <PlusCircle className="h-4 w-4" />
                            <span>Add Expense</span>
                        </Link>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <User className="h-5 w-5 text-gray-500" />
                                    <span className="text-sm text-gray-700">
                                        {user?.username || user?.email}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 border-t">
                            <Link
                                href="/"
                                className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/expenses"
                                className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Expenses
                            </Link>
                            <Link
                                href="/analytics"
                                className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Analytics
                            </Link>
                            <Link
                                href="/add-expense"
                                className="block bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Add Expense
                            </Link>

                            {/* Mobile User Menu */}
                            {isAuthenticated ? (
                                <div className="border-t pt-4 mt-4">
                                    <div className="flex items-center px-3 py-2">
                                        <User className="h-5 w-5 text-gray-500 mr-2" />
                                        <span className="text-base text-gray-700">
                                            {user?.username || user?.email}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        <LogOut className="h-4 w-4 inline mr-2" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="border-t pt-4 mt-4 space-y-1">
                                    <Link
                                        href="/login"
                                        className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
