import app from "../../../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../../../src/constants";
import { Address } from "private-api-sdk-node/src/services/presenter-account/types";
import { EnterYourDetailsErrorMessages } from "../../../../src/utils/error_manifests/enter.your.details.errors";
import { examplePresenterAccountDetails } from "../../../mocks/example.presenter.account.details.mock";

describe("validate form fields", async () => {
    const resp = await request(app).post(PrefixedUrls.ENTER_YOUR_DETAILS).send({} as Address);
    const resp2 = await request(app).post(PrefixedUrls.ENTER_YOUR_DETAILS).send(examplePresenterAccountDetails.address as Address);

    it("should render the enter your details page", async () => {
        const resp = await request(app).get(PrefixedUrls.ENTER_YOUR_DETAILS);
        expect(resp.status).toBe(200);
        expect(resp.text).toContain("What is your correspondence address?");
    });


    it("should display error after post if premises querystring field empty",  async () => {
        expect(resp.text).toContain(EnterYourDetailsErrorMessages.PREMISES_BLANK);
    });

    it("should display error if address line 1 empty", () => {
        expect(resp.text).toContain(EnterYourDetailsErrorMessages.ADDRESS_LINE_1_BLANK);
    });

    it("should display error if town or city empty", () => {
        expect(resp.text).toContain(EnterYourDetailsErrorMessages.TOWN_OR_CITY_BLANK);
    });

    it("should display error if post code empty", () => {
        expect(resp.text).toContain(EnterYourDetailsErrorMessages.POST_CODE_BLANK);
    });

    it("should display error if country empty", () => {
        expect(resp.text).toContain(EnterYourDetailsErrorMessages.COUNTRY_BLANK);
    });

    it("should display error after post if premises querystring field empty",  async () => {
        expect(resp2.text).not.toContain(EnterYourDetailsErrorMessages.PREMISES_BLANK);
    });

    it("should display error if address line 1 empty", () => {
        expect(resp2.text).not.toContain(EnterYourDetailsErrorMessages.ADDRESS_LINE_1_BLANK);
    });

    it("should display error if town or city empty", () => {
        expect(resp2.text).not.toContain(EnterYourDetailsErrorMessages.TOWN_OR_CITY_BLANK);
    });

    it("should display error if post code empty", () => {
        expect(resp2.text).not.toContain(EnterYourDetailsErrorMessages.POST_CODE_BLANK);
    });

    it("should display error if country empty", () => {
        expect(resp2.text).not.toContain(EnterYourDetailsErrorMessages.COUNTRY_BLANK);
    });

});
