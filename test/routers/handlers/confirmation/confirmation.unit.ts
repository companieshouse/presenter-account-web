import app from "../../../../src/app";
import request from "supertest";
import { ExternalUrls, PrefixedUrls } from "../../../../src/constants";

describe("confirmation tests", () => {

    it("Should render the Confirmation page with a successful status code", async () => {
        const resp = await request(app).get(PrefixedUrls.CONFIRMATION);
        expect(resp.status).toBe(200);
    });

    it("Should display 'Application submitted' message on the Confirmation page", async () => {
        const resp = await request(app).get(PrefixedUrls.CONFIRMATION);
        expect(resp.text).toContain("Application submitted");
    });

    it("Should display the correct feeback url for confirmation page", async () => {
        const resp = await request(app).get(PrefixedUrls.CONFIRMATION);
        expect(resp.text).toContain(
            ExternalUrls.FEEDBACK_CONF
        );
    });
});
