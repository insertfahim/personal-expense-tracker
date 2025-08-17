const request = require("supertest");
const app = require("../src/index");
const User = require("../src/models/User");
const Expense = require("../src/models/Expense");
const mongoose = require("mongoose");

describe("Authentication API", () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe("POST /api/auth/register", () => {
        it("should register a new user successfully", async () => {
            const userData = {
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            };

            const response = await request(app)
                .post("/api/auth/register")
                .send(userData)
                .expect(201);

            expect(response.body).toHaveProperty("token");
            expect(response.body.user.email).toBe(userData.email);
            expect(response.body.user.name).toBe(userData.name);
        });

        it("should not register user with invalid email", async () => {
            const userData = {
                name: "Test User",
                email: "invalid-email",
                password: "password123",
            };

            const response = await request(app)
                .post("/api/auth/register")
                .send(userData)
                .expect(400);

            expect(response.body).toHaveProperty("errors");
        });

        it("should not register user with existing email", async () => {
            const userData = {
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            };

            // Register first user
            await request(app)
                .post("/api/auth/register")
                .send(userData)
                .expect(201);

            // Try to register with same email
            const response = await request(app)
                .post("/api/auth/register")
                .send(userData)
                .expect(400);

            expect(response.body.message).toBe("User already exists");
        });
    });

    describe("POST /api/auth/login", () => {
        beforeEach(async () => {
            // Create a test user
            const userData = {
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            };

            await request(app).post("/api/auth/register").send(userData);
        });

        it("should login with valid credentials", async () => {
            const loginData = {
                email: "test@example.com",
                password: "password123",
            };

            const response = await request(app)
                .post("/api/auth/login")
                .send(loginData)
                .expect(200);

            expect(response.body).toHaveProperty("token");
            expect(response.body.user.email).toBe(loginData.email);
        });

        it("should not login with invalid credentials", async () => {
            const loginData = {
                email: "test@example.com",
                password: "wrongpassword",
            };

            const response = await request(app)
                .post("/api/auth/login")
                .send(loginData)
                .expect(400);

            expect(response.body.message).toBe("Invalid credentials");
        });

        it("should not login with non-existent user", async () => {
            const loginData = {
                email: "nonexistent@example.com",
                password: "password123",
            };

            const response = await request(app)
                .post("/api/auth/login")
                .send(loginData)
                .expect(400);

            expect(response.body.message).toBe("Invalid credentials");
        });
    });
});

describe("Expense API", () => {
    let token;
    let userId;

    beforeEach(async () => {
        await User.deleteMany({});
        await Expense.deleteMany({});

        // Create and login a test user
        const userData = {
            name: "Test User",
            email: "test@example.com",
            password: "password123",
        };

        const registerResponse = await request(app)
            .post("/api/auth/register")
            .send(userData);

        token = registerResponse.body.token;
        userId = registerResponse.body.user.id;
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe("POST /api/expenses", () => {
        it("should create a new expense successfully", async () => {
            const expenseData = {
                title: "Test Expense",
                amount: 100,
                category: "Food",
                date: new Date().toISOString(),
            };

            const response = await request(app)
                .post("/api/expenses")
                .set("Authorization", `Bearer ${token}`)
                .send(expenseData)
                .expect(201);

            expect(response.body.title).toBe(expenseData.title);
            expect(response.body.amount).toBe(expenseData.amount);
            expect(response.body.category).toBe(expenseData.category);
            expect(response.body.user).toBe(userId);
        });

        it("should not create expense without authentication", async () => {
            const expenseData = {
                title: "Test Expense",
                amount: 100,
                category: "Food",
                date: new Date().toISOString(),
            };

            await request(app)
                .post("/api/expenses")
                .send(expenseData)
                .expect(401);
        });

        it("should not create expense with invalid data", async () => {
            const expenseData = {
                title: "",
                amount: -100,
                category: "InvalidCategory",
                date: "invalid-date",
            };

            const response = await request(app)
                .post("/api/expenses")
                .set("Authorization", `Bearer ${token}`)
                .send(expenseData)
                .expect(400);

            expect(response.body).toHaveProperty("errors");
        });
    });

    describe("GET /api/expenses", () => {
        beforeEach(async () => {
            // Create test expenses
            const expenses = [
                {
                    title: "Lunch",
                    amount: 25,
                    category: "Food",
                    date: new Date(),
                    user: userId,
                },
                {
                    title: "Bus Ticket",
                    amount: 10,
                    category: "Transport",
                    date: new Date(),
                    user: userId,
                },
            ];

            await Expense.insertMany(expenses);
        });

        it("should get user expenses successfully", async () => {
            const response = await request(app)
                .get("/api/expenses")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(response.body.data).toHaveLength(2);
            expect(response.body.pagination).toHaveProperty("total", 2);
            expect(response.body.pagination).toHaveProperty("page", 1);
        });

        it("should filter expenses by category", async () => {
            const response = await request(app)
                .get("/api/expenses?category=Food")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].category).toBe("Food");
        });

        it("should search expenses by title", async () => {
            const response = await request(app)
                .get("/api/expenses?search=lunch")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].title.toLowerCase()).toContain(
                "lunch"
            );
        });
    });
});
