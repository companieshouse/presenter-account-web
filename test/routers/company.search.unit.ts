import { mockSession, session } from "../mocks/session.middleware.mock";
import mockCsrfProtectionMiddleware from "../mocks/csrf.protection.middleware.mock";

import { PrefixedUrls } from "../../src/constants";
import { getRequestWithCookie } from "../helper/requests";

describe("company search tests", () => {

    beforeEach(() => {
        mockCsrfProtectionMiddleware.mockClear();
    });

    it("should redirect to the company lookup service", async () => {
        mockSession();
        session.setExtraData("presenter_account_details", { isBusinessRegistered: true });

        const resp = await getRequestWithCookie(PrefixedUrls.COMPANY_SEARCH);



        expect(resp.status).toBe(302);
        const redirect = resp.header["location"];
        expect(redirect).toContain(PrefixedUrls.CONFIRM_COMPANY);
    });

    it('should show an error if the session variable "isBusinessRegistered" is not true', async () => {
        mockSession();

        session.setExtraData("presenter_account_details", { isBusinessRegistered: false });

        const resp = await getRequestWithCookie(PrefixedUrls.COMPANY_SEARCH);

        expect(resp.status).toBe(500);
    });

    it('should show an error if the session variable "isBusinessRegistered" is not set', async () => {
        mockSession();

        const resp = await getRequestWithCookie(PrefixedUrls.COMPANY_SEARCH);

        expect(resp.status).toBe(500);
    });
});
