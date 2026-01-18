"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = exports.ApiError = void 0;
// Custom error class for API errors
class ApiError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
    }
}
exports.ApiError = ApiError;
// Error handler middleware
const errorHandler = (err, req, res, _next) => {
    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        body: req.body
    });
    // Determine status code
    let statusCode = 500;
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
    }
    // Send error response
    res.status(statusCode).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
exports.errorHandler = errorHandler;
// Not found handler
const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: 'Resource not found',
        path: req.url
    });
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorHandler.js.map