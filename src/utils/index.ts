import { servicePathPrefix } from "../constants";
import { Handler, Request } from "express";

type Predicate<T> = (x: T) => boolean;

export function skipIf (predicate: Predicate<Request>, handler: Handler): Handler {
    return (req, res, next) => {
        if (!predicate(req)) {
            handler(req, res, next);
        } else {
            next();
        }
    };
}

export function getRelativeUrl (req: Request): string {
    return (req.baseUrl + req.path).slice(servicePathPrefix.length);
}

export function addressToQueryString (address: Record<string, any>): string {
    return Object.keys(address)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(address[key]))
        .join('&');
}
