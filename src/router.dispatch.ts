// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Router } from "express";
import { HomeRouter, HealthCheckRouter, CheckDetailsRouter } from "./routers";
import { errorHandler, pageNotFound } from "./routers/handlers/errors";
import { sessionMiddleware } from "./middleware/session.middleware";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import { commonTemplateVariablesMiddleware } from "./middleware/common.variables.middleware";
import detailsRouter from "./routers/details.router";
import { Urls, servicePathPrefix } from "./constants";

const routerDispatch = (app: Application) => {

    const router = Router();
    app.use(servicePathPrefix, router);

    router.use(Urls.HOME, HomeRouter);
    router.use(Urls.HEALTHCHECK, HealthCheckRouter);

    router.use("/", sessionMiddleware);

    // ------------- Enable login redirect -----------------
    const userAuthRegex = /^\/.+/;
    router.use(userAuthRegex, authenticationMiddleware);

    // TODO: remove befiore committed
    router.use(detailsRouter);

    router.use(CheckDetailsRouter);

    // TODO: this endpoint is a dummy authenticated endpoint used for testing AOAF-280. Remove this endpoint once AOAF-280 has completed testing.
    router.get('/post-sign', (req, res) => {
        return res.send('Welcome presenter account service');
    });

    app.use(commonTemplateVariablesMiddleware);
    app.use(errorHandler);
    app.use("*", pageNotFound);
};

export default routerDispatch;
