
const LANG_PARAM = new RegExp(/[?|&]lang=[a-zA-Z]{2}/);
const END_OF_LINE_LANG_PARAM = new RegExp(LANG_PARAM.source + "$");
const NON_END_OF_LINE_LANG_PARAM = /(?<JOINER>[?|&])lang=[a-zA-Z]{2}[?|&]/;

export function removeLangFromUrl(url: string): string {
    const lowerCaseUrl = url.toLocaleLowerCase();
    if (!RegExp(LANG_PARAM).exec(lowerCaseUrl)) {
        return lowerCaseUrl;
    }
    if (RegExp(END_OF_LINE_LANG_PARAM).exec(lowerCaseUrl)){
        return lowerCaseUrl.replace(END_OF_LINE_LANG_PARAM, "");
    }
    return lowerCaseUrl.replace(NON_END_OF_LINE_LANG_PARAM, "$<JOINER>");
}
