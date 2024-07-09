import { NextFunction, Request, Response } from "express";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { env } from "../config";
import { removeLangFromUrl } from "../utils/query";
import { Urls, PrefixedUrls } from "../constants";
export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const CHS_URL = env.CHS_URL;
    const RETURN_URL = getReturnCallbackURL(req);
    const authMiddlewareConfig: AuthOptions = {
        chsWebUrl: CHS_URL,
        returnUrl: removeLangFromUrl(RETURN_URL)
    };

    return authMiddleware(authMiddlewareConfig)(req, res, next);
};

function getReturnCallbackURL(req: Request){
    if (req.originalUrl.endsWith(Urls.CONFIRMATION)){
    // Returns the home URL, since the journey is completed
        return PrefixedUrls.HOME;
    } else {
        return req.originalUrl;
    }
}
