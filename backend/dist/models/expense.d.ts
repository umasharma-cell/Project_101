import { Expense, CreateExpenseDTO, ExpenseQueryParams } from '../types/expense';
export declare class ExpenseModel {
    private static centsToDollars;
    private static dollarsToCents;
    private static formatExpense;
    static create(data: CreateExpenseDTO): Promise<Expense>;
    static findById(id: string): Promise<Expense | null>;
    static findAll(params?: ExpenseQueryParams): Promise<Expense[]>;
    static getStats(params?: ExpenseQueryParams): Promise<{
        total: number;
        count: number;
        categories: {
            [key: string]: number;
        };
    }>;
    static isValidDate(dateString: string): boolean;
}
//# sourceMappingURL=expense.d.ts.map