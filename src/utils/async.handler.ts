import { Handler, NextFunction, Request, Response } from "express";

/**
 * Wraps an async handler and passes any error to the next middleware in the chain.
 *
 * @param fn The async handler function to be wrapped
 * @returns A new handler function that will catch and pass on any exceptions thrown by the wrapped function
 */
export function wrapAsyncHandlerWithErrorHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): Handler {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (e) {
            // Pass the error to the next middleware
            next(e);
        }
    };
}
