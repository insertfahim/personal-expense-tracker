// Test API endpoints to verify they work correctly
async function testAPI() {
    const baseUrl = window.location.origin;
    console.log("Testing API at:", baseUrl);

    try {
        // Test health check
        console.log("\n=== Testing Health Check ===");
        const healthResponse = await fetch(`${baseUrl}/api/health`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        console.log("Health Status:", healthResponse.status);
        console.log(
            "Health Headers:",
            Object.fromEntries(healthResponse.headers)
        );

        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log("Health Data:", healthData);
        } else {
            console.error("Health check failed:", await healthResponse.text());
        }

        // Test login endpoint
        console.log("\n=== Testing Login Endpoint ===");
        const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
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

        console.log("Login Status:", loginResponse.status);
        console.log(
            "Login Headers:",
            Object.fromEntries(loginResponse.headers)
        );

        const loginData = await loginResponse.json();
        console.log("Login Data:", loginData);
    } catch (error) {
        console.error("Test failed:", error);
    }
}

// Run the test
testAPI();
