// Health check script for debugging API connection
const API_BASE_URL = "https://expense-tracker-by-fahim.vercel.app/api";

async function testAPIConnection() {
    console.log("Testing API connection to:", API_BASE_URL);

    try {
        // Test health endpoint
        const healthResponse = await fetch(`${API_BASE_URL}/health`);
        console.log("Health check status:", healthResponse.status);

        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log("Health check data:", healthData);
        } else {
            console.error("Health check failed:", await healthResponse.text());
        }

        // Test demo login
        console.log("\nTesting demo login...");
        const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: "demo@example.com",
                password: "demo123",
            }),
        });

        console.log("Login response status:", loginResponse.status);
        const loginData = await loginResponse.json();
        console.log("Login response data:", loginData);
    } catch (error) {
        console.error("Connection error:", error);
    }
}

// Run the test
testAPIConnection();
