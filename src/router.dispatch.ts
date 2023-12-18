// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Router } from "express";
import { HomeRouter, HealthCheckRouter } from "./routers";
import { healthcheckUrl, servicePathPrefix } from "./utils/constants/urls";
import { errorHandler, pageNotFound } from "./routers/handlers/errors";

const routerDispatch = (app: Application) => {

    const router = Router();
    app.use(servicePathPrefix, router);

    router.use("/", HomeRouter);
    router.use(healthcheckUrl, HealthCheckRouter);

    app.use(errorHandler);
    app.use("*", pageNotFound);
};

export default routerDispatch;
