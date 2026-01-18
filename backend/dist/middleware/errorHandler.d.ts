import { Request, Response, NextFunction } from 'express';
export declare class ApiError extends Error {
    statusCode: number;
    constructor(message: string, statusCode?: number);
}
export declare const errorHandler: (err: Error | ApiError, req: Request, res: Response, _next: NextFunction) => void;
export declare const notFoundHandler: (req: Request, res: Response) => void;
//# sourceMappingURL=errorHandler.d.ts.map