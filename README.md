# Expense Tracker - Full Stack Application

A production-ready personal finance expense tracker built with TypeScript, React, Express, and SQLite.

## Features

✅ **Core Functionality**
- Create expense entries with amount, category, description, and date
- View a comprehensive list of all expenses
- Filter expenses by category
- Sort expenses by date (newest first)
- Real-time total calculation of visible expenses
- Idempotent API design for reliable retries

✅ **Production Features**
- TypeScript for type safety
- Proper money handling (stored as cents)
- Input validation on both frontend and backend
- Error handling and loading states
- Responsive design for mobile and desktop
- Database indexing for performance

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, SQLite
- **Frontend**: React, TypeScript
- **Styling**: CSS Modules
- **API**: RESTful JSON API

## Project Structure

```
Project_101/
├── backend/            # Express API server
│   ├── src/
│   │   ├── models/     # Data models
│   │   ├── routes/     # API endpoints
│   │   ├── types/      # TypeScript types
│   │   └── index.ts    # Server entry point
│   └── package.json
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── services/   # API client
│   │   └── App.tsx     # Main component
│   └── package.json
└── PROJECT_DOCUMENTATION.md # Detailed documentation
```

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Project_101
```

2. **Setup Backend**
```bash
cd backend
npm install
```

3. **Setup Frontend** (in a new terminal)
```bash
cd frontend
npm install
```

### Running the Application

1. **Start Backend Server**
```bash
cd backend
npm run dev
```
The backend will start on http://localhost:5000

2. **Start Frontend Application** (in a new terminal)
```bash
cd frontend
npm start
```
The frontend will start on http://localhost:3000

### Using the Application

1. **Add an Expense**: Fill out the form with amount, category, description, and date
2. **View Expenses**: See all expenses in the table on the right
3. **Filter by Category**: Use the dropdown to filter expenses
4. **Sort by Date**: Click "Sort by Date" to order newest first
5. **View Total**: See the sum of all visible expenses

## API Endpoints

- `POST /api/expenses` - Create new expense
- `GET /api/expenses` - List all expenses
  - Query params: `category`, `sort=date_desc`
- `GET /api/expenses/:id` - Get single expense
- `GET /api/expenses/stats` - Get statistics

## Database Schema

```sql
CREATE TABLE expenses (
  id TEXT PRIMARY KEY,        -- UUID
  amount INTEGER NOT NULL,    -- Amount in cents
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,         -- ISO date
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Key Design Decisions

1. **SQLite Database**: Chosen for simplicity, portability, and sufficient for single-user application. File-based storage eliminates the need for database server setup.
2. **Money as Cents**: Stored as integers in the database to avoid floating-point arithmetic errors. Converted to/from dollars at the API boundary.
3. **Client-Generated UUIDs**: Frontend generates IDs before sending to backend, enabling true idempotency. Same request can be safely retried without creating duplicates.
4. **TypeScript**: Provides compile-time type safety for both frontend and backend, especially critical for financial data handling.
5. **Monorepo Structure**: Backend and frontend in same repository for easier development and deployment coordination.
6. **No Authentication**: Single-user application assumption allowed us to skip auth complexity and focus on core functionality.

## Trade-offs Made Due to Time Constraints

1. **Basic Styling Over Polished UI**: Used simple CSS instead of a component library (like Material-UI) to save setup time. The UI is functional but not highly polished.
2. **No Automated Tests**: Focused on core functionality over test coverage. In production, would add unit tests for money handling and integration tests for API.
3. **Simple Error Messages**: Generic error messages instead of detailed, user-friendly error explanations for each scenario.
4. **No Data Pagination**: Loading all expenses at once. For large datasets, would implement pagination or virtualization.
5. **Limited Input Validation**: Basic validation only (e.g., positive amounts). Could add more sophisticated validation like date range limits.
6. **No Caching Strategy**: Frontend fetches data on every filter change. Could implement caching to reduce API calls.

## Intentionally Not Implemented

These features were consciously excluded to maintain focus on core requirements:

1. **User Authentication & Authorization**: Assignment specified single-user, so no login system
2. **Expense Editing/Deletion**: Not in requirements, kept scope to create and read only
3. **Advanced Analytics**: No charts, graphs, or detailed breakdowns beyond simple total
4. **Export Functionality**: No CSV/PDF export as it wasn't required
5. **Expense Attachments**: No receipt uploads or file attachments
6. **Recurring Expenses**: No support for automated recurring entries
7. **Budget Management**: No budget setting or tracking against limits
8. **Multi-currency Support**: Only INR support, no currency conversion
9. **Offline Mode**: No service worker or offline capability
10. **Real-time Updates**: No WebSocket for multi-tab synchronization

## Production Deployment

### Environment Variables

Create `.env` files in both backend and frontend:

**Backend `.env`:**
```
PORT=5000
FRONTEND_URL=<your-frontend-url>
NODE_ENV=production
```

**Frontend `.env`:**
```
REACT_APP_API_URL=<your-backend-url>
```

### Build for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```
Deploy the `build` folder to your static hosting service.

## Testing

### Manual Testing Checklist
- [ ] Create expense with valid data
- [ ] Try creating expense with negative amount (should fail)
- [ ] Submit same expense multiple times (idempotency)
- [ ] Filter by each category
- [ ] Sort by date
- [ ] Refresh page after adding expense
- [ ] Check responsive design on mobile

## Troubleshooting

### Common Issues

1. **Port already in use**: Change ports in backend `index.ts` or frontend `package.json` proxy
2. **CORS errors**: Ensure backend CORS is configured for frontend URL
3. **Database locked**: Close other SQLite connections
4. **Module not found**: Run `npm install` in both directories

## Future Enhancements

- User authentication and multi-user support
- Expense categories management
- Data export (CSV/PDF)
- Charts and analytics
- Budget tracking
- Recurring expenses
- Mobile app

## Documentation

For detailed technical documentation including data flow, architecture decisions, and component details, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)

## License

ISC

## Support

For issues or questions, please open an issue in the repository.

---

Built with ❤️ for production-quality expense tracking