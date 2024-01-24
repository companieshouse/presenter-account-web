import { Application, Router } from "express";
import { HomeRouter, HealthCheckRouter, CheckDetailsRouter, ApplyToFileOptionsRouter, YouCannotUseThisServiceRouter, ConfirmationRouter } from "./routers";
import { errorHandler, pageNotFound } from "./routers/handlers/errors";
import { sessionMiddleware } from "./middleware/session.middleware";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import { commonTemplateVariablesMiddleware } from "./middleware/common.variables.middleware";
import { Urls, servicePathPrefix } from "./constants";

const routerDispatch = (app: Application) => {

    const router = Router();
    app.use(servicePathPrefix, router);

    router.use(Urls.HOME, HomeRouter);
    router.use(Urls.HEALTHCHECK, HealthCheckRouter);
    router.use(Urls.APPLY_TO_FILE_OPTIONS, ApplyToFileOptionsRouter);
    router.use(Urls.YOU_CANNOT_USE_THIS_SERVICE, YouCannotUseThisServiceRouter);

    router.use("/", sessionMiddleware);

    // ------------- Enable login redirect -----------------
    const userAuthRegex = /^\/.+/;
    router.use(userAuthRegex, authenticationMiddleware);

    router.use(Urls.CHECK_DETAILS, CheckDetailsRouter);
    router.use(Urls.CONFIRMATION, ConfirmationRouter);

    app.use(commonTemplateVariablesMiddleware);
    app.use(errorHandler);
    app.use("*", pageNotFound);
};

export default routerDispatch;
