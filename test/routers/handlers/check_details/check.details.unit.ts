import app from "../../../../src/app";
import request from "supertest";
import { PrefixedUrls } from "../../../../src/constants";
import { session } from "../../../mocks/session.middleware.mock";
import { PRESENTER_ACCOUNT_SESSION_KEY } from "../../../../src/utils/session";
import { type Details } from "private-api-sdk-node/src/services/presenter-account/types";

const examplePresenterAccountDetails: Details = {
    email: "example@email.com",
    userId: "123e4567-e89b-12d3-a456-426614174000",
    createdDate: "2022-01-01T00:00:00Z",
    name: {
        forename: "John",
        surname: "Doe"
    },
    address: {
        premises: "123",
        addressLine1: "Heol Las",
        addressLine2: "Trem yr Afon",
        townOrCity: "Abertawe",
        country: "Cymru",
        postCode: "SA1 1ZZ"
    }
}

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
