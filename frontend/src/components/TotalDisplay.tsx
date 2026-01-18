import React from 'react';
import { Expense } from '../types/expense';
import { formatCurrency } from '../services/api';
import './TotalDisplay.css';

interface TotalDisplayProps {
  expenses: Expense[];
}

const TotalDisplay: React.FC<TotalDisplayProps> = ({ expenses }) => {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const count = expenses.length;

  return (
    <div className="total-display">
      <div className="total-card">
        <div className="total-label">Total Expenses</div>
        <div className="total-amount">{formatCurrency(total)}</div>
        <div className="expense-count">
          {count} {count === 1 ? 'expense' : 'expenses'}
        </div>
      </div>
    </div>
  );
};

export default TotalDisplay;