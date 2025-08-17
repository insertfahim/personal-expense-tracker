require("dotenv").config();
const mongoose = require("mongoose");

// Test database connection with new name
const testConnection = async () => {
    try {
        console.log("Testing connection to database...");
        console.log("Database URI:", process.env.MONGODB_URI);

        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ Successfully connected to: ${conn.connection.host}`);
        console.log(`📊 Database name: ${conn.connection.name}`);
        console.log(
            `🔗 Connection state: ${
                conn.connection.readyState === 1 ? "Connected" : "Disconnected"
            }`
        );

        // List collections in the new database
        const collections = await conn.connection.db
            .listCollections()
            .toArray();
        console.log(
            `📁 Collections in database:`,
            collections.map((c) => c.name)
        );

        await mongoose.disconnect();
        console.log("✅ Test completed successfully!");
    } catch (error) {
        console.error("❌ Database connection error:", error);
    }
};

testConnection();
