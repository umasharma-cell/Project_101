import { v4 as uuidv4 } from 'uuid';
import { db, runQuery, runInsert } from '../db';
import { Expense, CreateExpenseDTO, ExpenseQueryParams } from '../types/expense';

export class ExpenseModel {
  // Convert cents to dollars for API response
  private static centsToDollars(cents: number): number {
    return cents / 100;
  }

  // Convert dollars to cents for database storage
  private static dollarsToCents(dollars: number): number {
    return Math.round(dollars * 100);
  }

  // Format database row to API response
  private static formatExpense(row: any): Expense {
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
  static async create(data: CreateExpenseDTO): Promise<Expense> {
    // Generate UUID if not provided (for idempotency)
    const id = data.id || uuidv4();

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
      await runInsert(sql, params);

      // Fetch and return the created expense
      const created = await this.findById(id);
      if (!created) {
        throw new Error('Failed to create expense');
      }
      return created;
    } catch (error: any) {
      // Handle unique constraint violation (should not happen due to idempotency check)
      if (error.code === 'SQLITE_CONSTRAINT') {
        const existing = await this.findById(id);
        if (existing) return existing;
      }
      throw error;
    }
  }

  // Find expense by ID
  static async findById(id: string): Promise<Expense | null> {
    const sql = 'SELECT * FROM expenses WHERE id = ?';
    const rows = await runQuery<any[]>(sql, [id]);

    if (rows.length === 0) {
      return null;
    }

    return this.formatExpense(rows[0]);
  }

  // Get all expenses with optional filters
  static async findAll(params: ExpenseQueryParams = {}): Promise<Expense[]> {
    let sql = 'SELECT * FROM expenses WHERE 1=1';
    const queryParams: any[] = [];

    // Apply category filter
    if (params.category) {
      sql += ' AND category = ?';
      queryParams.push(params.category);
    }

    // Apply sorting
    if (params.sort === 'date_desc') {
      sql += ' ORDER BY date DESC, created_at DESC';
    } else if (params.sort === 'date_asc') {
      sql += ' ORDER BY date ASC, created_at ASC';
    } else {
      // Default sort: newest first
      sql += ' ORDER BY created_at DESC';
    }

    const rows = await runQuery<any[]>(sql, queryParams);
    return rows.map(row => this.formatExpense(row));
  }

  // Get expense statistics
  static async getStats(params: ExpenseQueryParams = {}): Promise<{
    total: number;
    count: number;
    categories: { [key: string]: number };
  }> {
    // Get filtered expenses
    const expenses = await this.findAll(params);

    // Calculate statistics
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const count = expenses.length;

    // Group by category
    const categories: { [key: string]: number } = {};
    expenses.forEach(exp => {
      if (!categories[exp.category]) {
        categories[exp.category] = 0;
      }
      categories[exp.category] += exp.amount;
    });

    return { total, count, categories };
  }

  // Validate date format (YYYY-MM-DD)
  static isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString + 'T00:00:00');
    return date instanceof Date && !isNaN(date.getTime());
  }
}