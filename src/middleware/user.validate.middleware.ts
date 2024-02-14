import { Handler } from "express";
import { cleanSession, getPresenterAccountDetails } from "../utils/session";
import { PrefixedUrls } from "../constants";

/**
 * Validate User checks the user logged in is the user that
 * created the original session, if not clean the session
 * and redirect back to the start page.
 *
 * @param req http request
 * @param res http response
 * @param next the next handler in the chain
 */
export const validateUserMiddleware: Handler = (req, res, next) => {

    const userLoggedIn = req.session?.data?.signin_info?.user_profile?.id;
    const sessionUser = getPresenterAccountDetails(req)?.userId;

    if (userLoggedIn && sessionUser && userLoggedIn !== sessionUser) {
        cleanSession(req);
        res.redirect(PrefixedUrls.HOME);
    } else {
        next();
    }
};
