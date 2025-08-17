const express = require("express");
const router = express.Router();
const {
    getSavingsGoals,
    getSavingsGoalById,
    createSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addContribution,
    removeContribution,
    getSavingsGoalsSummary,
} = require("../controllers/savingsGoalController");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

// Summary route (requires authentication)
router.get("/summary", authenticateToken, getSavingsGoalsSummary);

// Main routes (require authentication)
router
    .route("/")
    .get(authenticateToken, getSavingsGoals)
    .post(authenticateToken, createSavingsGoal);

router
    .route("/:id")
    .get(authenticateToken, getSavingsGoalById)
    .patch(authenticateToken, updateSavingsGoal)
    .delete(authenticateToken, deleteSavingsGoal);

// Contribution routes (require authentication)
router.route("/:id/contributions").post(authenticateToken, addContribution);

router
    .route("/:id/contributions/:contributionId")
    .delete(authenticateToken, removeContribution);

module.exports = router;
