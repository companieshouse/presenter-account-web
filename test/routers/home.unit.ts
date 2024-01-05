import app from "../../src/app";
import request from "supertest";
import { servicePathPrefix } from "../../src/utils/constants/urls";

describe("home page tests", () => {
    const HEADING = "Apply for a Companies House presenter account for online filing (prototype)";
    it("should render the home page", async () => {
        const url = `${servicePathPrefix}`;
        const resp = await request(app).get(url);

        expect(resp.status).toBe(200);
        expect(resp.text).toContain(HEADING);
    });
});
