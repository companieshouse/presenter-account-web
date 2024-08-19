import { Application, Router } from "express";
import { HomeRouter, HealthCheckRouter, CheckDetailsRouter, ConfirmationRouter, EnterYourDetailsRouter, ConfirmCompanyRouter, CompanySearchRouter } from "./routers";
import { errorHandler, pageNotFound } from "./routers/handlers/errors";
import { sessionMiddleware } from "./middleware/session.middleware";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import { commonTemplateVariablesMiddleware } from "./middleware/common.variables.middleware";
import { Urls, servicePathPrefix } from "./constants";
import { validateUserMiddleware } from "./middleware/user.validate.middleware";
import { featureFlagMiddleware } from "./middleware/feature.flag.middleware";
import { localeMiddleware } from "./middleware/locale.middleware";
import { LocalesMiddleware } from "@companieshouse/ch-node-utils";

const routerDispatch = (app: Application) => {

    const router = Router();


    app.use(servicePathPrefix, router);
    router.use(LocalesMiddleware());

    router.use(Urls.HEALTHCHECK, HealthCheckRouter);


    router.use(featureFlagMiddleware);

    router.use(Urls.HOME, HomeRouter);

    router.use("/", sessionMiddleware);


    // ------------- Enable login redirect -----------------
    const userAuthRegex = /^\/.+/;
    router.use(userAuthRegex, authenticationMiddleware);
    router.use(userAuthRegex, validateUserMiddleware);
    router.use(localeMiddleware);
    router.use(Urls.COMPANY_SEARCH, CompanySearchRouter);
    router.use(Urls.CONFIRM_COMPANY, ConfirmCompanyRouter);
    router.use(Urls.ENTER_YOUR_DETAILS, EnterYourDetailsRouter);
    router.use(Urls.CHECK_DETAILS, CheckDetailsRouter);
    router.use(Urls.CONFIRMATION, ConfirmationRouter);

    app.use(commonTemplateVariablesMiddleware);
    app.use(errorHandler);
    app.use("*", pageNotFound);
};

export default routerDispatch;
