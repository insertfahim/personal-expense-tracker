const Expense = require("../models/Expense");

// Simple linear regression function
const linearRegression = (x, y) => {
    const n = x.length;

    // Calculate means
    const meanX = x.reduce((sum, val) => sum + val, 0) / n;
    const meanY = y.reduce((sum, val) => sum + val, 0) / n;

    // Calculate slope (m) and y-intercept (b) for the line y = mx + b
    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
        numerator += (x[i] - meanX) * (y[i] - meanY);
        denominator += (x[i] - meanX) * (x[i] - meanX);
    }

    const slope = denominator !== 0 ? numerator / denominator : 0;
    const intercept = meanY - slope * meanX;

    // Calculate R-squared (coefficient of determination)
    let SSres = 0;
    let SStot = 0;

    for (let i = 0; i < n; i++) {
        const prediction = slope * x[i] + intercept;
        SSres += Math.pow(y[i] - prediction, 2);
        SStot += Math.pow(y[i] - meanY, 2);
    }

    const rSquared = SStot !== 0 ? 1 - SSres / SStot : 0;

    return {
        slope,
        intercept,
        rSquared,
        predict: (xValue) => slope * xValue + intercept,
    };
};

// @desc    Get spending forecast
// @route   GET /api/predictive/forecast
// @access  Private
const getForecast = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required for forecast data",
            });
        }

        const { months = 3 } = req.query;
        const forecastMonths = Math.min(parseInt(months), 12); // Limit forecast to 12 months

        // Get user ID from auth middleware
        const userId = req.user._id;

        // Get current date info
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // 1-12

        // Get historical monthly spending data (last 12 months)
        const startDate = new Date(currentYear - 1, currentMonth - 1, 1); // 1 year ago

        const monthlyData = await Expense.aggregate([
            {
                $match: {
                    user: userId,
                    date: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                    },
                    total: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        // Transform data for regression analysis
        const historicalData = [];

        // Fill in any missing months with zeros
        for (let i = 0; i < 12; i++) {
            const targetDate = new Date(startDate);
            targetDate.setMonth(startDate.getMonth() + i);

            const year = targetDate.getFullYear();
            const month = targetDate.getMonth() + 1;

            const existingData = monthlyData.find(
                (item) => item._id.year === year && item._id.month === month
            );

            historicalData.push({
                year,
                month,
                monthIndex: i,
                total: existingData ? existingData.total : 0,
                count: existingData ? existingData.count : 0,
            });
        }

        // Prepare data for regression
        const x = historicalData.map((item) => item.monthIndex);
        const y = historicalData.map((item) => item.total);

        // Calculate regression
        const regression = linearRegression(x, y);

        // Generate forecast for future months
        const forecast = [];

        for (let i = 1; i <= forecastMonths; i++) {
            const forecastDate = new Date(currentYear, currentMonth - 1 + i, 1);
            const forecastYear = forecastDate.getFullYear();
            const forecastMonth = forecastDate.getMonth() + 1;

            const monthName = forecastDate.toLocaleString("default", {
                month: "long",
            });
            const predictedValue = Math.max(
                0,
                regression.predict(x.length + i - 1)
            );

            forecast.push({
                year: forecastYear,
                month: forecastMonth,
                monthName,
                predicted: predictedValue,
            });
        }

        // Get category-based forecast
        const categoryForecasts = [];
        const categories = [
            "Food",
            "Transport",
            "Shopping",
            "Entertainment",
            "Healthcare",
            "Bills",
            "Others",
        ];

        for (const category of categories) {
            // Get historical data for this category
            const categoryData = await Expense.aggregate([
                {
                    $match: {
                        user: userId,
                        category,
                        date: { $gte: startDate },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$date" },
                            month: { $month: "$date" },
                        },
                        total: { $sum: "$amount" },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]);

            // Transform category data
            const categoryHistorical = [];

            for (let i = 0; i < 12; i++) {
                const targetDate = new Date(startDate);
                targetDate.setMonth(startDate.getMonth() + i);

                const year = targetDate.getFullYear();
                const month = targetDate.getMonth() + 1;

                const existingData = categoryData.find(
                    (item) => item._id.year === year && item._id.month === month
                );

                categoryHistorical.push({
                    monthIndex: i,
                    total: existingData ? existingData.total : 0,
                });
            }

            // Calculate regression for this category
            const categoryX = categoryHistorical.map((item) => item.monthIndex);
            const categoryY = categoryHistorical.map((item) => item.total);

            const categoryRegression = linearRegression(categoryX, categoryY);

            // Generate next month forecast for this category
            const nextMonthForecast = Math.max(
                0,
                categoryRegression.predict(categoryX.length)
            );

            categoryForecasts.push({
                category,
                nextMonth: nextMonthForecast,
                trend:
                    categoryRegression.slope > 0 ? "increasing" : "decreasing",
                confidence: categoryRegression.rSquared,
            });
        }

        // Return forecast data
        res.json({
            success: true,
            data: {
                historical: historicalData,
                forecast,
                categoryForecasts,
                confidence: regression.rSquared,
                trend: regression.slope > 0 ? "increasing" : "decreasing",
            },
        });
    } catch (error) {
        console.error("Forecast error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

module.exports = {
    getForecast,
};
