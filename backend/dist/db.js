"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runInsert = exports.runQuery = exports.initializeDatabase = exports.db = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
// Enable verbose mode for debugging in development
const sqlite = sqlite3_1.default.verbose();
// Database file path
const DB_PATH = path_1.default.join(__dirname, '..', 'database.sqlite');
// Create database connection
exports.db = new sqlite.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('Connected to SQLite database');
});
// Initialize database schema
const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        const createTableSQL = `
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        amount INTEGER NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `;
        exports.db.run(createTableSQL, (err) => {
            if (err) {
                console.error('Error creating expenses table:', err.message);
                reject(err);
            }
            else {
                console.log('Expenses table ready');
                // Create indexes for better query performance
                exports.db.run('CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date)', (err) => {
                    if (err)
                        console.error('Error creating date index:', err.message);
                });
                exports.db.run('CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category)', (err) => {
                    if (err)
                        console.error('Error creating category index:', err.message);
                });
                resolve();
            }
        });
    });
};
exports.initializeDatabase = initializeDatabase;
// Utility function to promisify database operations
const runQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        exports.db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
};
exports.runQuery = runQuery;
const runInsert = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        exports.db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve({ lastID: this.lastID });
            }
        });
    });
};
exports.runInsert = runInsert;
// Graceful shutdown
process.on('SIGINT', () => {
    exports.db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        }
        else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});
//# sourceMappingURL=db.js.map