import { mockSubmitPresenterAccountDetails } from "../../../mocks/mock.presenter.account.service.mock";
import { session, mockSession } from "../../../mocks/session.middleware.mock";

import app from "../../../../src/app";
import request from "supertest";
import { ExternalUrls, PrefixedUrls } from "../../../../src/constants";
import { PRESENTER_ACCOUNT_SESSION_KEY } from "../../../../src/utils/session";
import { examplePresenterAccountDetails } from "../../../mocks/example.presenter.account.details.mock";

import { success } from "@companieshouse/api-sdk-node/dist/services/result";

describe("check details tests", () => {
    const changeButtonHtml = `a class="govuk-link" href="/presenter-account/enter-your-details"`;

    it("Should render the Check Details page with a successful status code", async () => {
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.status).toBe(200);
    });

    it("Should not cache the HTMl on this page", async () => {
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        await request(app)
            .get(PrefixedUrls.CHECK_DETAILS)
            .expect(200)
            .expect('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
            .expect('Pragma', 'no-cache')
            .expect('Expires', '0')
            .expect('Surrogate-Control', 'no-store');
    });

    it("Should display the correct heading on the Check Details page", async () => {
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.text).toContain(
            "Check your answers before submitting your application"
        );
    });

    it("should translate page title to Welsh",  async () => {
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        const response = await request(app).get(PrefixedUrls.CHECK_DETAILS + "?lang=cy");

        expect(response.text).toContain("<title>Gwiriwch eich atebion cyn cyflwyno eich cais.</title>");
    });

    it("Should include a Change button link on the Check Details page", async () => {
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.text).toContain(changeButtonHtml);
    });

    it("Should display the correct Presenter Account details on the Check Details page", async () => {
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.text).toContain(
            examplePresenterAccountDetails.address.premises
        );
        expect(resp.text).toContain(
            examplePresenterAccountDetails.address.addressLine1
        );
        expect(resp.text).toContain(
            examplePresenterAccountDetails.address.addressLine2
        );
        expect(resp.text).toContain(
            examplePresenterAccountDetails.address.townOrCity
        );
        expect(resp.text).toContain(
            examplePresenterAccountDetails.address.country
        );
        expect(resp.text).toContain(
            examplePresenterAccountDetails.address.postCode
        );
    });

    it("Should display the correct feeback url for check_details page", async () => {
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS + "?lang=cy");

        expect(resp.text).toContain(
            ExternalUrls.FEEDBACK
        );
    });

    it("Should redirect to the Confirmation page after successfully submitting the Presenter Account details", async () => {
        const details = examplePresenterAccountDetails;
        mockSubmitPresenterAccountDetails.mockReturnValue(success(undefined));

        await request(app)
            .post(PrefixedUrls.CHECK_DETAILS)
            .send(details)
            .expect(302)
            .expect("Location", PrefixedUrls.CONFIRMATION);
    });

    it("Should clean the session after successfully submitting the Presenter Account details", async () => {
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        mockSubmitPresenterAccountDetails.mockReturnValue(success(undefined));

        await request(app)
            .post(PrefixedUrls.CHECK_DETAILS);

        expect(session.getExtraData[PRESENTER_ACCOUNT_SESSION_KEY]).toBe(undefined);
    });

    it("Should display an error page when there is an error in submitting the Presenter Account details", async () => {
        const details = examplePresenterAccountDetails;
        mockSubmitPresenterAccountDetails.mockImplementation(() => {
            throw new Error("Error submitting details");
        });

        await request(app)
            .post(PrefixedUrls.CHECK_DETAILS)
            .send(details)
            .expect(500);
    });

    it("Should redirect to the home page if the presenter account details are not in the session", async () => {
        // Use a mock session with a user id value
        mockSession();
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            undefined
        );

        await request(app)
            .get(PrefixedUrls.CHECK_DETAILS)
            .expect(302)
            .expect("Location", PrefixedUrls.HOME);
    });

    it("Should redirect to the home page if the user details do not match", async () => {
        // Use a mock session with a user id value
        mockSession();
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        mockSubmitPresenterAccountDetails.mockReturnValue(success(undefined));

        await request(app)
            .get(PrefixedUrls.CHECK_DETAILS)
            .expect(302)
            .expect("Location", PrefixedUrls.HOME);
    });
});
