import { NextFunction, Request, Response } from "express";
import { getLocaleInfo, getLocalesService, selectLang } from "../utils/localise";

const QUERY_LANG = "lang";

export function localeMiddleware(req: Request, res: Response, next: NextFunction) {
    const session_value = req.session?.getExtraData<string>(QUERY_LANG);
    // adding language functionality
    const query_value = req.query.lang;
    const lang = selectLang(query_value || session_value);
    const locales = getLocalesService();

    if (req.session) {
        req.session.setExtraData("lang", lang);
    }

    Object.assign(res.locals, getLocaleInfo(locales, lang));
    next();
}
