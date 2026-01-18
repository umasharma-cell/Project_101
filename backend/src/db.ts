import sqlite3 from 'sqlite3';
import path from 'path';

// Enable verbose mode for debugging in development
const sqlite = sqlite3.verbose();

// Database file path
const DB_PATH = path.join(__dirname, '..', 'database.sqlite');

// Create database connection
export const db = new sqlite.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Initialize database schema
export const initializeDatabase = (): Promise<void> => {
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

    db.run(createTableSQL, (err) => {
      if (err) {
        console.error('Error creating expenses table:', err.message);
        reject(err);
      } else {
        console.log('Expenses table ready');

        // Create indexes for better query performance
        db.run('CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date)', (err) => {
          if (err) console.error('Error creating date index:', err.message);
        });

        db.run('CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category)', (err) => {
          if (err) console.error('Error creating category index:', err.message);
        });

        resolve();
      }
    });
  });
};

// Utility function to promisify database operations
export const runQuery = <T = any>(sql: string, params: any[] = []): Promise<T> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as T);
      }
    });
  });
};

export const runInsert = (sql: string, params: any[] = []): Promise<{ lastID: number }> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID });
      }
    });
  });
};

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});