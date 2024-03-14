import { PrefixedUrls } from "../constants";
import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import { cleanSession, getPresenterAccountDetails } from "../utils/session";

/**
 * Middleware to ensure that presenter account details are present in the session.
 *
 * This middleware checks for presenter account details in the user's session. If the details are not found,
 * or an error occurs while retrieving them, the middleware will log the error, clear the session, and redirect
 * the user to the home page.
 *
 * @param {Request} req - The express request object, which should contain the session information.
 * @param {Response} res - The express response object, used to redirect if necessary.
 * @param {NextFunction} next - The next middleware function in the express stack to be executed.
 */
export function requirePresenterAccountDetailsMiddleware(req: Request, res: Response, next: NextFunction) {
    const pageIfDetailsAreIncorrect = PrefixedUrls.HOME;

    try {
        const details = getPresenterAccountDetails(req);
        if (details === undefined) {
            logger.error(`Unable to find required presenter account details in session. Redirecting to hoem page.`);
            return res.redirect(pageIfDetailsAreIncorrect);
        }

        // Presenter account details are in session and are correct type.
        next();
    } catch (error) {
        logger.error(`Presenter account detaails in session are of incorrect type. Clearing details and redirecting to the home spage for a new submission.`);
        cleanSession(req);

        return res.redirect(pageIfDetailsAreIncorrect);
    }
}
