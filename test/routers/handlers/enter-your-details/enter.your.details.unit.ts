import { session } from "../../../mocks/session.middleware.mock";

import app from "../../../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../../../src/constants";
import { Details } from "private-api-sdk-node/src/services/presenter-account/types";
import { EnterYourDetailsErrorMessages } from "../../../../src/utils/error_manifests/enter.your.details.errors";
import { examplePresenterAccountDetails } from "../../../mocks/example.presenter.account.details.mock";
import { PRESENTER_ACCOUNT_SESSION_KEY } from "../../../../src/utils/session";
import { success } from "@companieshouse/api-sdk-node/dist/services/result";

describe("validate form fields", () => {

    it.only("should render the enter your details page", async () => {
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        const resp = await request(app).get(PrefixedUrls.ENTER_YOUR_DETAILS);
        expect(resp.status).toBe(200);
        expect(resp.text).toContain("What is your correspondence address?");
    });


    // it("should display error after post if premises querystring field empty",  async () => {
    //     const details = examplePresenterAccountDetails;

    //     await request(app).post(PrefixedUrls.ENTER_YOUR_DETAILS).send(details).expect(302).expect("Location", PrefixedUrls.ENTER_YOUR_DETAILS);
    // });

    // it("should display error if address line 1 empty", () => {
    //     expect(resp.text).toContain(EnterYourDetailsErrorMessages.ADDRESS_LINE_1_BLANK);
    // });

    // it("should display error if town or city empty", () => {
    //     session.setExtraData(
    //         PRESENTER_ACCOUNT_SESSION_KEY,
    //         examplePresenterAccountDetails
    //     );
    //     expect(resp.text).toContain(EnterYourDetailsErrorMessages.TOWN_OR_CITY_BLANK);
    // });

    // it("should display error if post code empty", () => {
    //     session.setExtraData(
    //         PRESENTER_ACCOUNT_SESSION_KEY,
    //         examplePresenterAccountDetails
    //     );
    //     expect(resp.text).toContain(EnterYourDetailsErrorMessages.POST_CODE_BLANK);
    // });

    // it("should display error if country empty", () => {
    //     session.setExtraData(
    //         PRESENTER_ACCOUNT_SESSION_KEY,
    //         examplePresenterAccountDetails
    //     );

    //     expect(resp.text).toContain(EnterYourDetailsErrorMessages.COUNTRY_BLANK);
    // });

    // it("should display error after post if premises querystring field empty", () => {
    //     session.setExtraData(
    //         PRESENTER_ACCOUNT_SESSION_KEY,
    //         examplePresenterAccountDetails
    //     );

    //     expect(resp2.text).not.toContain(EnterYourDetailsErrorMessages.PREMISES_BLANK);
    // });

    // it("should display error if address line 1 empty", () => {
    //     session.setExtraData(
    //         PRESENTER_ACCOUNT_SESSION_KEY,
    //         examplePresenterAccountDetails
    //     );

    //     expect(resp2.text).not.toContain(EnterYourDetailsErrorMessages.ADDRESS_LINE_1_BLANK);
    // });

    // it("should display error if town or city empty", () => {
    //     session.setExtraData(
    //         PRESENTER_ACCOUNT_SESSION_KEY,
    //         examplePresenterAccountDetails
    //     );

    //     expect(resp2.text).not.toContain(EnterYourDetailsErrorMessages.TOWN_OR_CITY_BLANK);
    // });

    // it("should display error if post code empty", () => {
    //     session.setExtraData(
    //         PRESENTER_ACCOUNT_SESSION_KEY,
    //         examplePresenterAccountDetails
    //     );

    //     expect(resp2.text).not.toContain(EnterYourDetailsErrorMessages.POST_CODE_BLANK);
    // });

    // it("should display error if country empty", () => {
    //     session.setExtraData(
    //         PRESENTER_ACCOUNT_SESSION_KEY,
    //         examplePresenterAccountDetails
    //     );

    //     expect(resp2.text).not.toContain(EnterYourDetailsErrorMessages.COUNTRY_BLANK);
    // });

});
