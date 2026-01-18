"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseModel = void 0;
const uuid_1 = require("uuid");
const db_1 = require("../db");
class ExpenseModel {
    // Convert cents to dollars for API response
    static centsToDollars(cents) {
        return cents / 100;
    }
    // Convert dollars to cents for database storage
    static dollarsToCents(dollars) {
        return Math.round(dollars * 100);
    }
    // Format database row to API response
    static formatExpense(row) {
        return {
            id: row.id,
            amount: this.centsToDollars(row.amount),
            category: row.category,
            description: row.description,
            date: row.date,
            created_at: row.created_at
        };
    }
    // Create a new expense
    static async create(data) {
        // Generate UUID if not provided (for idempotency)
        const id = data.id || (0, uuid_1.v4)();
        // Validate required fields
        if (!data.amount || data.amount <= 0) {
            throw new Error('Amount must be greater than zero');
        }
        if (!data.category || !data.description || !data.date) {
            throw new Error('Category, description, and date are required');
        }
        // Check if expense with this ID already exists (idempotency)
        const existing = await this.findById(id);
        if (existing) {
            return existing; // Return existing expense for idempotent behavior
        }
        // Convert amount to cents for storage
        const amountInCents = this.dollarsToCents(data.amount);
        // Insert new expense
        const sql = `
      INSERT INTO expenses (id, amount, category, description, date)
      VALUES (?, ?, ?, ?, ?)
    `;
        const params = [
            id,
            amountInCents,
            data.category.trim(),
            data.description.trim(),
            data.date
        ];
        try {
            await (0, db_1.runInsert)(sql, params);
            // Fetch and return the created expense
            const created = await this.findById(id);
            if (!created) {
                throw new Error('Failed to create expense');
            }
            return created;
        }
        catch (error) {
            // Handle unique constraint violation (should not happen due to idempotency check)
            if (error.code === 'SQLITE_CONSTRAINT') {
                const existing = await this.findById(id);
                if (existing)
                    return existing;
            }
            throw error;
        }
    }
    // Find expense by ID
    static async findById(id) {
        const sql = 'SELECT * FROM expenses WHERE id = ?';
        const rows = await (0, db_1.runQuery)(sql, [id]);
        if (rows.length === 0) {
            return null;
        }
        return this.formatExpense(rows[0]);
    }
    // Get all expenses with optional filters
    static async findAll(params = {}) {
        let sql = 'SELECT * FROM expenses WHERE 1=1';
        const queryParams = [];
        // Apply category filter
        if (params.category) {
            sql += ' AND category = ?';
            queryParams.push(params.category);
        }
        // Apply sorting
        if (params.sort === 'date_desc') {
            sql += ' ORDER BY date DESC, created_at DESC';
        }
        else if (params.sort === 'date_asc') {
            sql += ' ORDER BY date ASC, created_at ASC';
        }
        else {
            // Default sort: newest first
            sql += ' ORDER BY created_at DESC';
        }
        const rows = await (0, db_1.runQuery)(sql, queryParams);
        return rows.map(row => this.formatExpense(row));
    }
    // Get expense statistics
    static async getStats(params = {}) {
        // Get filtered expenses
        const expenses = await this.findAll(params);
        // Calculate statistics
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const count = expenses.length;
        // Group by category
        const categories = {};
        expenses.forEach(exp => {
            if (!categories[exp.category]) {
                categories[exp.category] = 0;
            }
            categories[exp.category] += exp.amount;
        });
        return { total, count, categories };
    }
    // Validate date format (YYYY-MM-DD)
    static isValidDate(dateString) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString))
            return false;
        const date = new Date(dateString + 'T00:00:00');
        return date instanceof Date && !isNaN(date.getTime());
    }
}
exports.ExpenseModel = ExpenseModel;
//# sourceMappingURL=expense.js.map