import mockCsrfProtectionMiddleware from "../../../mocks/csrf.protection.middleware.mock";

import { ExternalUrls, PrefixedUrls } from "../../../../src/constants";
import { getRequestWithCookie } from "../../../helper/requests";

describe("confirmation tests", () => {

    beforeEach(() => {
        mockCsrfProtectionMiddleware.mockClear();
    });

    it("Should render the Confirmation page with a successful status code", async () => {
        const resp = await getRequestWithCookie(PrefixedUrls.CONFIRMATION);
        expect(resp.status).toBe(200);
    });

    it("Should display 'Application submitted' message on the Confirmation page", async () => {
        const resp = await getRequestWithCookie(PrefixedUrls.CONFIRMATION);
        expect(resp.text).toContain("Application submitted");
    });

    it("Should display the correct feeback url for confirmation page", async () => {
        const resp = await getRequestWithCookie(PrefixedUrls.CONFIRMATION);
        expect(resp.text).toContain(
            ExternalUrls.FEEDBACK_CONF
        );
    });

    it("Should display the correct email info text for Welsh confirmation page", async () => {
        const resp = await getRequestWithCookie(PrefixedUrls.CONFIRMATION + "?lang=cy");
        expect(resp.text).toContain(
            "Byddwn yn creu eich cyfrif cyflwynydd. Byddwn yn anfon e-bost at"
        );
        expect(resp.text).toContain(
            "gyda&#39;ch:"
        );
    });

    it("should translate page title to Welsh",  async () => {

        const response = await getRequestWithCookie(PrefixedUrls.CONFIRMATION + "?lang=cy");

        expect(response.text).toContain("<title>Cais wedi ei gyflwyno</title>");
    });
});
