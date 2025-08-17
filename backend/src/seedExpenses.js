const mongoose = require("mongoose");
const Expense = require("./models/Expense");
require("dotenv").config();

// Sample expenses for demo
const sampleExpenses = [
    {
        title: "Grocery Shopping",
        amount: 85.5,
        category: "Food",
        date: new Date("2024-08-15"),
    },
    {
        title: "Gas Station",
        amount: 45.0,
        category: "Transport",
        date: new Date("2024-08-14"),
    },
    {
        title: "Movie Tickets",
        amount: 28.0,
        category: "Entertainment",
        date: new Date("2024-08-13"),
    },
    {
        title: "Coffee Shop",
        amount: 12.5,
        category: "Food",
        date: new Date("2024-08-12"),
    },
    {
        title: "Clothing Store",
        amount: 120.0,
        category: "Shopping",
        date: new Date("2024-08-11"),
    },
    {
        title: "Electric Bill",
        amount: 95.0,
        category: "Bills",
        date: new Date("2024-08-10"),
    },
    {
        title: "Doctor Visit",
        amount: 150.0,
        category: "Healthcare",
        date: new Date("2024-08-09"),
    },
    {
        title: "Lunch",
        amount: 18.75,
        category: "Food",
        date: new Date("2024-08-08"),
    },
    {
        title: "Bus Ticket",
        amount: 3.5,
        category: "Transport",
        date: new Date("2024-08-07"),
    },
    {
        title: "Books",
        amount: 65.0,
        category: "Others",
        date: new Date("2024-08-06"),
    },
    {
        title: "Restaurant Dinner",
        amount: 78.0,
        category: "Food",
        date: new Date("2024-07-15"),
    },
    {
        title: "Uber Ride",
        amount: 22.5,
        category: "Transport",
        date: new Date("2024-07-14"),
    },
    {
        title: "Gym Membership",
        amount: 55.0,
        category: "Healthcare",
        date: new Date("2024-07-13"),
    },
    {
        title: "Phone Bill",
        amount: 80.0,
        category: "Bills",
        date: new Date("2024-07-12"),
    },
    {
        title: "Concert Ticket",
        amount: 125.0,
        category: "Entertainment",
        date: new Date("2024-07-11"),
    },
    {
        title: "Supermarket",
        amount: 92.25,
        category: "Food",
        date: new Date("2024-06-15"),
    },
    {
        title: "Online Shopping",
        amount: 175.0,
        category: "Shopping",
        date: new Date("2024-06-14"),
    },
    {
        title: "Parking Fee",
        amount: 8.0,
        category: "Transport",
        date: new Date("2024-06-13"),
    },
    {
        title: "Internet Bill",
        amount: 60.0,
        category: "Bills",
        date: new Date("2024-06-12"),
    },
    {
        title: "Pharmacy",
        amount: 25.0,
        category: "Healthcare",
        date: new Date("2024-06-11"),
    },
];

const seedExpenses = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to database");

        // Check if expenses already exist
        const existingExpenses = await Expense.countDocuments();

        if (existingExpenses > 0) {
            console.log(`Database already has ${existingExpenses} expenses`);
            console.log("Skipping seed to avoid duplicates");
            return;
        }

        // Create sample expenses
        await Expense.insertMany(sampleExpenses);

        console.log(
            `✅ Successfully seeded ${sampleExpenses.length} sample expenses!`
        );

        // Show some stats
        const stats = await Expense.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                    total: { $sum: "$amount" },
                },
            },
            { $sort: { total: -1 } },
        ]);

        console.log("\n📊 Expense breakdown by category:");
        stats.forEach((stat) => {
            console.log(
                `${stat._id}: ${stat.count} expenses, $${stat.total.toFixed(2)}`
            );
        });
    } catch (error) {
        console.error("❌ Error seeding expenses:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from database");
    }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
    seedExpenses();
}

module.exports = seedExpenses;
