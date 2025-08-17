const express = require("express");
const router = express.Router();
const { getForecast } = require("../controllers/predictiveController");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

// Predictive routes
router.get("/forecast", authenticateToken, getForecast);

module.exports = router;
