import sqlite3 from 'sqlite3';
export declare const db: sqlite3.Database;
export declare const initializeDatabase: () => Promise<void>;
export declare const runQuery: <T = any>(sql: string, params?: any[]) => Promise<T>;
export declare const runInsert: (sql: string, params?: any[]) => Promise<{
    lastID: number;
}>;
//# sourceMappingURL=db.d.ts.map