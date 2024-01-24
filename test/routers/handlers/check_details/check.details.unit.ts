import app from "../../../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../../../src/constants";
import { session } from "../../../mocks/session.middleware.mock";
import { PRESENTER_ACCOUNT_SESSION_KEY } from "../../../../src/utils/session";
import { examplePresenterAccountDetails } from "../../../mocks/example.presenter.account.details.mock";


describe("check details tests", () => {
    const changeButtonHtml = `a class="govuk-link" href="/presenter-account/enter-your-details"`;

    it("renderCheckDetailsPageWithCorrectStatus", async () => {
        session.setExtraData(PRESENTER_ACCOUNT_SESSION_KEY, examplePresenterAccountDetails);

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.status).toBe(200);
    });

    it("checkPageHeading", async () => {
        session.setExtraData(PRESENTER_ACCOUNT_SESSION_KEY, examplePresenterAccountDetails);

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.text).toContain("Check your answers before submitting your application");
    });

    it("checkChangeButtonLinkExists", async () => {
        session.setExtraData(PRESENTER_ACCOUNT_SESSION_KEY, examplePresenterAccountDetails);

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.text).toContain(changeButtonHtml);
    });

    it("checkPresenterAccountDetailsRenderedOnPage", async () => {
        session.setExtraData(PRESENTER_ACCOUNT_SESSION_KEY, examplePresenterAccountDetails);

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.text).toContain(examplePresenterAccountDetails.address.premises);
        expect(resp.text).toContain(examplePresenterAccountDetails.address.addressLine1);
        expect(resp.text).toContain(examplePresenterAccountDetails.address.addressLine2);
        expect(resp.text).toContain(examplePresenterAccountDetails.address.townOrCity);
        expect(resp.text).toContain(examplePresenterAccountDetails.address.country);
        expect(resp.text).toContain(examplePresenterAccountDetails.address.postCode);
    });
});
