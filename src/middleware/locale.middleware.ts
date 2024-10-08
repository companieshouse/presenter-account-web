import { NextFunction, Request, Response } from "express";
import { getLanguageChoice, getLocaleInfo, getLocalesService } from "../utils/localise";
import { QueryParameters } from "../constants";

// This set the localesService and set the key values thats are required
// for the locale for each template.
export function localeMiddleware(req: Request, res: Response, next: NextFunction) {

    // If LOCALES_ENABLED false only set to english
    const lang = getLanguageChoice(req);
    const locales = getLocalesService();

    if (req.session) {
        req.session.setExtraData(QueryParameters.LANG, lang);
    }

    Object.assign(res.locals, getLocaleInfo(locales, lang));
    next();
}
