import { mockSubmitPresenterAccountDetails } from "../../../mocks/mock.presenter.account.service.mock";
import { session, mockSession } from "../../../mocks/session.middleware.mock";

import app from "../../../../src/app";
import request from "supertest";
import { ContextKeys, ExternalUrls, PrefixedUrls } from "../../../../src/constants";
import { examplePresenterAccountDetails, examplePresenterAccountDetailsInternal } from "../../../mocks/example.presenter.account.details.mock";

import { success } from "@companieshouse/api-sdk-node/dist/services/result";

describe("check details tests", () => {
    const changeButtonHtml = `a class="govuk-link" href="/presenter-account/enter-your-details"`;

    it("Should render the Check Details page with a successful status code", async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetailsInternal
        );

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.status).toBe(200);
    });

    it("Should error if presenter account session is missing isBusinessRegistered", async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.status).toBe(500);
    });

    it("Should error if presenter account session is missing name", async () => {
        const missingName = {
            ...examplePresenterAccountDetailsInternal,
            name: undefined
        };
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            missingName
        );

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.status).toBe(500);
    });

    it("Should error if presenter account session is missing forename", async () => {
        const missingForename = {
            ...examplePresenterAccountDetailsInternal,
            name: {
                forename: null,
                surname: "Surname"
            }
        };
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            missingForename
        );

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.status).toBe(500);
    });

    it("Should error if presenter account session is missing forename", async () => {
        const missingSurname = {
            ...examplePresenterAccountDetailsInternal,
            name: {
                forename: "forename1234",
                surname: null
            }
        };
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            missingSurname
        );

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.status).toBe(500);
    });

    it("Should error if presenter account session is missing name", async () => {
        const missingName = {
            ...examplePresenterAccountDetailsInternal,
            name: undefined
        };
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            missingName
        );

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.status).toBe(500);
    });

    it("Should error if presenter account session is missing companyName", async () => {
        const isRegisteredWithoutCompanyName = {
            ...examplePresenterAccountDetailsInternal,
            isBusinessRegistered: true,
            companyName: undefined
        };
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            isRegisteredWithoutCompanyName
        );

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.status).toBe(500);
    });

    it("Should error if presenter account session is missing businessName", async () => {
        const isRegisteredWithoutBusinessName = {
            ...examplePresenterAccountDetailsInternal,
            isBusinessRegistered: false,
            businessName: undefined
        };
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            isRegisteredWithoutBusinessName
        );

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.status).toBe(500);
    });

    it("Should not cache the HTMl on this page", async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetailsInternal
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
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetailsInternal
        );

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.text).toContain(
            "Check your answers before submitting your application"
        );
    });

    it("should translate page title to Welsh",  async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetailsInternal
        );

        const response = await request(app).get(PrefixedUrls.CHECK_DETAILS + "?lang=cy");

        expect(response.text).toContain("<title>Gwiriwch eich atebion cyn cyflwyno eich cais.</title>");
    });

    it("Should include a Change button link on the Check Details page", async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetailsInternal
        );

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.text).toContain(changeButtonHtml);
    });

    it("Should display the correct Presenter Account details on the Check Details page", async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetailsInternal
        );

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.text).toContain(
            examplePresenterAccountDetailsInternal.address!.premises
        );
        expect(resp.text).toContain(
            examplePresenterAccountDetailsInternal.address!.addressLine1
        );
        expect(resp.text).toContain(
            examplePresenterAccountDetailsInternal.address!.addressLine2
        );
        expect(resp.text).toContain(
            examplePresenterAccountDetailsInternal.address!.townOrCity
        );
        expect(resp.text).toContain(
            examplePresenterAccountDetailsInternal.address!.country
        );
        expect(resp.text).toContain(
            examplePresenterAccountDetailsInternal.address!.postCode
        );
        expect(resp.text).toContain(
            examplePresenterAccountDetailsInternal.companyName
        );
        expect(resp.text).toContain(
            "Yes"
        );
        expect(resp.text).toContain(
            examplePresenterAccountDetailsInternal.companyName
        );
        expect(resp.text).toContain(
            examplePresenterAccountDetailsInternal.name?.forename + " " + examplePresenterAccountDetailsInternal.name?.surname
        );
        expect(resp.text).not.toContain(
            examplePresenterAccountDetailsInternal.businessName
        );
    });

    it("Should display the correct Presenter Account details on the Check Details page with business not registered", async () => {
        const exampleNonRegisteredBusinessDetails = {
            ...examplePresenterAccountDetailsInternal,
            isBusinessRegistered: false
        };

        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            exampleNonRegisteredBusinessDetails
        );

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.text).toContain(
            exampleNonRegisteredBusinessDetails.address!.premises
        );
        expect(resp.text).toContain(
            exampleNonRegisteredBusinessDetails.address!.addressLine1
        );
        expect(resp.text).toContain(
            exampleNonRegisteredBusinessDetails.address!.addressLine2
        );
        expect(resp.text).toContain(
            exampleNonRegisteredBusinessDetails.address!.townOrCity
        );
        expect(resp.text).toContain(
            exampleNonRegisteredBusinessDetails.address!.country
        );
        expect(resp.text).toContain(
            exampleNonRegisteredBusinessDetails.address!.postCode
        );
        expect(resp.text).not.toContain(
            "Yes"
        );
        expect(resp.text).toContain(
            "No"
        );
        expect(resp.text).not.toContain(
            exampleNonRegisteredBusinessDetails.companyName
        );
        expect(resp.text).toContain(
            "Business name"
        );
        expect(resp.text).toContain(
            exampleNonRegisteredBusinessDetails.name?.forename + " " + exampleNonRegisteredBusinessDetails.name?.surname
        );
        expect(resp.text).toContain(
            exampleNonRegisteredBusinessDetails.businessName
        );
    });

    it("Should display the correct feeback url for check_details page", async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetailsInternal
        );

        const resp = await request(app).get(PrefixedUrls.CHECK_DETAILS);

        expect(resp.text).toContain(
            ExternalUrls.FEEDBACK
        );
    });

    it("Should redirect to the Confirmation page after successfully submitting the Presenter Account details", async () => {
        const details = examplePresenterAccountDetailsInternal;
        mockSubmitPresenterAccountDetails.mockReturnValue(success(undefined));

        await request(app)
            .post(PrefixedUrls.CHECK_DETAILS)
            .send(details)
            .expect(302)
            .expect("Location", PrefixedUrls.CONFIRMATION);
    });

    it("Should clean the session after successfully submitting the Presenter Account details", async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetailsInternal
        );

        mockSubmitPresenterAccountDetails.mockReturnValue(success(undefined));

        await request(app)
            .post(PrefixedUrls.CHECK_DETAILS);

        expect(session.getExtraData[ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY]).toBe(undefined);
    });

    it("Should display an error page when there is an error in submitting the Presenter Account details", async () => {
        const details = examplePresenterAccountDetailsInternal;
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
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
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
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetailsInternal
        );

        mockSubmitPresenterAccountDetails.mockReturnValue(success(undefined));

        await request(app)
            .get(PrefixedUrls.CHECK_DETAILS)
            .expect(302)
            .expect("Location", PrefixedUrls.HOME);
    });
});
