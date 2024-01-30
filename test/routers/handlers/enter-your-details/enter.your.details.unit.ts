import { session } from "../../../mocks/session.middleware.mock";

import app from "../../../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../../../src/constants";
import { examplePresenterAccountDetails } from "../../../mocks/example.presenter.account.details.mock";
import { PRESENTER_ACCOUNT_SESSION_KEY } from "../../../../src/utils/session";
import { EnterYourDetailsErrorMessages } from "../../../../src/utils/error_manifests/enter.your.details.errors";

let details;

describe("validate form fields", () => {

    beforeEach(() => {
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        details = { ...examplePresenterAccountDetails };

    });

    it.only("should render the enter your details page", async () => {
        const resp = await request(app).get(PrefixedUrls.ENTER_YOUR_DETAILS).expect(200);
        expect(resp.text).toContain("What is your correspondence address?");
    });

    it.only("should display errors for missing mandatory fields",  async () => {
        const response = await request(app).post(PrefixedUrls.ENTER_YOUR_DETAILS).send({ country: "Select a country" }).expect(200);

        expect(response.text).toContain(EnterYourDetailsErrorMessages.PREMISES_BLANK);
        expect(response.text).toContain(EnterYourDetailsErrorMessages.ADDRESS_LINE_1_BLANK);
        expect(response.text).toContain(EnterYourDetailsErrorMessages.TOWN_OR_CITY_BLANK);
        expect(response.text).toContain(EnterYourDetailsErrorMessages.POST_CODE_BLANK);
        expect(response.text).toContain(EnterYourDetailsErrorMessages.COUNTRY_BLANK);
    });

    it.only("should redirect when no errors displayed",  async () => {
        const response = await request(app).post(PrefixedUrls.ENTER_YOUR_DETAILS).query(details).send(details.address);
        expect(response.status).toBe(302);
    });
});
