import React, { useState, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CreateExpenseDTO, EXPENSE_CATEGORIES } from '../types/expense';
import { getTodayDate } from '../services/api';
import './ExpenseForm.css';

interface ExpenseFormProps {
  onSubmit: (expense: CreateExpenseDTO) => Promise<void>;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CreateExpenseDTO>({
    amount: 0,
    category: '',
    description: '',
    date: getTodayDate(),
  });
  const [errors, setErrors] = useState<Partial<CreateExpenseDTO>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateExpenseDTO> = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 1; // Using number as error indicator
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate UUID for idempotency
      const expenseWithId = {
        ...formData,
        id: uuidv4(),
      };

      await onSubmit(expenseWithId);

      // Reset form after successful submission
      setFormData({
        amount: 0,
        category: '',
        description: '',
        date: getTodayDate(),
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting expense:', error);
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'amount') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name as keyof CreateExpenseDTO]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2>Add New Expense</h2>

      <div className="form-group">
        <label htmlFor="amount">Amount (₹)</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount || ''}
          onChange={handleInputChange}
          step="0.01"
          min="0.01"
          className={errors.amount ? 'error' : ''}
          disabled={isSubmitting}
          placeholder="0.00"
        />
        {errors.amount && <span className="error-message">Amount must be greater than zero</span>}
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className={errors.category ? 'error' : ''}
          disabled={isSubmitting}
        >
          <option value="">Select a category</option>
          {EXPENSE_CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && <span className="error-message">{errors.category}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className={errors.description ? 'error' : ''}
          disabled={isSubmitting}
          placeholder="Enter expense description"
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          max={getTodayDate()}
          className={errors.date ? 'error' : ''}
          disabled={isSubmitting}
        />
        {errors.date && <span className="error-message">{errors.date}</span>}
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;