import { session } from "../../../mocks/session.middleware.mock";

import app from "../../../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../../../src/constants";
import { examplePresenterAccountDetails } from "../../../mocks/example.presenter.account.details.mock";
import { PRESENTER_ACCOUNT_SESSION_KEY } from "../../../../src/utils/session";
import { EnterYourDetailsErrorMessages } from "../../../../src/utils/error_manifests/enter.your.details.errors";

let details;
const fortyCharacters = "90476895878092274478155001661579qwertyui";

describe("validate form fields", () => {

    it("should throw an error when no session", async () => {
        await request(app).get(PrefixedUrls.ENTER_YOUR_DETAILS).expect(500);
    });

    it(`should throw error when session ${PRESENTER_ACCOUNT_SESSION_KEY} not set`, async () => {
        session.setExtraData(
            'some random session',
            examplePresenterAccountDetails
        );

        await request(app).get(PrefixedUrls.ENTER_YOUR_DETAILS).expect(500);
    });

    it(`should render the enter your details page when session ${PRESENTER_ACCOUNT_SESSION_KEY} set`, async () => {
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        const resp = await request(app).get(PrefixedUrls.ENTER_YOUR_DETAILS).expect(200);
        expect(resp.text).toContain("What is your correspondence address?");
    });

    it("should display errors for missing mandatory fields",  async () => {
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        const response = await request(app).post(PrefixedUrls.ENTER_YOUR_DETAILS).send({
            country: "choose" }).expect(200);

        expect(response.text).toContain(EnterYourDetailsErrorMessages.PREMISES_BLANK);
        expect(response.text).toContain(EnterYourDetailsErrorMessages.ADDRESS_LINE_1_BLANK);
        expect(response.text).toContain(EnterYourDetailsErrorMessages.TOWN_OR_CITY_BLANK);
        expect(response.text).toContain(EnterYourDetailsErrorMessages.POST_CODE_BLANK);
        expect(response.text).toContain(EnterYourDetailsErrorMessages.COUNTRY_BLANK);
    });

    it("should display errors for fields that go above max length",  async () => {
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );
        const testLength = fortyCharacters + "x";
        const response = await request(app).post(PrefixedUrls.ENTER_YOUR_DETAILS).send({
            ...examplePresenterAccountDetails.address,
            premises: testLength,
            addressLine1: testLength,
            addressLine2: testLength,
            postCode: testLength.substring(0, 11),
            townOrCity: testLength }).expect(200);

        expect(response.text).toContain(EnterYourDetailsErrorMessages.PREMISES_LENGTH);
        expect(response.text).toContain(EnterYourDetailsErrorMessages.ADDRESS_LINE_1_LENGTH);
        expect(response.text).toContain(EnterYourDetailsErrorMessages.ADDRESS_LINE_2_LENGTH);
        expect(response.text).toContain(EnterYourDetailsErrorMessages.POST_CODE_LENGTH);
        expect(response.text).toContain(EnterYourDetailsErrorMessages.TOWN_OR_CITY_LENGTH);
    });

    it.each([[fortyCharacters.slice(0, 20), fortyCharacters.slice(0, 5)], ["x", "y"], [fortyCharacters, fortyCharacters.substring(0, 10)]])("should not display errors for fields that are beneath or equal to max length",  async (testLength: string, testLength2: string) => {
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );
        const response = await request(app).post(PrefixedUrls.ENTER_YOUR_DETAILS).send({
            ...examplePresenterAccountDetails.address,
            premises: testLength,
            addressLine1: testLength,
            addressLine2: testLength,
            postCode: testLength2,
            townOrCity: testLength }).expect(302);

        expect(response.text).not.toContain(EnterYourDetailsErrorMessages.PREMISES_LENGTH);
        expect(response.text).not.toContain(EnterYourDetailsErrorMessages.ADDRESS_LINE_1_LENGTH);
        expect(response.text).not.toContain(EnterYourDetailsErrorMessages.ADDRESS_LINE_2_LENGTH);
        expect(response.text).not.toContain(EnterYourDetailsErrorMessages.POST_CODE_LENGTH);
        expect(response.text).not.toContain(EnterYourDetailsErrorMessages.TOWN_OR_CITY_LENGTH);
    });

    it("should redirect when no errors displayed",  async () => {
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        details = { ...examplePresenterAccountDetails };

        await request(app).post(PrefixedUrls.ENTER_YOUR_DETAILS)
            .query(details.address).send(details.address).expect(302)
            .expect("Location", PrefixedUrls.CHECK_DETAILS);
    });
});
