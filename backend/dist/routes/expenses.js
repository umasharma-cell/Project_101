"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expense_1 = require("../models/expense");
const router = (0, express_1.Router)();
// POST /api/expenses - Create a new expense
router.post('/expenses', async (req, res, next) => {
    try {
        const expenseData = req.body;
        // Validate date format
        if (expenseData.date && !expense_1.ExpenseModel.isValidDate(expenseData.date)) {
            res.status(400).json({
                error: 'Invalid date format. Use YYYY-MM-DD'
            });
            return;
        }
        // Create expense (handles idempotency internally)
        const expense = await expense_1.ExpenseModel.create(expenseData);
        res.status(201).json(expense);
    }
    catch (error) {
        // Handle validation errors
        if (error.message.includes('must be greater than zero') ||
            error.message.includes('are required')) {
            res.status(400).json({ error: error.message });
            return;
        }
        // Pass other errors to error handler
        next(error);
    }
});
// GET /api/expenses - Get all expenses with optional filters
router.get('/expenses', async (req, res, next) => {
    try {
        const queryParams = {
            category: req.query.category,
            sort: req.query.sort
        };
        // Validate sort parameter
        if (queryParams.sort && !['date_desc', 'date_asc'].includes(queryParams.sort)) {
            res.status(400).json({
                error: 'Invalid sort parameter. Use date_desc or date_asc'
            });
            return;
        }
        const expenses = await expense_1.ExpenseModel.findAll(queryParams);
        res.json(expenses);
    }
    catch (error) {
        next(error);
    }
});
// GET /api/expenses/stats - Get expense statistics (optional endpoint)
router.get('/expenses/stats', async (req, res, next) => {
    try {
        const queryParams = {
            category: req.query.category
        };
        const stats = await expense_1.ExpenseModel.getStats(queryParams);
        res.json(stats);
    }
    catch (error) {
        next(error);
    }
});
// GET /api/expenses/:id - Get single expense by ID
router.get('/expenses/:id', async (req, res, next) => {
    try {
        const expense = await expense_1.ExpenseModel.findById(req.params.id);
        if (!expense) {
            res.status(404).json({ error: 'Expense not found' });
            return;
        }
        res.json(expense);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=expenses.js.map