import axios, { AxiosError } from 'axios';
import { Expense, CreateExpenseDTO, ExpenseFilters, ApiError } from '../types/expense';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to handle API errors
const handleApiError = (error: AxiosError<ApiError>): never => {
  if (error.response?.data?.error) {
    throw new Error(error.response.data.error);
  }
  if (error.request) {
    throw new Error('Network error. Please check your connection.');
  }
  throw new Error('An unexpected error occurred.');
};

// Create a new expense with retry logic
export const createExpense = async (
  expenseData: CreateExpenseDTO,
  retries = MAX_RETRIES
): Promise<Expense> => {
  try {
    const response = await apiClient.post<Expense>('/expenses', expenseData);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;

    // Don't retry on validation errors (400)
    if (axiosError.response?.status === 400) {
      return handleApiError(axiosError);
    }

    // Retry on network errors or 5xx errors
    if (retries > 0 && (!axiosError.response || axiosError.response.status >= 500)) {
      await delay(RETRY_DELAY);
      return createExpense(expenseData, retries - 1);
    }

    return handleApiError(axiosError);
  }
};

// Get all expenses with optional filters
export const getExpenses = async (filters?: ExpenseFilters): Promise<Expense[]> => {
  try {
    const params = new URLSearchParams();

    if (filters?.category) {
      params.append('category', filters.category);
    }
    if (filters?.sort) {
      params.append('sort', filters.sort);
    }

    const response = await apiClient.get<Expense[]>(
      `/expenses${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError<ApiError>);
  }
};

// Get a single expense by ID
export const getExpenseById = async (id: string): Promise<Expense> => {
  try {
    const response = await apiClient.get<Expense>(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError<ApiError>);
  }
};

// Get expense statistics
export const getExpenseStats = async (filters?: ExpenseFilters): Promise<{
  total: number;
  count: number;
  categories: { [key: string]: number };
}> => {
  try {
    const params = new URLSearchParams();

    if (filters?.category) {
      params.append('category', filters.category);
    }

    const response = await apiClient.get(
      `/expenses/stats${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError<ApiError>);
  }
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Get today's date in YYYY-MM-DD format
export const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};