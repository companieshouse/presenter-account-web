import app from "../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../src/constants";

describe("company search tests", () => {
    it("should redirect to the company lookup service", async () => {
        const resp = await request(app).get(PrefixedUrls.COMPANY_SEARCH);

        expect(resp.status).toBe(302);
        const redirect = resp.header["location"];
        expect(redirect).toContain(PrefixedUrls.CONFIRM_COMPANY);
    });
});
