import app from "../../../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../../../src/constants";

describe("Enter correct form details for address fields", () => {
    it("should render the enter your details page", async () => {

        const resp = await request(app).get(PrefixedUrls.ENTER_YOUR_DETAILS);
        expect(resp.status).toBe(200);
        expect(resp.text).toContain("What is your correspondence address?");

    });

    describe("throw errors for any mandatory fields not set", () => {
        it("should throw error if premises empty", () => {

        });

        it("should throw error if address line 1 empty", () => {

        });

        it("should throw error if town or city empty", () => {

        });

        it("should throw error if post code empty", () => {

        });

        it("should throw error if country empty", () => {

        });
    });

    describe("throw no errors for any optional field not set", () => {
        it("should not throw error if address line 2 empty", () => {

        });

        it("should not throw error if county empty", () => {

        });
    });

    describe("validate data entered in any field", () => {
        describe("should validate data entered for premises", () => {

        });

        describe("should validate data entered for address line 1", () => {

        });

        describe("should validate data entered for address line 2", () => {

        });

        describe("should validate data entered for town or city", () => {

        });

        describe("should validate data entered for county", () => {

        });

        describe("should validate data entered for post code", () => {

        });

        describe("should validate data entered for country", () => {

        });
    });
});
