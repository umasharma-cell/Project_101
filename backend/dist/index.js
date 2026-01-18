"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const expenses_1 = __importDefault(require("./routes/expenses"));
const errorHandler_1 = require("./middleware/errorHandler");
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging middleware
app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// API routes
app.use('/api', expenses_1.default);
// Error handlers (must be last)
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
// Initialize database and start server
const startServer = async () => {
    try {
        await (0, db_1.initializeDatabase)();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
            console.log(`API endpoints:`);
            console.log(`  POST   http://localhost:${PORT}/api/expenses`);
            console.log(`  GET    http://localhost:${PORT}/api/expenses`);
            console.log(`  GET    http://localhost:${PORT}/api/expenses/:id`);
            console.log(`  GET    http://localhost:${PORT}/api/expenses/stats`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
//# sourceMappingURL=index.js.map