import app from "../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../src/constants";

describe("home page tests", () => {
    const HEADING = "Apply to file with Companies House using software";
    it("should render the home page", async () => {
        const resp = await request(app).get(PrefixedUrls.HOME);

        expect(resp.status).toBe(200);
        expect(resp.text).toContain(HEADING);
    });
});
