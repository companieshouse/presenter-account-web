import { Handler } from "express";
import { env } from '../config';
import { logger } from "../utils/logger";

/**
 * Feature flag for presenter account. Default value is true.
 * @param req http request
 * @param res http response
 * @param next the next handler in the chain
 */
export const featureFlagMiddleware: Handler = (_req, res, next) => {

    if (!env.FEATURE_FLAG_PRESENTER_ACCOUNT_280224) {
        logger.info("Attempt to reach site while the feature flag is disabled");
        res.render("partials/error_404");
    } else {
        next();
    }
};
