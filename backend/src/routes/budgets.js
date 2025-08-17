const express = require("express");
const router = express.Router();
const {
    getBudgets,
    getBudgetById,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetComparison,
} = require("../controllers/budgetController");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

// Budget routes
router
    .route("/")
    .get(optionalAuth, getBudgets)
    .post(authenticateToken, createBudget);

router.route("/comparison").get(authenticateToken, getBudgetComparison);

router
    .route("/:id")
    .get(authenticateToken, getBudgetById)
    .patch(authenticateToken, updateBudget)
    .delete(authenticateToken, deleteBudget);

module.exports = router;
