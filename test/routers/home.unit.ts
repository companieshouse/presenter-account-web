import app from "../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../src/constants";
import { App } from "supertest/types";
import { env } from "../../src/config";


describe("home page tests", () => {
    
    it("should render the home page when GDS feature flag is off", async () => {
        const HEADING = "Apply to file with Companies House using software";
        //@ts-ignore
        env.FEATURE_FLAG_GDS_START_PAGE_290424 = false;        

        const resp = await request(app).get(PrefixedUrls.HOME);

        expect(resp.status).toBe(200);
        expect(resp.text).toContain(HEADING);
    });

    it("should render the enter your details page when GDS feature flag is on", async () => {
        //@ts-ignore
        env.FEATURE_FLAG_GDS_START_PAGE_290424 = true;      
        const resp = await request(app).get(PrefixedUrls.HOME);

        expect(resp.status).toBe(302);
        expect(resp.text).toContain(PrefixedUrls.ENTER_YOUR_DETAILS);
    });

    afterEach(() => {
        jest.resetModules();
    });

});
