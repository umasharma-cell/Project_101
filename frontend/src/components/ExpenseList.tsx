import React from 'react';
import { Expense } from '../types/expense';
import { formatCurrency, formatDate } from '../services/api';
import './ExpenseList.css';

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, isLoading }) => {
  if (isLoading) {
    return (
      <div className="expense-list">
        <div className="loading">Loading expenses...</div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="expense-list">
        <div className="empty-state">
          <p>No expenses found</p>
          <p className="subtitle">Start by adding your first expense above</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <h2>Expense History</h2>
      <div className="table-container">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th className="amount-column">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense.id}>
                <td>{formatDate(expense.date)}</td>
                <td>
                  <span className={`category-badge category-${expense.category.toLowerCase()}`}>
                    {expense.category}
                  </span>
                </td>
                <td className="description">{expense.description}</td>
                <td className="amount-column">{formatCurrency(expense.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;