const axios = require("axios");

const sampleExpenses = [
    {
        title: "Grocery Shopping",
        amount: 85.5,
        category: "Food",
        date: "2024-08-15",
    },
    {
        title: "Gas Station",
        amount: 45.0,
        category: "Transport",
        date: "2024-08-14",
    },
    {
        title: "Movie Tickets",
        amount: 28.0,
        category: "Entertainment",
        date: "2024-08-13",
    },
    {
        title: "Coffee Shop",
        amount: 12.5,
        category: "Food",
        date: "2024-08-12",
    },
    {
        title: "Clothing Store",
        amount: 120.0,
        category: "Shopping",
        date: "2024-08-11",
    },
    {
        title: "Electric Bill",
        amount: 95.0,
        category: "Bills",
        date: "2024-08-10",
    },
    {
        title: "Doctor Visit",
        amount: 150.0,
        category: "Healthcare",
        date: "2024-08-09",
    },
    {
        title: "Restaurant Dinner",
        amount: 78.0,
        category: "Food",
        date: "2024-07-15",
    },
    {
        title: "Uber Ride",
        amount: 22.5,
        category: "Transport",
        date: "2024-07-14",
    },
    {
        title: "Concert Ticket",
        amount: 125.0,
        category: "Entertainment",
        date: "2024-07-11",
    },
];

const addSampleExpenses = async () => {
    try {
        console.log("Adding sample expenses via API...");

        for (const expense of sampleExpenses) {
            try {
                const response = await axios.post(
                    "http://localhost:5000/api/expenses",
                    expense
                );
                console.log(`✅ Added: ${expense.title} - $${expense.amount}`);
            } catch (error) {
                console.log(
                    `❌ Failed to add: ${expense.title} - ${
                        error.response?.data?.message || error.message
                    }`
                );
            }
        }

        console.log("\n🎉 Sample expenses added successfully!");
        console.log("You can now test the analytics dashboard!");

        // Test the stats endpoint
        console.log("\nTesting stats endpoint...");
        const statsResponse = await axios.get(
            "http://localhost:5000/api/expenses/stats"
        );
        console.log(
            "Stats response:",
            JSON.stringify(statsResponse.data, null, 2)
        );
    } catch (error) {
        console.error("Error:", error.message);
    }
};

addSampleExpenses();
