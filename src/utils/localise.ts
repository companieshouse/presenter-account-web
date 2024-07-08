import { LanguageNames, LocalesService } from "@companieshouse/ch-node-utils";
import { env } from "../config/index";
import { i18nCh } from "@companieshouse/ch-node-utils";
import { Request } from "express";

export const selectLang = (lang: any): string => {
    switch (lang) {
            case "cy": return "cy";
            case "en":
            default: return "en";
    }
};

export const addLangToUrl = (url: string, lang: string | undefined): string => {
    if (lang === undefined || lang === "") {
        return url;
    }
    if (url.includes("?")) {
        return url + "&lang=" + lang.toLowerCase();
    } else {
        return url + "?lang=" + lang.toLowerCase();
    }
};

export const getLocaleInfo = (locales: LocalesService, lang: string) => {
    return {
        languageEnabled: locales.enabled,
        languages: LanguageNames.sourceLocales(locales.localesFolder),
        i18n: locales.i18nCh.resolveNamespacesKeys(lang),
        lang
    };
};

const localesSevice = LocalesService.getInstance(env.LOCALES_PATH, env.LOCALES_ENABLED);
export const getLocalesService = () => localesSevice;

export function getLocalesField(fieldName: string, req: Request): string {
    const QUERY_LANG = "lang";

    try {
        const language = req.query.lang ? selectLang(req.query.lang) : req.session?.getExtraData<string>(QUERY_LANG);
        const localesPath = localesSevice.localesFolder;
        const locales = i18nCh.getInstance(localesPath);
        return locales.resolveSingleKey(fieldName, language as string);
    } catch (e){
        throw new Error(`Unable to get locales file with ${fieldName}: ${e}`);
    }

}
