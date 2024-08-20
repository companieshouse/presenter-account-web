import { session } from "../../../mocks/session.middleware.mock";

import app from "../../../../src/app";
import request from "supertest";
import { ContextKeys, ExternalUrls, PrefixedUrls } from "../../../../src/constants";
import { paDetailsWithIsBusinessRegisteredFalse } from "../../../mocks/example.presenter.account.details.mock";

const eightyCharacters = "éêëēĕėęěĝģğġĥħìíîïĩīĭįĵķĺļľŀłñńņňŋòóôõöøōŏőǿœŕŗřśŝşšţťŧùúûüũūŭůűųŵẁẃẅỳýŷÿźżž]*$/";

describe("validate form fields", () => {

    enum ErrorMessagesEnglish {
        BUSINESS_NAME_BLANK = "Enter the business name.",
        BUSINESS_NAME_LENGTH = "Business name must be 80 characters or less",
        BUSINESS_NAME_INVALID_CHARACTER = "Business name must contain only valid characters"
    }
    enum ScreenFieldsEnglish{
        "ENTER_BUSINESS_NAME_TITLE" = "What is the name of the business?",
        "ENTER_BUSINESS_NAME_TITLE_INFO" = "If you&#39;re a sole trader, you should give your own name if you do not have a different business name that you trade under."
    }


    it("should throw an error when no session", async () => {
        const response = await request(app).get(PrefixedUrls.ENTER_BUSINESS_NAME).expect(500);
        expect(response.text).not.toContain("What is the name of the business?");
        expect(response.text).toContain("Sorry there is a problem with the service");
    });

    it(`should throw error when session ${ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY} not set`, async () => {
        session.setExtraData(
            'some random session',
            paDetailsWithIsBusinessRegisteredFalse
        );

        await request(app).get(PrefixedUrls.ENTER_BUSINESS_NAME).expect(500);
    });

    it(`should render the enter business name page when session ${ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY} set`, async () => {

        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredFalse
        );

        const resp = await request(app).get(PrefixedUrls.ENTER_BUSINESS_NAME).expect(200);
        expect(resp.text).toContain("What is the name of the business?");
    });

    it(`should render the enter business name page in Welsh with all translations when session ${ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY} and language set to English`, async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredFalse
        );

        const resp = await request(app).get(PrefixedUrls.ENTER_BUSINESS_NAME + "?lang=en").expect(200);
        expect(resp.text).toContain(ScreenFieldsEnglish.ENTER_BUSINESS_NAME_TITLE);
        expect(resp.text).toContain(ScreenFieldsEnglish.ENTER_BUSINESS_NAME_TITLE_INFO);
    });

    it("Should not cache the HTMl on this page", async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredFalse
        );

        await request(app)
            .get(PrefixedUrls.ENTER_BUSINESS_NAME)
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

        const response = await request(app).post(PrefixedUrls.ENTER_BUSINESS_NAME).send(paDetailsWithIsBusinessRegisteredFalse).expect(200);

        expect(response.text).toContain(ErrorMessagesEnglish.BUSINESS_NAME_BLANK);
    });

    it("should display errors for fields that go above max length",  async () => {
        paDetailsWithIsBusinessRegisteredFalse.businessName = eightyCharacters + "x";
        session.setExtraData("lang", "en");
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredFalse
        );
        const response = await request(app).post(PrefixedUrls.ENTER_BUSINESS_NAME).send(paDetailsWithIsBusinessRegisteredFalse).expect(200);

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
        const response = await request(app).post(PrefixedUrls.ENTER_BUSINESS_NAME).send(paDetailsWithIsBusinessRegisteredFalse).expect(302).expect("Location", PrefixedUrls.ENTER_YOUR_DETAILS);

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
        const response = await request(app).post(PrefixedUrls.ENTER_BUSINESS_NAME).send(paDetailsWithIsBusinessRegisteredFalse).expect(200);

        expect(response.text).toContain(ErrorMessagesEnglish.BUSINESS_NAME_INVALID_CHARACTER);
        expect(response.text).not.toContain(ErrorMessagesEnglish.BUSINESS_NAME_LENGTH);

    });

    it("Should display the correct feeback url for enter_business_name page", async () => {
        const resp = await request(app).get(PrefixedUrls.ENTER_BUSINESS_NAME);
        expect(resp.text).toContain(
            ExternalUrls.FEEDBACK
        );
    });
});

describe("Validate form fields with Welsh display", () => {

    enum ErrorMessagesWelsh {
        BUSINESS_NAME_BLANK = "[CY]Enter the business name.[CY]",
        BUSINESS_NAME_LENGTH = "[CY]Business name must be 80 characters or less[CY]",
        BUSINESS_NAME_INVALID_CHARACTER = "[CY]Business name must contain only valid characters[CY]"
    }
    enum ScreenFieldsWelsh{
        "ENTER_BUSINESS_NAME_TITLE" = "[CY]What is the name of the business?[CY]",
        "ENTER_BUSINESS_NAME_TITLE_INFO" = "[CY]If you&#39;re a sole trader, you should give your own name if you do not have a different business name that you trade under.[CY]"
    }
    it("should display Welsh errors for fields that go above max length",  async () => {
        paDetailsWithIsBusinessRegisteredFalse.businessName = eightyCharacters + "x";
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredFalse
        );
        const response = await request(app).post(PrefixedUrls.ENTER_BUSINESS_NAME + "?lang=cy").send(paDetailsWithIsBusinessRegisteredFalse).expect(200);

        expect(response.text).toContain(ErrorMessagesWelsh.BUSINESS_NAME_LENGTH);
    });

    it("should display Welsh errors for missing mandatory fields",  async () => {
        paDetailsWithIsBusinessRegisteredFalse.businessName = null;
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredFalse
        );

        const response = await request(app).post(PrefixedUrls.ENTER_BUSINESS_NAME + "?lang=cy").send(paDetailsWithIsBusinessRegisteredFalse).expect(200);

        expect(response.text).toContain(ErrorMessagesWelsh.BUSINESS_NAME_BLANK);
        // expect(response.text).toContain("Mae yna broblem");
    });


    it(`should render the enter business name page in Welsh with all translations when session ${ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY} and language set to Welsh`, async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredFalse
        );

        const resp = await request(app).get(PrefixedUrls.ENTER_BUSINESS_NAME + "?lang=cy").expect(200);
        expect(resp.text).toContain(ScreenFieldsWelsh.ENTER_BUSINESS_NAME_TITLE);
        expect(resp.text).toContain(ScreenFieldsWelsh.ENTER_BUSINESS_NAME_TITLE_INFO);
    });

    it("should translate page title to Welsh",  async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            paDetailsWithIsBusinessRegisteredFalse
        );

        const response = await request(app).get(PrefixedUrls.ENTER_BUSINESS_NAME + "?lang=cy");

        expect(response.text).toContain(`<title>${ScreenFieldsWelsh.ENTER_BUSINESS_NAME_TITLE}</title>`);
    });
});
