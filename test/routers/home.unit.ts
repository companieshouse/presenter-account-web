import app from "../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../src/constants";
import { env } from "../../src/config";


describe("home page tests", () => {
    it("should render the home page when GDS feature flag is off", async () => {
        const HEADING = "Apply to file with Companies House using software";
        // @ts-expect-error need to overwrite ReadOnly environment variables to test GDS start page feature flag
        env.FEATURE_FLAG_GDS_START_PAGE_290424 = false;
        const resp = await request(app).get(PrefixedUrls.HOME);

        expect(resp.status).toBe(200);
        expect(resp.text).toContain(HEADING);
    });

    it("should render the enter your details page when GDS feature flag is on and in Welsh language", async () => {
        // @ts-expect-error need to overwrite ReadOnly environment variables to test GDS start page feature flag
        env.FEATURE_FLAG_GDS_START_PAGE_290424 = true;
        const resp = await request(app).get(PrefixedUrls.HOME + "?lang=cy");
        expect(resp.status).toBe(302);
        expect(resp.text).toContain(PrefixedUrls.IS_BUSINESS_REGISTERED + "?lang=cy");
    });

    it("should render the enter your details page when GDS feature flag is on and in English language", async () => {
        // @ts-expect-error need to overwrite ReadOnly environment variables to test GDS start page feature flag
        env.FEATURE_FLAG_GDS_START_PAGE_290424 = true;
        const resp = await request(app).get(PrefixedUrls.HOME + "?lang=en");
        expect(resp.status).toBe(302);
        expect(resp.text).toContain(PrefixedUrls.IS_BUSINESS_REGISTERED + "?lang=en");
    });

    it("should render the enter your details page when GDS feature flag is on and with default English language", async () => {
        // @ts-expect-error need to overwrite ReadOnly environment variables to test GDS start page feature flag
        env.FEATURE_FLAG_GDS_START_PAGE_290424 = true;
        const resp = await request(app).get(PrefixedUrls.HOME);
        expect(resp.status).toBe(302);
        expect(resp.text).toContain(PrefixedUrls.IS_BUSINESS_REGISTERED + "?lang=en");
    });

});
