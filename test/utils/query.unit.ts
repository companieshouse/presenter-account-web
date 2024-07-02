import { removeLangFromUrl } from "../../src/utils/query";

describe("Test remove lang from url", () => {
    test("Test removeLangFromUrl with url without queries and lang set", async () => {
        const URL = "test.test.url";
        const URL_WITH_LANG = URL + "?lang=en";
        const RESULT = URL;
        expect(removeLangFromUrl(URL_WITH_LANG)).toBe(RESULT);
    });
    test("Test removeLangFromUrl with url with queries and lang set", async () => {
        const URL = "test.test.url?foo=bar";
        const URL_WITH_LANG = "test.test.url?foo=bar&lang=cy";
        const RESULT = URL;
        expect(removeLangFromUrl(URL_WITH_LANG)).toBe(RESULT);
    });
    test("Test removeLangFromUrl with url without queries and uppercase lang set", async () => {
        const URL = "test.test.url";
        const RESULT = URL;
        const URL_WITH_LANG = URL + "?LANG=EN";
        expect(removeLangFromUrl(URL_WITH_LANG)).toBe(RESULT);
    });
    test("Test removeLangFromUrl with url with queries and uppercase lang set", async () => {
        const URL = "test.test.url";
        const URL_WITH_LANG = URL + "?LANG=CY&foo=bar";
        const RESULT = URL + "?foo=bar";
        expect(removeLangFromUrl(URL_WITH_LANG)).toBe(RESULT);
    });
    test("Test removeLangFromUrl with url with more queries and uppercase lang set", async () => {
        const URL = "test.test.url";
        const URL_WITH_LANG = URL + "?abc=abc&LANG=CY&foo=bar";
        const RESULT = URL + "?abc=abc&foo=bar";
        expect(removeLangFromUrl(URL_WITH_LANG)).toBe(RESULT);
    });
    test("Test removeLangFromUrl with url without queries and no lang set", async () => {
        const URL = "test.test.url";
        expect(removeLangFromUrl(URL)).toBe(URL);
    });
});

