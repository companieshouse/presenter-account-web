// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Router } from "express";
import indexRouter from "./routers/indexRouter";
import { errorHandler, pageNotFound } from "./routers/handlers/errors";

const routerDispatch = (app: Application) => {

    const router = Router();

    app.use("/", indexRouter);
    app.use("*", pageNotFound);
};

export default routerDispatch;
