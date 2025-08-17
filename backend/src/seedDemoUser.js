const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

// Demo user data
const demoUser = {
    username: "demo",
    email: "demo@example.com",
    password: "demo123",
};

const seedDemoUser = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to database");

        // Check if demo user already exists
        const existingUser = await User.findOne({ email: demoUser.email });

        if (existingUser) {
            console.log("Demo user already exists");
            return;
        }

        // Create demo user
        const user = new User(demoUser);
        await user.save();

        console.log("Demo user created successfully!");
        console.log("Email:", demoUser.email);
        console.log("Password:", demoUser.password);
    } catch (error) {
        console.error("Error seeding demo user:", error);
    } finally {
        await mongoose.disconnect();
    }
};

// Run if called directly
if (require.main === module) {
    seedDemoUser();
}

module.exports = seedDemoUser;
