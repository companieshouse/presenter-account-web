import { session } from "../../../mocks/session.middleware.mock";
import mockCsrfProtectionMiddleware from "../../../mocks/csrf.protection.middleware.mock";

import app from "../../../../src/app";
import request from "supertest";
import { ContextKeys, ExternalUrls, PrefixedUrls } from "../../../../src/constants";
import { examplePresenterAccountDetails } from "../../../mocks/example.presenter.account.details.mock";
import fs from "fs";
import path from "path";
import { getRequestWithCookie, setCookie } from "../../../helper/requests";

let details;
const fortyCharacters = "90476895878092274478155001661579qwertyui";

describe("validate form fields", () => {

    enum ErrorMessagesEnglish {
        // Blank Error Messages
        PREMISES_BLANK = "Property name or number is required",
        ADDRESS_LINE_1_BLANK = "Address line 1 is required",
        TOWN_OR_CITY_BLANK = "Town or city is required",
        POST_CODE_BLANK = "Postcode is required",
        COUNTRY_BLANK = "Please select a country",
        FIRST_NAME_BLANK = "First name is required",
        LAST_NAME_BLANK = "Last name is required",

        // Length Error Messages
        PREMISES_LENGTH = "Property name or number must be 40 characters or less",
        ADDRESS_LINE_1_LENGTH = "Address line 1 must be 40 characters or less",
        ADDRESS_LINE_2_LENGTH = "Address line 2 must be 40 characters or less",
        TOWN_OR_CITY_LENGTH = "City or town must be 40 characters or less",
        POST_CODE_LENGTH = "Postcode/zip code must be 10 characters or less",
        FIRST_NAME_LENGTH = "First name must be 32 characters or less",
        LAST_NAME_LENGTH = "Last name must be 40 characters or less",

        // Invalid Character
        PREMISES_INVALID_CHARACTER = "Property name or number must have only valid characters",
        ADDRESS_LINE_1_INVALID_CHARACTER = "Address line 1 must have only valid characters",
        ADDRESS_LINE_2_INVALID_CHARACTER = "Address line 2 must have only valid characters",
        TOWN_OR_CITY_INVALID_CHARACTER = "Town or city must have only valid characters",
        POST_CODE_INVALID_CHARACTER = "Postcode must have only valid characters",
        FIRST_NAME_INVALID_CHARACTER = "First name must contain only valid characters",
        LAST_NAME_INVALID_CHARACTER = "Last name must contain only valid characters"
    }

    beforeEach(() => {
        mockCsrfProtectionMiddleware.mockClear();
    });

    it("should throw an error when no session", async () => {
        await getRequestWithCookie(PrefixedUrls.ENTER_YOUR_DETAILS).expect(500);
    });

    it(`should throw error when session ${ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY} not set`, async () => {
        session.setExtraData(
            'some random session',
            examplePresenterAccountDetails
        );
        const resp = await getRequestWithCookie(PrefixedUrls.ENTER_YOUR_DETAILS);
        expect(resp.statusCode).toEqual(500);
    });

    it(`should render the enter your details page when session ${ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY} set`, async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        const resp = await getRequestWithCookie(PrefixedUrls.ENTER_YOUR_DETAILS).expect(200);
        expect(resp.text).toContain("What is your correspondence address?");
    });

    it(`should render the enter your details page in Welsh with all translations when session ${ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY} and language set to Welsh`, async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );
        const welshTranslationsPath = path.join(__dirname, "./../../../../locales/cy/enter-your-details.json");

        const data = fs.readFileSync(welshTranslationsPath, 'utf8');
        const translationsWithoutErrors = JSON.parse(data);
        delete translationsWithoutErrors.enter_your_details_validation_errors;

        const resp = await getRequestWithCookie(PrefixedUrls.ENTER_YOUR_DETAILS + "?lang=cy").expect(200);
        Object.entries(translationsWithoutErrors).forEach(translation => expect(resp.text.replace(/&#39;/g, "'")).toContain(translation[1]));
    });

    it("Should not cache the HTMl on this page", async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        await getRequestWithCookie(PrefixedUrls.ENTER_YOUR_DETAILS)
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
            examplePresenterAccountDetails
        );

        const response = await request(app).post(PrefixedUrls.ENTER_YOUR_DETAILS)
            .set("Cookie", setCookie())
            .send({
                country: "choose" }).expect(200);

        expect(response.text).toContain(ErrorMessagesEnglish.PREMISES_BLANK);
        expect(response.text).toContain(ErrorMessagesEnglish.ADDRESS_LINE_1_BLANK);
        expect(response.text).toContain(ErrorMessagesEnglish.TOWN_OR_CITY_BLANK);
        expect(response.text).toContain(ErrorMessagesEnglish.POST_CODE_BLANK);
        expect(response.text).toContain(ErrorMessagesEnglish.COUNTRY_BLANK);
        expect(response.text).toContain(ErrorMessagesEnglish.FIRST_NAME_BLANK);
        expect(response.text).toContain(ErrorMessagesEnglish.LAST_NAME_BLANK);
    });

    it("should display errors for fields that go above max length",  async () => {
        session.setExtraData("lang", "en");
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );
        const testLength = fortyCharacters + "x";
        const response = await request(app).post(PrefixedUrls.ENTER_YOUR_DETAILS)
            .set("Cookie", setCookie())
            .send({
                ...examplePresenterAccountDetails.address,
                premises: testLength,
                addressLine1: testLength,
                addressLine2: testLength,
                postCode: testLength.substring(0, 11),
                townOrCity: testLength,
                forename: testLength.slice(0, 33),
                surname: testLength }).expect(200);

        expect(response.text).toContain(ErrorMessagesEnglish.PREMISES_LENGTH);
        expect(response.text).toContain(ErrorMessagesEnglish.ADDRESS_LINE_1_LENGTH);
        expect(response.text).toContain(ErrorMessagesEnglish.ADDRESS_LINE_2_LENGTH);
        expect(response.text).toContain(ErrorMessagesEnglish.POST_CODE_LENGTH);
        expect(response.text).toContain(ErrorMessagesEnglish.TOWN_OR_CITY_LENGTH);
        expect(response.text).toContain(ErrorMessagesEnglish.FIRST_NAME_LENGTH);
        expect(response.text).toContain(ErrorMessagesEnglish.LAST_NAME_LENGTH);
    });

    it.each([[fortyCharacters.slice(0, 39), fortyCharacters.slice(0, 9), fortyCharacters.slice(0, 31)], ["x", "y", "z"], [fortyCharacters, fortyCharacters.substring(0, 10), fortyCharacters.slice(0, 32)]])("should not display errors for fields that are beneath or equal to max length",  async (testLength: string, testLength2: string, testLength3: string) => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );
        const response = await request(app).post(PrefixedUrls.ENTER_YOUR_DETAILS)
            .set("Cookie", setCookie())
            .send({
                ...examplePresenterAccountDetails.address,
                premises: testLength,
                addressLine1: testLength,
                addressLine2: testLength,
                postCode: testLength2,
                townOrCity: testLength,
                forename: testLength3,
                surname: testLength }).expect(302);

        expect(response.text).not.toContain(ErrorMessagesEnglish.PREMISES_LENGTH);
        expect(response.text).not.toContain(ErrorMessagesEnglish.ADDRESS_LINE_1_LENGTH);
        expect(response.text).not.toContain(ErrorMessagesEnglish.ADDRESS_LINE_2_LENGTH);
        expect(response.text).not.toContain(ErrorMessagesEnglish.POST_CODE_LENGTH);
        expect(response.text).not.toContain(ErrorMessagesEnglish.TOWN_OR_CITY_LENGTH);
        expect(response.text).not.toContain(ErrorMessagesEnglish.FIRST_NAME_LENGTH);
        expect(response.text).not.toContain(ErrorMessagesEnglish.LAST_NAME_LENGTH);
    });

    it("Should display errors for invalid fields", async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );
        const response = await request(app).post(PrefixedUrls.ENTER_YOUR_DETAILS + "?lang=en")
            .set("Cookie", setCookie())
            .send({
                ...examplePresenterAccountDetails.address,
                premises: "§§",
                postCode: "§§",
                townOrCity: "§§",
                addressLine1: "±±",
                addressLine2: "±±",
                forename: "§§",
                surname: "§§"
            }).expect(200);

        expect(response.text).toContain(ErrorMessagesEnglish.PREMISES_INVALID_CHARACTER);
        expect(response.text).toContain(ErrorMessagesEnglish.ADDRESS_LINE_1_INVALID_CHARACTER);
        expect(response.text).toContain(ErrorMessagesEnglish.ADDRESS_LINE_2_INVALID_CHARACTER);
        expect(response.text).toContain(ErrorMessagesEnglish.POST_CODE_INVALID_CHARACTER);
        expect(response.text).toContain(ErrorMessagesEnglish.TOWN_OR_CITY_INVALID_CHARACTER);
        expect(response.text).toContain(ErrorMessagesEnglish.FIRST_NAME_INVALID_CHARACTER);
        expect(response.text).toContain(ErrorMessagesEnglish.LAST_NAME_INVALID_CHARACTER);

    });

    it("should redirect when no errors displayed",  async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        details = { ...examplePresenterAccountDetails };

        await request(app).post(PrefixedUrls.ENTER_YOUR_DETAILS)
            .set("Cookie", setCookie())
            .query(details.address).send({ ...details.address, ...details.name }).expect(302)
            .expect("Location", PrefixedUrls.CHECK_DETAILS);
    });

    it("Should display the correct feeback url for enter_your_details page", async () => {
        const resp = await getRequestWithCookie(PrefixedUrls.ENTER_YOUR_DETAILS);
        expect(resp.text).toContain(
            ExternalUrls.FEEDBACK
        );
    });
});

describe("Validate form fields with Welsh display", () => {

    enum ErrorMessagesWelsh {
        PREMISES_BLANK = "Mae angen enw a rhif eiddo",
        ADDRESS_LINE_1_BLANK = "Cyfeiriad 1 yn ofynnol",
        TOWN_OR_CITY_BLANK = "Mae angen dinas neu dref",
        POST_CODE_BLANK = "Mae angen cod post",
        COUNTRY_BLANK = "Dewiswch wlad",

        PREMISES_LENGTH = "Rhaid i enw neu rif eiddo fod yn 40 nod neu lai.",
        ADDRESS_LINE_1_LENGTH = "Rhaid i linell cyfeiriad 1 fod yn 40 nod neu lai",
        ADDRESS_LINE_2_LENGTH = "Rhaid i linell cyfeiriad 2 fod yn 40 nod neu lai",
        TOWN_OR_CITY_LENGTH = "Rhaid i&#39;r dref neu&#39;r dref fod yn 40 nod neu lai",
        POST_CODE_LENGTH = "Rhaid i&#39;r cod post / cod zip fod yn 10 nod neu lai",

        PREMISES_INVALID_CHARACTER = "Rhaid i enw neu rif eiddo fod â chymeriadau dilys yn unig.",
        ADDRESS_LINE_1_INVALID_CHARACTER = "Rhaid i linell cyfeiriad 1 gael nodau dilys yn unig",
        ADDRESS_LINE_2_INVALID_CHARACTER = "Rhaid i linell cyfeiriad 2 gael nodau dilys yn unig",
        TOWN_OR_CITY_INVALID_CHARACTER = "Rhaid i&#39;r dref neu&#39;r ddinas fod â chymeriadau dilys yn unig",
        POST_CODE_INVALID_CHARACTER = "Rhaid i&#39;r &#39; â chymeriadau dilys yn unig"
    }

    it.each([[fortyCharacters.slice(0, 20), fortyCharacters.slice(0, 5)], ["x", "y"], [fortyCharacters, fortyCharacters.substring(0, 10)]])("should not display errors for fields that are beneath or equal to max length for Welsh ",  async (testLength: string, testLength2: string) => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );
        const response = await request(app).post(PrefixedUrls.ENTER_YOUR_DETAILS)
            .set("Cookie", setCookie())
            .send({
                ...examplePresenterAccountDetails.address,
                premises: testLength,
                addressLine1: testLength,
                addressLine2: testLength,
                postCode: testLength2,
                townOrCity: testLength,
                ...examplePresenterAccountDetails.name }).expect(302);

        expect(response.text).not.toContain(ErrorMessagesWelsh.PREMISES_LENGTH);
        expect(response.text).not.toContain(ErrorMessagesWelsh.ADDRESS_LINE_1_LENGTH);
        expect(response.text).not.toContain(ErrorMessagesWelsh.ADDRESS_LINE_2_LENGTH);
        expect(response.text).not.toContain(ErrorMessagesWelsh.POST_CODE_LENGTH);
        expect(response.text).not.toContain(ErrorMessagesWelsh.TOWN_OR_CITY_LENGTH);
    });

    it("should display Welsh errors for fields that go above max length",  async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );
        const testLength = fortyCharacters + "x";
        const response = await request(app).post(PrefixedUrls.ENTER_YOUR_DETAILS + "?lang=cy")
            .set("Cookie", setCookie())
            .send({
                ...examplePresenterAccountDetails.address,
                premises: testLength,
                addressLine1: testLength,
                addressLine2: testLength,
                postCode: testLength.substring(0, 11),
                townOrCity: testLength }).expect(200);

        expect(response.text).toContain(ErrorMessagesWelsh.PREMISES_LENGTH);
        expect(response.text).toContain(ErrorMessagesWelsh.ADDRESS_LINE_1_LENGTH);
        expect(response.text).toContain(ErrorMessagesWelsh.ADDRESS_LINE_2_LENGTH);
        expect(response.text).toContain(ErrorMessagesWelsh.POST_CODE_LENGTH);
        expect(response.text).toContain(ErrorMessagesWelsh.TOWN_OR_CITY_LENGTH);
    });

    it("should display Welsh errors for missing mandatory fields",  async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        const response = await request(app).post(PrefixedUrls.ENTER_YOUR_DETAILS + "?lang=cy")
            .set("Cookie", setCookie())
            .send({
                country: "choose" }).expect(200);

        expect(response.text).toContain(ErrorMessagesWelsh.PREMISES_BLANK);
        expect(response.text).toContain(ErrorMessagesWelsh.ADDRESS_LINE_1_BLANK);
        expect(response.text).toContain(ErrorMessagesWelsh.TOWN_OR_CITY_BLANK);
        expect(response.text).toContain(ErrorMessagesWelsh.POST_CODE_BLANK);
        expect(response.text).toContain(ErrorMessagesWelsh.COUNTRY_BLANK);
    });

    it("should display Welsh error title",  async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        const response = await request(app).post(PrefixedUrls.ENTER_YOUR_DETAILS + "?lang=cy")
            .set("Cookie", setCookie())
            .send({
                country: "choose" }).expect(200);

        expect(response.text).toContain("Mae yna broblem");
    });

    it("should translate page title to Welsh",  async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        const response = await getRequestWithCookie(PrefixedUrls.ENTER_YOUR_DETAILS + "?lang=cy");

        expect(response.text).toContain("<title>Beth yw eich cyfeiriad gohebiaeth?</title>");
    });

    describe("Check backUrl for enter your details page", () => {
        it(`should set backurl as ${PrefixedUrls.CONFIRM_COMPANY}?companyNumber=007`, async () => {
            session.setExtraData(
                ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
                examplePresenterAccountDetails
            );

            const response = await getRequestWithCookie(PrefixedUrls.ENTER_YOUR_DETAILS + "?lang=en");

            expect(response.text).toContain("/confirm-company?companyNumber=007");
            expect(response.text).not.toContain("/enter-business-name");
        });

        it(`should set backurl as ${PrefixedUrls.ENTER_BUSINESS_NAME}`, async () => {
            const details = { ...examplePresenterAccountDetails, companyNumber: undefined };
            session.setExtraData(
                ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
                details
            );

            const response = await getRequestWithCookie(PrefixedUrls.ENTER_YOUR_DETAILS + "?lang=en");

            expect(response.text).not.toContain("/confirm-company?companyNumber=007");
            expect(response.text).toContain("/enter-business-name");
        });
    });
});
