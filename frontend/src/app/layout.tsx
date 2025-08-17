import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "Personal Expense Tracker",
    description: "Track and manage your personal expenses with ease",
    keywords: "expense tracker, budget, finance, money management",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} font-sans antialiased min-h-screen bg-gray-50`}
            >
                <AuthProvider>
                    <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1">{children}</main>
                    </div>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: "#363636",
                                color: "#fff",
                            },
                            success: {
                                duration: 3000,
                            },
                            error: {
                                duration: 5000,
                            },
                        }}
                    />
                </AuthProvider>
            </body>
        </html>
    );
}
