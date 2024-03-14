import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to prevent caching by setting appropriate HTTP headers.
 * @param req - The incoming request.
 * @param res - The outgoing response.
 * @param next - The next middleware function in the application’s request-response cycle.
 */
export function noCacheMiddleware(_req: Request, res: Response, next: NextFunction): void {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');

    next();
}
