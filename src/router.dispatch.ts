// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Router } from "express";
import { HomeRouter, HealthCheckRouter } from "./routers";
import { COMPANY_AUTH_PROTECTED_BASE, healthcheckUrl, servicePathPrefix } from "./utils/constants/urls";
import { errorHandler, pageNotFound } from "./routers/handlers/errors";
import { sessionMiddleware } from "./middleware/session.middleware";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import { companyAuthenticationMiddleware } from "./middleware/company.authentication.middleware";
import { commonTemplateVariablesMiddleware } from "./middleware/common.variables.middleware";

const routerDispatch = (app: Application) => {

    const router = Router();
    app.use(servicePathPrefix, router);

    router.use("/", HomeRouter);
    router.use(healthcheckUrl, HealthCheckRouter);

    router.use("/", sessionMiddleware);

    // ------------- Enable login redirect -----------------
    const userAuthRegex = /^\/.+/;
    router.use(userAuthRegex, authenticationMiddleware);
    router.use(`${COMPANY_AUTH_PROTECTED_BASE}`, companyAuthenticationMiddleware);

    app.use(commonTemplateVariablesMiddleware);
    app.use(errorHandler);
    app.use("*", pageNotFound);
};

export default routerDispatch;
