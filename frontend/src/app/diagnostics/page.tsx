"use client";

import React, { useState, useEffect } from "react";

export default function DiagnosticsPage() {
    const [apiUrl, setApiUrl] = useState("");
    const [healthCheck, setHealthCheck] = useState<Record<
        string,
        unknown
    > | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const envApiUrl = process.env.NEXT_PUBLIC_API_URL || "Not set";
        const currentDomain =
            typeof window !== "undefined" ? window.location.origin : "Unknown";
        setApiUrl(
            `Environment: ${envApiUrl} | Current Domain: ${currentDomain}`
        );
    }, []);

    const getApiUrl = () => {
        // For production, use relative URLs to work with the current domain
        if (typeof window !== "undefined") {
            const origin = window.location.origin;
            return origin;
        }
        // Fallback to environment variable or localhost
        return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    };

    const testHealthCheck = async () => {
        try {
            setError("");
            setHealthCheck(null);

            const baseUrl = getApiUrl();
            const url = `${baseUrl}/api/health`;

            console.log("Testing health check at:", url);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}: ${response.statusText}`
                );
            }

            const data = await response.json();
            setHealthCheck(data);
        } catch (err) {
            console.error("Health check error:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    };

    const testLoginApi = async () => {
        try {
            setError("");
            setHealthCheck(null);

            const baseUrl = getApiUrl();
            const url = `${baseUrl}/api/auth/login`;

            console.log("Testing login API at:", url);

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email: "test@example.com",
                    password: "wrongpassword",
                }),
            });

            const data = await response.json();
            console.log("Login test response:", data);

            setHealthCheck({
                loginTest: data,
                status: response.status,
                url: url,
            });
        } catch (err) {
            console.error("Login test error:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    };

    const testApiRoot = async () => {
        try {
            setError("");
            setHealthCheck(null);

            const baseUrl = getApiUrl();
            const url = `${baseUrl}/api/`;

            console.log("Testing API root at:", url);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}: ${response.statusText}`
                );
            }

            const data = await response.json();
            setHealthCheck({
                apiRoot: data,
                status: response.status,
                url: url,
            });
        } catch (err) {
            console.error("API root test error:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    API Diagnostics
                </h1>

                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Environment Information
                    </h2>
                    <div className="space-y-2">
                        <p>
                            <strong>API URL:</strong> {apiUrl}
                        </p>
                        <p>
                            <strong>Environment:</strong> {process.env.NODE_ENV}
                        </p>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">API Tests</h2>
                    <div className="space-y-4">
                        <button
                            onClick={testApiRoot}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                        >
                            Test API Root
                        </button>
                        <button
                            onClick={testHealthCheck}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ml-4"
                        >
                            Test Health Check
                        </button>
                        <button
                            onClick={testLoginApi}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 ml-4"
                        >
                            Test Login Endpoint
                        </button>
                        <div className="mt-4 text-sm text-gray-600">
                            <p>
                                <strong>Current Test URL:</strong>{" "}
                                {typeof window !== "undefined"
                                    ? window.location.origin
                                    : "Loading..."}
                                /api
                            </p>
                            <p>
                                <strong>Browser:</strong>{" "}
                                {typeof window !== "undefined"
                                    ? navigator.userAgent.substring(0, 100) +
                                      "..."
                                    : "Loading..."}
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <h3 className="text-red-800 font-semibold">Error</h3>
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {healthCheck && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="text-green-800 font-semibold">
                            Response
                        </h3>
                        <pre className="text-sm text-green-600 mt-2 overflow-auto">
                            {JSON.stringify(healthCheck, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
