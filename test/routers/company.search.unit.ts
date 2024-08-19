import { mockSession, session } from "../mocks/session.middleware.mock";

import app from "../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../src/constants";
import { setPresenterAccountDetails } from "../../src/utils/session";

describe("company search tests", () => {
    it("should redirect to the company lookup service", async () => {
        mockSession();
        session.setExtraData("presenter_account_details", {isBusinessRegistered: true});

        const resp = await request(app).get(PrefixedUrls.COMPANY_SEARCH);



        expect(resp.status).toBe(302);
        const redirect = resp.header["location"];
        expect(redirect).toContain(PrefixedUrls.CONFIRM_COMPANY);
    });

    it('should show an error if the session variable "isBusinessRegistered" is not true', async () => {
        mockSession();

        session.setExtraData("presenter_account_details", {isBusinessRegistered: false});

        const resp = await request(app).get(PrefixedUrls.COMPANY_SEARCH);

        expect(resp.status).toBe(500);
    });

    it('should show an error if the session variable "isBusinessRegistered" is not set', async () => {
        mockSession();

        const resp = await request(app).get(PrefixedUrls.COMPANY_SEARCH);

        expect(resp.status).toBe(500);
    });
});
