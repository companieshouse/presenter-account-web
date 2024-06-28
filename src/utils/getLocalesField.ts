import { i18nCh } from "@companieshouse/ch-node-utils";
import { Request } from "express";
import path from "path";

export function getLocalesField(fieldName: string, req: Request): string {
    try {
        const language = req.query.lang || "en";
        const localesPath = path.join(__dirname, "../../locales/");
        const locales = i18nCh.getInstance(localesPath);
        return locales.resolveSingleKey(fieldName, language as string);
    } catch (e){
        throw new Error(`Unable to get locales file with ${fieldName}: ${e}`);
    }

}
