import app from "../../../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../../../src/constants";

describe("is business registered", () => {

    it("should land on page with the correct title", async () => {
        const resp = await request(app).get(PrefixedUrls.IS_BUSINESS_REGISTERED);

        expect(resp.status).toBe(200);
        expect(resp.text).toContain("Is the business you work for registered with Companies House?");
        expect(resp.text).not.toContain("Select yes if the business is registered with Companies House");

    });

    it("should display error message when trying to continue without selecting a radio buttom", async () => {
        const resp = await request(app).post(PrefixedUrls.IS_BUSINESS_REGISTERED);

        expect(resp.status).toBe(200);
        expect(resp.text).toContain("Select yes if the business is registered with Companies House");
    });

    it("should redirect to company number when 'yes' radio buttom is selected", async () => {
        const resp = await request(app).post(PrefixedUrls.IS_BUSINESS_REGISTERED).send({
            "is-business-registered": "true"
        });

        expect(resp.status).toBe(302);
        expect(resp.text).toContain("Redirecting to company-search");
    });

    it("should redirect to business name when 'no' radio buttom is selected", async () => {
        const resp = await request(app).post(PrefixedUrls.IS_BUSINESS_REGISTERED).send({
            "is-business-registered": "false"
        });

        expect(resp.status).toBe(302);
        expect(resp.text).toContain("Redirecting to enter-business-name");
    });
});


