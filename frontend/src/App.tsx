import React, { useState, useEffect, useCallback } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import FilterControls from './components/FilterControls';
import TotalDisplay from './components/TotalDisplay';
import { createExpense, getExpenses } from './services/api';
import { Expense, CreateExpenseDTO, ExpenseFilters } from './types/expense';
import './App.css';

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExpenseFilters>({});

  // Load expenses from API
  const loadExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getExpenses(filters);
      setExpenses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Load expenses on mount and when filters change
  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  // Handle new expense submission
  const handleAddExpense = async (expenseData: CreateExpenseDTO) => {
    setError(null);

    try {
      await createExpense(expenseData);
      // Reload expenses to show the new one
      await loadExpenses();
    } catch (err: any) {
      setError(err.message || 'Failed to add expense');
      throw err; // Re-throw to let the form handle it
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: ExpenseFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Personal Expense Tracker</h1>
        <p>Track and manage your expenses efficiently</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            <span>Error: {error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <div className="app-content">
          <div className="left-panel">
            <ExpenseForm onSubmit={handleAddExpense} />
            <TotalDisplay expenses={expenses} />
          </div>

          <div className="right-panel">
            <FilterControls
              filters={filters}
              onFilterChange={handleFilterChange}
            />
            <ExpenseList
              expenses={expenses}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2024 Expense Tracker. Built with React & Express.</p>
      </footer>
    </div>
  );
};

export default App;