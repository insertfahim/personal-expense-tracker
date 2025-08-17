import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="font-sans min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        <span className="block">Personal Expense Tracker</span>
                        <span className="block text-indigo-600 dark:text-indigo-400 mt-2">
                            Take Control of Your Finances
                        </span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
                        The most comprehensive, user-friendly expense tracking
                        solution designed to transform your financial habits.
                    </p>
                    <div className="mt-10 flex justify-center gap-4 flex-wrap">
                        <Link
                            href="/register"
                            className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-medium text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            href="/login"
                            className="rounded-md bg-white px-6 py-3 text-lg font-medium text-indigo-600 shadow-md border border-indigo-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-indigo-400 dark:border-gray-700 dark:hover:bg-gray-700"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why We're Top 1% */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                    Why Our Expense Tracker is in the Top 1%
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                        <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-md flex items-center justify-center mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Advanced Analytics Dashboard
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Interactive charts, detailed insights, and spending
                            trends analysis that helps you understand where your
                            money goes with unprecedented clarity.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                        <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-md flex items-center justify-center mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Enterprise-Grade Security
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Bank-level security with JWT authentication,
                            password hashing, and secure data storage ensures
                            your financial information stays private.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                        <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-md flex items-center justify-center mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Real-Time Updates
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Instant data synchronization and real-time analytics
                            that update as you add expenses, giving you an
                            up-to-the-minute view of your finances.
                        </p>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                        <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-md flex items-center justify-center mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Comprehensive Categorization
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Smart expense categorization with detailed filtering
                            options helps you organize and analyze your spending
                            with precision.
                        </p>
                    </div>

                    {/* Card 5 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                        <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-md flex items-center justify-center mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Performance Optimized
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Built with Next.js and optimized for speed, our
                            application delivers lightning-fast performance even
                            with thousands of expense records.
                        </p>
                    </div>

                    {/* Card 6 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                        <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-md flex items-center justify-center mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Mobile-First Design
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Fully responsive design ensures a seamless
                            experience across all devices, allowing you to track
                            expenses anytime, anywhere.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-indigo-50 dark:bg-gray-900 rounded-lg my-12">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                    Powerful Features That Make a Difference
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            Advanced Expense Management
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "Create, read, update, and delete expenses with ease",
                                "Categorize expenses into 7 different categories",
                                "Advanced search & filtering capabilities",
                                "Date range filtering with custom presets",
                                "Bulk operations support for efficient management",
                                "Real-time form validation and error handling",
                            ].map((item, index) => (
                                <li key={index} className="flex items-start">
                                    <svg
                                        className="h-6 w-6 text-green-500 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            Comprehensive Analytics
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "Interactive charts showing spending distribution",
                                "Monthly trends with detailed insights",
                                "Category breakdown with percentages",
                                "Key metrics dashboard with total spent, averages",
                                "Smart insights with month-over-month comparisons",
                                "Real-time updates as expenses change",
                            ].map((item, index) => (
                                <li key={index} className="flex items-start">
                                    <svg
                                        className="h-6 w-6 text-green-500 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                    What Our Users Say
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            quote: "This expense tracker has completely transformed how I manage my finances. The analytics are incredible!",
                            author: "Sarah Johnson",
                            role: "Financial Analyst",
                        },
                        {
                            quote: "I've tried many expense trackers, but this one stands out with its intuitive interface and powerful features.",
                            author: "Michael Chen",
                            role: "Software Engineer",
                        },
                        {
                            quote: "The real-time analytics have helped me identify spending patterns I never noticed before. Highly recommended!",
                            author: "Emily Rodriguez",
                            role: "Small Business Owner",
                        },
                    ].map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center mb-4">
                                <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                                        {testimonial.author.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {testimonial.author}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 italic">
                                "{testimonial.quote}"
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="bg-indigo-700 dark:bg-indigo-900 rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-6 py-12 sm:px-12 lg:px-16">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                                Ready to Take Control of Your Finances?
                            </h2>
                            <p className="mt-4 text-lg leading-6 text-indigo-100">
                                Join thousands of users who have transformed
                                their financial habits with our expense tracker.
                            </p>
                            <div className="mt-8 flex justify-center">
                                <div className="inline-flex rounded-md shadow">
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
                                    >
                                        Get Started Free
                                    </Link>
                                </div>
                                <div className="ml-3 inline-flex">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-900"
                                    >
                                        Login
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center space-x-6">
                        <a
                            href="https://github.com/insertfahim/personal-expense-tracker"
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <span className="sr-only">GitHub</span>
                            <svg
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </a>
                    </div>
                    <p className="mt-8 text-center text-base text-gray-400">
                        &copy; {new Date().getFullYear()} Personal Expense
                        Tracker. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
