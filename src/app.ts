import express, { Request, Response, NextFunction } from "express";
import nunjucks from "nunjucks";
import path from "path";
import { logger } from "./utils/logger";
import routerDispatch from "./router.dispatch";
import cookieParser from "cookie-parser";
import { env } from './config';
import { ExternalUrls, PrefixedUrls, Urls, servicePathPrefix } from "./constants";
import cors from "cors";

const app = express();

app.use(cors());

// const viewPath = path.join(__dirname, "/views");
app.set("views", [
    path.join(__dirname, "views"),
    path.join(__dirname, "node_modules/govuk-frontend"),
    path.join(__dirname, "../node_modules/govuk-frontend"), // This if for when using ts-node since the working directory is src
    path.join(__dirname, "node_modules/govuk-frontend/components")
]);

const nunjucksLoaderOpts = {
    watch: env.NUNJUCKS_LOADER_WATCH,
    noCache: env.NUNJUCKS_LOADER_NO_CACHE
};

const njk = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(app.get("views"),
                                  nunjucksLoaderOpts)
);

njk.express(app);
app.set("view engine", "njk");

// Serve static files
app.use(express.static(path.join(__dirname, "../assets/public")));
// app.use("/assets", express.static("./../node_modules/govuk-frontend/govuk/assets"));

njk.addGlobal("cdnUrlCss", env.CDN_URL_CSS);
njk.addGlobal("cdnUrlJs", env.CDN_URL_JS);
njk.addGlobal("cdnHost", env.CDN_HOST);
njk.addGlobal("chsUrl", env.CHS_URL);
njk.addGlobal("ExternalUrls", ExternalUrls);
njk.addGlobal("Urls", Urls);
njk.addGlobal("servicePathPrefix", servicePathPrefix);
njk.addGlobal("PrefixedUrls", PrefixedUrls);


// parse body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// apply middleware
app.use(cookieParser());

// Unhandled errors
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    logger.error(`${err.name} - appError: ${err.message} - ${err.stack}`);
    res.render("partials/error_500");
});

// Channel all requests through router dispatch
routerDispatch(app);

logger.info("presenter account web has started");

// Unhandled exceptions
process.on("uncaughtException", (err: any) => {
    logger.error(`${err.name} - uncaughtException: ${err.message} - ${err.stack}`);
    process.exit(1);
});

// Unhandled promise rejections
process.on("unhandledRejection", (err: any) => {
    logger.error(`${err.name} - unhandledRejection: ${err.message} - ${err.stack}`);
    process.exit(1);
});

export default app;
