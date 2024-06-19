import { NextFunction, Request, Response } from "express";
import { getLocaleInfo, getLocalesService, selectLang } from "../utils/localise";


export function localeMiddleware(req: Request, res: Response, next: NextFunction) {
    // adding language functionality
    const lang = selectLang(req.query.lang);
    const locales = getLocalesService();

    Object.assign(res.locals, getLocaleInfo(locales, lang));
    next();
}
