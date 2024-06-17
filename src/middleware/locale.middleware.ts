import { NextFunction, Request, Response } from "express";
import { getLocaleInfo, getLocalesService, selectLang } from "../utils/localise";
// import {LocalesMiddleware} from "@companieshouse/ch-node-utils";


export function localeMiddleware(req: Request, res: Response, next: NextFunction) {
    // LocalesMiddleware()(req, res, next);
    // adding language functionality
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();

    Object.assign(res.locals, getLocaleInfo(locales, lang));
    next();
}