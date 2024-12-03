import { session } from "../../../mocks/session.middleware.mock";
import mockCsrfProtectionMiddleware from "../../../mocks/csrf.protection.middleware.mock";

import app from "../../../../src/app";
import request from "supertest";
import { ContextKeys, ExternalUrls, PrefixedUrls } from "../../../../src/constants";
import { paDetailsWithIsBusinessRegisteredFalse, paDetailsWithIsBusinessRegisteredTrue } from "../../../mocks/example.presenter.account.details.mock";
import { getRequestWithCookie, setCookie } from "../../../helper/requests";

const eightyCharacters = "éêëēĕėęěĝģğġĥħìíîïĩīĭįĵķĺļľŀłñńņňŋòóôõöøōŏőǿœŕŗřśŝşšţťŧùúûüũūŭůűųŵẁẃẅỳýŷÿźżž]*$/";

describe("validate form fields", () => {

    beforeEach(() => {
        mockCsrfProtectionMiddleware.mockClear();
    });

    enum ErrorMessagesEnglish {
        BUSINESS_NAME_BLANK = "Enter the business name.",
        BUSINESS_NAME_LENGTH = "Business name must be 80 characters or less",
        BUSINESS_NAME_INVALID_CHARACTER = "Business name must contain only valid characters"
    }
    enum ScreenFieldsEnglish{
        ENTER_BUSINESS_NAME_TITLE = "What is the name of the business?",
        ENTER_BUSINESS_NAME_TITLE_INFO = "If you&#39;re a sole trader, you should give your own name if you do not have a different business name that you trade under."
    }

    it("should throw an error when no session", async () => {
        const response = await getRequestWithCookie(PrefixedUrls.ENTER_BUSINESS_NAME).expect(500);
        expect(response.text).not.toContain("What is the name of the business?");
        expect(response.text).toContain("Sorry there is a problem with the service");
    });

    it(`should throw error when session ${ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY} not set`, async () => {
        session.setExtraData(
            'some random session',
            paDetailsWithIsBusinessRegisteredFalse
        );

        await getRequestWithCookie(PrefixedUrls.ENTER_BUSINESS_NAME).expect(500);
    });

    it(`should render the enter business name page when session ${ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY} set`, async () => {

        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredFalse
        );

        const resp = await getRequestWithCookie(PrefixedUrls.ENTER_BUSINESS_NAME).expect(200);
        expect(resp.text).toContain("What is the name of the business?");
    });

    it(`should render the enter business name page in Welsh with all translations when session ${ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY} and language set to English`, async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredFalse
        );

        const resp = await getRequestWithCookie(PrefixedUrls.ENTER_BUSINESS_NAME + "?lang=en").expect(200);
        expect(resp.text).toContain(ScreenFieldsEnglish.ENTER_BUSINESS_NAME_TITLE);
        expect(resp.text).toContain(ScreenFieldsEnglish.ENTER_BUSINESS_NAME_TITLE_INFO);
    });

    it("Should not cache the HTMl on this page", async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredFalse
        );

        await getRequestWithCookie(PrefixedUrls.ENTER_BUSINESS_NAME)
            .expect(200)
            .expect('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
            .expect('Pragma', 'no-cache')
            .expect('Expires', '0')
            .expect('Surrogate-Control', 'no-store');
    });

    it("should display errors for missing mandatory fields",  async () => {
        session.deleteExtraData("lang");
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredFalse
        );

        const response = await request(app).post(PrefixedUrls.ENTER_BUSINESS_NAME).send(paDetailsWithIsBusinessRegisteredFalse)
            .set("Cookie", setCookie()).expect(200);

        expect(response.text).toContain(ErrorMessagesEnglish.BUSINESS_NAME_BLANK);
    });

    it("should display errors for fields that go above max length",  async () => {
        paDetailsWithIsBusinessRegisteredFalse.businessName = eightyCharacters + "x";
        session.setExtraData("lang", "en");
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredFalse
        );
        const response = await request(app).post(PrefixedUrls.ENTER_BUSINESS_NAME).send(paDetailsWithIsBusinessRegisteredFalse)
            .set("Cookie", setCookie()).expect(200);

        expect(response.text).toContain(ErrorMessagesEnglish.BUSINESS_NAME_LENGTH);
        expect(response.text).not.toContain(ErrorMessagesEnglish.BUSINESS_NAME_INVALID_CHARACTER);
    });

    it("should redirect when no errors displayed",  async () => {
        paDetailsWithIsBusinessRegisteredFalse.businessName = eightyCharacters;
        session.setExtraData("lang", "en");
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredFalse
        );
        const response = await request(app).post(PrefixedUrls.ENTER_BUSINESS_NAME).send(paDetailsWithIsBusinessRegisteredFalse)
            .set("Cookie", setCookie()).expect(302).expect("Location", PrefixedUrls.ENTER_YOUR_DETAILS);

        expect(response.text).not.toContain(ErrorMessagesEnglish.BUSINESS_NAME_LENGTH);
        expect(response.text).not.toContain(ErrorMessagesEnglish.BUSINESS_NAME_INVALID_CHARACTER);
        expect(response.text).toContain(`Redirecting to ${PrefixedUrls.ENTER_YOUR_DETAILS}`);
    });

    it("Should display errors for invalid business name", async () => {
        paDetailsWithIsBusinessRegisteredFalse.businessName = "§§";
        session.setExtraData("lang", "en");
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredFalse
        );
        const response = await request(app).post(PrefixedUrls.ENTER_BUSINESS_NAME).send(paDetailsWithIsBusinessRegisteredFalse)
            .set("Cookie", setCookie()).expect(200);

        expect(response.text).toContain(ErrorMessagesEnglish.BUSINESS_NAME_INVALID_CHARACTER);
        expect(response.text).not.toContain(ErrorMessagesEnglish.BUSINESS_NAME_LENGTH);

    });

    it("Should display the correct feeback url for enter_business_name page", async () => {
        const resp = await getRequestWithCookie(PrefixedUrls.ENTER_BUSINESS_NAME);
        expect(resp.text).toContain(
            ExternalUrls.FEEDBACK
        );
    });

    it("Should throw error when IsBusinessRegistered is true", async () => {
        session.setExtraData("lang", "en");
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredTrue
        );
        const response = await getRequestWithCookie(PrefixedUrls.ENTER_BUSINESS_NAME).send(paDetailsWithIsBusinessRegisteredTrue).expect(500);
        expect(response.text).not.toContain(ScreenFieldsEnglish.ENTER_BUSINESS_NAME_TITLE);
        expect(response.text).not.toContain(ScreenFieldsEnglish.ENTER_BUSINESS_NAME_TITLE_INFO);
    });
});

describe("Validate form fields with Welsh display", () => {

    enum ErrorMessagesWelsh {
        BUSINESS_NAME_BLANK = "Cofnodwch enw busnes",
        BUSINESS_NAME_LENGTH = "Rhaid i&#39;r enw busnes fod yn 80 nod neu lai",
        BUSINESS_NAME_INVALID_CHARACTER = "Rhaid i&#39;r enw busnes gynnwys nodau dilys yn unig"
    }
    enum ScreenFieldsWelsh{
        ENTER_BUSINESS_NAME_TITLE = "Beth yw enw&#39;r busnes?",
        ENTER_BUSINESS_NAME_TITLE_INFO = "Os ydych yn unig fasnachwr, dylech roi enw eich hun os nad oes gennych enw busnes gwahanol yr ydych yn masnachu o dan."
    }
    it("should display Welsh errors for fields that go above max length",  async () => {
        paDetailsWithIsBusinessRegisteredFalse.businessName = eightyCharacters + "x";
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredFalse
        );
        const response = await request(app).post(PrefixedUrls.ENTER_BUSINESS_NAME + "?lang=cy").send(paDetailsWithIsBusinessRegisteredFalse)
            .set("Cookie", setCookie()).expect(200);

        expect(response.text).toContain(ErrorMessagesWelsh.BUSINESS_NAME_LENGTH);
    });

    it("should display Welsh errors for missing mandatory fields",  async () => {
        paDetailsWithIsBusinessRegisteredFalse.businessName = "";
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredFalse
        );

        const response = await request(app).post(PrefixedUrls.ENTER_BUSINESS_NAME + "?lang=cy")
            .send(paDetailsWithIsBusinessRegisteredFalse).expect(200)
            .set("Cookie", setCookie());

        expect(response.text).toContain(ErrorMessagesWelsh.BUSINESS_NAME_BLANK);
    });


    it(`should render the enter business name page in Welsh with all translations when session ${ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY} and language set to Welsh`, async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredFalse
        );

        const resp = await getRequestWithCookie(PrefixedUrls.ENTER_BUSINESS_NAME + "?lang=cy").expect(200);
        expect(resp.text).toContain(ScreenFieldsWelsh.ENTER_BUSINESS_NAME_TITLE);
        expect(resp.text).toContain(ScreenFieldsWelsh.ENTER_BUSINESS_NAME_TITLE_INFO);
    });

    it("should translate page title to Welsh",  async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredFalse
        );

        const response = await getRequestWithCookie(PrefixedUrls.ENTER_BUSINESS_NAME + "?lang=cy");

        expect(response.text).toContain(`<title>${ScreenFieldsWelsh.ENTER_BUSINESS_NAME_TITLE}</title>`);
    });
});
