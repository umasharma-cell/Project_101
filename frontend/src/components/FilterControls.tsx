import React from 'react';
import { EXPENSE_CATEGORIES, ExpenseFilters } from '../types/expense';
import './FilterControls.css';

interface FilterControlsProps {
  filters: ExpenseFilters;
  onFilterChange: (filters: ExpenseFilters) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ filters, onFilterChange }) => {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    onFilterChange({
      ...filters,
      category: category || undefined,
    });
  };

  const handleSortToggle = () => {
    const newSort = filters.sort === 'date_desc' ? undefined : 'date_desc';
    onFilterChange({
      ...filters,
      sort: newSort,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = filters.category || filters.sort;

  return (
    <div className="filter-controls">
      <div className="filter-group">
        <label htmlFor="category-filter">Filter by Category:</label>
        <select
          id="category-filter"
          value={filters.category || ''}
          onChange={handleCategoryChange}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {EXPENSE_CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <button
          onClick={handleSortToggle}
          className={`sort-button ${filters.sort === 'date_desc' ? 'active' : ''}`}
        >
          {filters.sort === 'date_desc' ? '⬇ Newest First' : '⬆ Sort by Date'}
        </button>
      </div>

      {hasActiveFilters && (
        <div className="filter-group">
          <button onClick={handleClearFilters} className="clear-button">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterControls;