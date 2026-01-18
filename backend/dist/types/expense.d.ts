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
export interface ExpenseQueryParams {
    category?: string;
    sort?: 'date_desc' | 'date_asc';
}
export declare const EXPENSE_CATEGORIES: readonly ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Healthcare", "Education", "Travel", "Other"];
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
//# sourceMappingURL=expense.d.ts.map