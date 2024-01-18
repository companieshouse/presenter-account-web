import app from "../../../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../../../src/constants";

describe("you cannot use this service page tests", () => {
    it("should render the you canot use this service page", async () => {
        const resp = await request(app).get(PrefixedUrls.YOU_CANNOT_USE_THIS_SERVOCE);

        expect(resp.status).toBe(200);
        expect(resp.text).toContain("You need to complete an application form");
    });
});
