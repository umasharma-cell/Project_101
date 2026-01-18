// TypeScript interfaces for Expense data model

export interface Expense {
  id: string;          // UUID v4
  amount: number;      // Stored as cents in DB, but dollars in API
  category: string;    // e.g., "Food", "Transport", "Entertainment"
  description: string; // User-provided description
  date: string;        // ISO 8601 format (YYYY-MM-DD)
  created_at: string;  // Timestamp when record was created
}

export interface CreateExpenseDTO {
  id?: string;         // Optional, will be generated if not provided
  amount: number;      // In dollars (will be converted to cents)
  category: string;
  description: string;
  date: string;
}

export interface ExpenseQueryParams {
  category?: string;   // Filter by category
  sort?: 'date_desc' | 'date_asc'; // Sort order
}

// Predefined categories for suggestions
export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Travel',
  'Other'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];