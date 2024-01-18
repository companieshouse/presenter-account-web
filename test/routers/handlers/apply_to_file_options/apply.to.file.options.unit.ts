import app from "../../../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../../../src/constants";
import { FilingFeeOptions, filingFeeFieldName } from "../../../../src/routers/handlers/apply_to_file_options";

describe("apply to file optons page tests", () => {
    it("should render the apply to file options page", async () => {
        const resp = await request(app).get(PrefixedUrls.APPLY_TO_FILE_OPTIONS);

        expect(resp.status).toBe(200);
        expect(resp.text).toContain("Do you need to file any accounts or documents that have a filing fee?");
    });


    it("should redirect to ENTER_YOUR_DETAILS page when 'no' is selected", async () => {
        const formObj = {};
        formObj[filingFeeFieldName] = FilingFeeOptions.NO;

        const resp = await request(app)
            .post(PrefixedUrls.APPLY_TO_FILE_OPTIONS)
            .send(formObj);

        expect(resp.status).toBe(302);
        expect(resp.header.location).toBe(PrefixedUrls.ENTER_YOUR_DETAILS);
    });

    it("should redirect to YOU_CANNOT_USE_THIS_SERVICE page when 'yes' is selected", async () => {
        const formObj = {};
        formObj[filingFeeFieldName] = FilingFeeOptions.YES;

        const resp = await request(app)
            .post(PrefixedUrls.APPLY_TO_FILE_OPTIONS)
            .send(formObj);

        expect(resp.status).toBe(302);
        expect(resp.header.location).toBe(PrefixedUrls.YOU_CANNOT_USE_THIS_SERVICE);
    });

    it("should render error page when form field is neither 'yes' nor 'no'", async () => {
        const formObj = {};
        formObj[filingFeeFieldName] = "invalid";

        const resp = await request(app)
            .post(PrefixedUrls.APPLY_TO_FILE_OPTIONS)
            .send(formObj);

        expect(resp.status).toBe(500);
        expect(resp.text).toContain("Internal server error");
    });
});

