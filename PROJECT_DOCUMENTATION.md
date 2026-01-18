# Expense Tracker - Complete Project Documentation

## Project Overview
A full-stack personal finance expense tracker application built with TypeScript, allowing users to record, review, filter, and analyze their expenses.

## Tech Stack
- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + TypeScript
- **Database**: SQLite (file-based)
- **Styling**: CSS Modules
- **API**: RESTful with JSON

## Architecture Overview

```
┌─────────────────┐
│   React Frontend│
│   (Port 3000)   │
└────────┬────────┘
         │ HTTP/JSON
         ▼
┌─────────────────┐
│  Express Backend│
│   (Port 5000)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  SQLite Database│
│  (file-based)   │
└─────────────────┘
```

## Data Flow

### Creating an Expense
1. User fills form in React (ExpenseForm.tsx)
2. Form validates input (no negative amounts, required fields)
3. Generates client-side UUID for idempotency
4. Sends POST request to /api/expenses
5. Backend validates and stores in SQLite
6. Returns created expense
7. Frontend updates expense list

### Viewing Expenses
1. React component mounts (ExpenseList.tsx)
2. Sends GET request to /api/expenses
3. Backend queries SQLite with filters/sort
4. Returns expense array
5. Frontend displays in table
6. Calculates and shows total

## File Structure & Responsibilities

### Backend Files

#### `/backend/src/index.ts`
- **Purpose**: Express server entry point
- **Responsibilities**:
  - Initialize Express app
  - Setup middleware (CORS, JSON parsing, error handling)
  - Connect to SQLite database
  - Define API routes
  - Start server on port 5000

#### `/backend/src/db.ts`
- **Purpose**: Database connection and initialization
- **Responsibilities**:
  - Create SQLite connection
  - Initialize expenses table if not exists
  - Provide database instance to other modules

#### `/backend/src/models/expense.ts`
- **Purpose**: Expense data model
- **Responsibilities**:
  - Define expense schema
  - CRUD operations (create, read)
  - Data validation
  - Money conversion (dollars ↔ cents)

#### `/backend/src/routes/expenses.ts`
- **Purpose**: API endpoint handlers
- **Endpoints**:
  - `POST /expenses`: Create new expense with idempotency
  - `GET /expenses`: List expenses with optional filters
- **Query Parameters**:
  - `category`: Filter by expense category
  - `sort`: Sort by date (date_desc for newest first)

#### `/backend/src/middleware/errorHandler.ts`
- **Purpose**: Centralized error handling
- **Responsibilities**:
  - Catch and format errors
  - Send appropriate HTTP status codes
  - Log errors for debugging

#### `/backend/src/types/expense.ts`
- **Purpose**: TypeScript type definitions
- **Types**:
  ```typescript
  interface Expense {
    id: string;          // UUID v4
    amount: number;      // Stored as cents (integer)
    category: string;    // e.g., "Food", "Transport"
    description: string;
    date: string;        // ISO 8601 format
    created_at: string;  // Timestamp
  }
  ```

### Frontend Files

#### `/frontend/src/App.tsx`
- **Purpose**: Main React component
- **Responsibilities**:
  - Manage global state (expenses array)
  - Handle API communication
  - Render child components
  - Pass props and callbacks

#### `/frontend/src/components/ExpenseForm.tsx`
- **Purpose**: Form for adding expenses
- **Features**:
  - Input fields: amount, category, description, date
  - Client-side validation
  - UUID generation for idempotency
  - Prevent duplicate submissions
  - Loading state during submission

#### `/frontend/src/components/ExpenseList.tsx`
- **Purpose**: Display expenses in table format
- **Features**:
  - Sortable columns
  - Formatted currency display
  - Date formatting
  - Empty state message

#### `/frontend/src/components/FilterControls.tsx`
- **Purpose**: Filter and sort controls
- **Features**:
  - Category dropdown filter
  - Sort by date button
  - Clear filters option

#### `/frontend/src/components/TotalDisplay.tsx`
- **Purpose**: Show total of visible expenses
- **Features**:
  - Real-time calculation
  - Currency formatting
  - Updates on filter/sort changes

#### `/frontend/src/services/api.ts`
- **Purpose**: API client functions
- **Functions**:
  - `createExpense()`: POST with retry logic
  - `getExpenses()`: GET with query params
  - Error handling and response parsing

## Database Schema

### Expenses Table
```sql
CREATE TABLE expenses (
  id TEXT PRIMARY KEY,           -- UUID
  amount INTEGER NOT NULL,       -- Amount in cents
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,            -- ISO 8601 date
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## API Specification

### POST /api/expenses
**Request Body:**
```json
{
  "id": "uuid-v4",              // Client-generated for idempotency
  "amount": 25.50,              // In dollars (converted to cents)
  "category": "Food",
  "description": "Lunch at cafe",
  "date": "2024-01-15"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-v4",
  "amount": 25.50,
  "category": "Food",
  "description": "Lunch at cafe",
  "date": "2024-01-15",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### GET /api/expenses
**Query Parameters:**
- `category` (optional): Filter by category
- `sort` (optional): "date_desc" for newest first

**Response (200 OK):**
```json
[
  {
    "id": "uuid-1",
    "amount": 25.50,
    "category": "Food",
    "description": "Lunch",
    "date": "2024-01-15",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

## Key Design Decisions

### 1. Money Handling
- **Storage**: Store amounts as integers (cents) in database
- **API**: Accept/return amounts as decimals (dollars)
- **Display**: Format with currency symbol and 2 decimal places
- **Reason**: Avoid floating-point arithmetic errors

### 2. Idempotency Strategy
- **Client-generated UUIDs**: Frontend generates ID before sending
- **Database constraint**: Primary key prevents duplicates
- **Benefit**: Safe retry on network failures

### 3. Date Handling
- **Storage**: ISO 8601 strings (YYYY-MM-DD)
- **Sorting**: String comparison works correctly
- **Display**: Locale-friendly formatting in UI

### 4. Category Management
- **Approach**: Free-text input with suggestions
- **Predefined**: Common categories (Food, Transport, etc.)
- **Flexible**: Users can enter custom categories

## Error Handling

### Backend Errors
- **Validation errors**: Return 400 with details
- **Duplicate ID**: Return existing expense (idempotent)
- **Database errors**: Return 500 with generic message
- **Not found**: Return 404

### Frontend Errors
- **Network failures**: Retry with exponential backoff
- **Validation**: Prevent submission, show inline errors
- **API errors**: Display user-friendly messages

## Security Considerations

1. **Input Validation**
   - Sanitize all inputs
   - Validate amount is positive
   - Limit string lengths

2. **CORS Configuration**
   - Restrict to frontend origin
   - Proper headers for preflight

3. **SQL Injection Prevention**
   - Use parameterized queries
   - Never concatenate SQL strings

## Performance Optimizations

1. **Database Indexing**
   - Index on date for sorting
   - Index on category for filtering

2. **Frontend Caching**
   - Cache expense list
   - Invalidate on new expense

3. **Pagination** (Future enhancement)
   - Limit results per page
   - Implement offset/limit

## Testing Strategy

1. **Backend Tests**
   - Unit tests for models
   - Integration tests for API
   - Database transaction tests

2. **Frontend Tests**
   - Component unit tests
   - Form validation tests
   - API mock tests

## Deployment Considerations

1. **Environment Variables**
   - API_URL for frontend
   - PORT for backend
   - DATABASE_PATH for SQLite

2. **Production Build**
   - Minified React bundle
   - TypeScript compilation
   - Environment-specific configs

## Future Enhancements

1. **Features**
   - User authentication
   - Expense categories CRUD
   - Data export (CSV/PDF)
   - Charts and analytics
   - Budget tracking

2. **Technical**
   - Database migrations
   - API versioning
   - WebSocket for real-time updates
   - Service worker for offline

## Common Commands

### Backend
```bash
cd backend
npm install              # Install dependencies
npm run dev             # Development server
npm run build           # TypeScript compilation
npm start               # Production server
```

### Frontend
```bash
cd frontend
npm install              # Install dependencies
npm start               # Development server
npm run build           # Production build
npm test                # Run tests
```

## Troubleshooting

### Issue: Duplicate expense on refresh
**Solution**: Check UUID generation and idempotency logic

### Issue: Money showing incorrect decimals
**Solution**: Verify cents-to-dollars conversion

### Issue: CORS errors
**Solution**: Check backend CORS configuration

### Issue: SQLite database locked
**Solution**: Close other connections, check file permissions

---

This documentation provides a complete understanding of the Expense Tracker application architecture, implementation details, and data flow. Each component is designed to be maintainable, scalable, and production-ready while keeping the codebase simple and focused on core requirements.