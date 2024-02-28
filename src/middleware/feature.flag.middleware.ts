import { Handler } from "express";
import { env } from '../config';

/**
 * Feature flag for presenter account. Default value is true.
 * @param req http request
 * @param res http response
 * @param next the next handler in the chain
 */
export const featureFlagMiddleware: Handler = (_req, res, next) => {
    console.log(env.FEATURE_FLAG_PRESENTER_ACCOUNT_280224);
    if(!env.FEATURE_FLAG_PRESENTER_ACCOUNT_280224){
        res.render("partials/error_404");
    }
    next();
};
