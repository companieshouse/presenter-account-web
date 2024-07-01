
const LANG_PARAM = new RegExp(/[?|&]lang=[a-zA-Z]{2}/);
const END_OF_LINE_LANG_PARAM = new RegExp(LANG_PARAM.source + "$");
const NON_END_OF_LINE_LANG_PARAM = /lang=[a-zA-Z]{2}[?|&]/;

export function removeLangFromUrl(url: string): string {
    const lowerCaseUrl = url.toLocaleLowerCase();
    // No lang query in url
    if (!RegExp(LANG_PARAM).exec(lowerCaseUrl)) {
        return lowerCaseUrl;
    }
    // lang query at the end of the url
    if (RegExp(END_OF_LINE_LANG_PARAM).exec(lowerCaseUrl)){
        return lowerCaseUrl.replace(END_OF_LINE_LANG_PARAM, "");
    }
    // lang query not at the end of the url
    return lowerCaseUrl.replace(NON_END_OF_LINE_LANG_PARAM, "");
}
