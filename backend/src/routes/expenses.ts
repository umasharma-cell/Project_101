import { Router, Request, Response, NextFunction } from 'express';
import { ExpenseModel } from '../models/expense';
import { CreateExpenseDTO, ExpenseQueryParams } from '../types/expense';

const router = Router();

// POST /api/expenses - Create a new expense
router.post('/expenses', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expenseData: CreateExpenseDTO = req.body;

    // Validate date format
    if (expenseData.date && !ExpenseModel.isValidDate(expenseData.date)) {
      return res.status(400).json({
        error: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    // Create expense (handles idempotency internally)
    const expense = await ExpenseModel.create(expenseData);

    res.status(201).json(expense);
  } catch (error: any) {
    // Handle validation errors
    if (error.message.includes('must be greater than zero') ||
        error.message.includes('are required')) {
      return res.status(400).json({ error: error.message });
    }

    // Pass other errors to error handler
    next(error);
  }
});

// GET /api/expenses - Get all expenses with optional filters
router.get('/expenses', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams: ExpenseQueryParams = {
      category: req.query.category as string,
      sort: req.query.sort as 'date_desc' | 'date_asc'
    };

    // Validate sort parameter
    if (queryParams.sort && !['date_desc', 'date_asc'].includes(queryParams.sort)) {
      return res.status(400).json({
        error: 'Invalid sort parameter. Use date_desc or date_asc'
      });
    }

    const expenses = await ExpenseModel.findAll(queryParams);

    res.json(expenses);
  } catch (error) {
    next(error);
  }
});

// GET /api/expenses/stats - Get expense statistics (optional endpoint)
router.get('/expenses/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams: ExpenseQueryParams = {
      category: req.query.category as string
    };

    const stats = await ExpenseModel.getStats(queryParams);

    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// GET /api/expenses/:id - Get single expense by ID
router.get('/expenses/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expense = await ExpenseModel.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    next(error);
  }
});

export default router;