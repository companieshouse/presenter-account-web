import { Application, Router } from "express";
import { HomeRouter, HealthCheckRouter, CheckDetailsRouter, ConfirmationRouter, EnterYourDetailsRouter, ConfirmCompanyRouter, CompanySearchRouter, IsBusinessRegisteredRouter, EnterBusinessNameRouter } from "./routers";
import { csrfErrorHandler, errorHandler, pageNotFound } from "./routers/handlers/errors";
import { COOKIE_CONFIG, sessionMiddleware } from "./middleware/session.middleware";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import { commonTemplateVariablesMiddleware } from "./middleware/common.variables.middleware";
import { Urls, servicePathPrefix } from "./constants";
import { validateUserMiddleware } from "./middleware/user.validate.middleware";
import { featureFlagMiddleware } from "./middleware/feature.flag.middleware";
import { localeMiddleware } from "./middleware/locale.middleware";
import { LocalesMiddleware } from "@companieshouse/ch-node-utils";
import helmet from "helmet";
import { prepareCSPConfig } from "./middleware/content.policy.middleware";
import { CsrfProtectionMiddleware } from "@companieshouse/web-security-node";
import { EnsureSessionCookiePresentMiddleware, SessionStore } from "@companieshouse/node-session-handler";
import { createLoggerMiddleware } from "@companieshouse/structured-logging-node";
import { env } from "./config";
import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";
import { assignCspNonce } from "./middleware/csp.nonce.middleware";

const routerDispatch = (app: Application) => {
    const router = Router();

    const sessionStore = setupSessionStore();

    const csrfMiddlewareOptions = setupCSRFOptions(sessionStore);

    // Assign the nonce value to be accessible within views
    const nonce = uuidv4();
    app.use(assignCspNonce(nonce));

    app.use(servicePathPrefix, router);
    router.use(LocalesMiddleware());

    router.use(Urls.HEALTHCHECK, HealthCheckRouter);

    router.use(featureFlagMiddleware);

    router.use(Urls.HOME, HomeRouter);

    router.use("/", sessionMiddleware(sessionStore));

    router.use(createLoggerMiddleware(env.APP_NAME));

    // ------------- Enable login redirect -----------------
    const userAuthRegex = /^\/.+/;
    router.use(userAuthRegex, authenticationMiddleware);
    router.use(EnsureSessionCookiePresentMiddleware(COOKIE_CONFIG));
    // It is important that CSRF Protection follows the Session and urlencoded Middlewares
    router.use(CsrfProtectionMiddleware(csrfMiddlewareOptions));
    router.use(helmet(prepareCSPConfig(nonce)));
    router.use(userAuthRegex, validateUserMiddleware);
    router.use(localeMiddleware);
    // Pages that are accessible after auth has taken place
    afterAuthPages(router);

    app.use(commonTemplateVariablesMiddleware);

    errorPageHandlers(app);

};

const afterAuthPages = (router: Router) => {
    router.use(Urls.IS_BUSINESS_REGISTERED, IsBusinessRegisteredRouter);
    router.use(Urls.COMPANY_SEARCH, CompanySearchRouter);
    router.use(Urls.CONFIRM_COMPANY, ConfirmCompanyRouter);
    router.use(Urls.ENTER_BUSINESS_NAME, EnterBusinessNameRouter);
    router.use(Urls.ENTER_YOUR_DETAILS, EnterYourDetailsRouter);
    router.use(Urls.CHECK_DETAILS, CheckDetailsRouter);
    router.use(Urls.CONFIRMATION, ConfirmationRouter);
};

const setupSessionStore = () => {
    const redis = new Redis(env.CACHE_SERVER);
    const sessionStore = new SessionStore(redis);
    return sessionStore;
};

const setupCSRFOptions = (sessionStore: SessionStore) => {
    return {
        sessionStore,
        enabled: true,
        sessionCookieName: env.COOKIE_NAME
    };
};

const errorPageHandlers = (app: Application) => {
    app.use(csrfErrorHandler);
    app.use(errorHandler);
    app.use("*", pageNotFound);
};


export default routerDispatch;



