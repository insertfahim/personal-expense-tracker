// Simple test to check if the API is working
const axios = require("axios");

const testAPI = async () => {
    try {
        console.log("Testing API health check...");
        const healthResponse = await axios.get(
            "http://localhost:5000/api/health"
        );
        console.log("Health check response:", healthResponse.data);

        console.log("\nTesting login API...");
        const loginResponse = await axios.post(
            "http://localhost:5000/api/auth/login",
            {
                email: "demo@example.com",
                password: "demo123",
            }
        );
        console.log("Login response:", loginResponse.data);
    } catch (error) {
        console.error("API test error:", error.response?.data || error.message);
    }
};

testAPI();
