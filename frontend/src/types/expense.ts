// Shared types for the frontend

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export interface CreateExpenseDTO {
  id?: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface ExpenseFilters {
  category?: string;
  sort?: 'date_desc' | 'date_asc';
}

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
];

export interface ApiError {
  error: string;
  stack?: string;
}