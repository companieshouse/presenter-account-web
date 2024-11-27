import { session } from "../../../mocks/session.middleware.mock";
import mockCsrfProtectionMiddleware from "../../../mocks/csrf.protection.middleware.mock";

import app from "../../../../src/app";
import request from "supertest";
import { ContextKeys, PrefixedUrls } from "../../../../src/constants";
import { getRequestWithCookie, setCookie } from "../../../helper/requests";

describe("is business registered", () => {
    beforeEach(() => {
        mockCsrfProtectionMiddleware.mockClear();
    });

    it("should land on page with the correct title", async () => {
        const resp = await getRequestWithCookie(PrefixedUrls.IS_BUSINESS_REGISTERED);

        expect(resp.status).toBe(200);
        expect(resp.text).toContain("Is the business you work for registered with Companies House?");
        expect(resp.text).not.toContain("Select yes if the business is registered with Companies House");

    });

    it("should display error message when trying to continue without selecting a radio buttom", async () => {
        const resp = await request(app)
            .post(PrefixedUrls.IS_BUSINESS_REGISTERED)
            .set("Cookie", setCookie());

        expect(resp.status).toBe(200);
        expect(resp.text).toContain("Select yes if the business is registered with Companies House");
    });

    it("should redirect to company number when 'yes' radio buttom is selected", async () => {
        const resp = await request(app)
            .post(PrefixedUrls.IS_BUSINESS_REGISTERED).send({
                "is-business-registered": "true"
            })
            .set("Cookie", setCookie());

        expect(resp.status).toBe(302);
        expect(resp.text).toContain(`Redirecting to ${PrefixedUrls.COMPANY_SEARCH}`);
    });

    it("should redirect to business name when 'no' radio buttom is selected", async () => {
        const resp = await request(app)
            .post(PrefixedUrls.IS_BUSINESS_REGISTERED).send({
                "is-business-registered": "false"
            })
            .set("Cookie", setCookie());

        expect(resp.status).toBe(302);
        expect(resp.text).toContain(`Redirecting to ${PrefixedUrls.ENTER_BUSINESS_NAME}`);
    });

    it("should check radiobox 'yes' when session is set to true", async () => {
        session.setExtraData(ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY, { "isBusinessRegistered": true });

        const resp = await getRequestWithCookie(PrefixedUrls.IS_BUSINESS_REGISTERED);

        expect(resp.status).toBe(200);
        expect(resp.text).toContain("Is the business you work for registered with Companies House?");
        expect(resp.text).toContain('type="radio" value="true" checked');
    });

    it("should check radiobox 'no' when session is set to false", async () => {
        session.setExtraData(ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY, { "isBusinessRegistered": false });

        const resp = await getRequestWithCookie(PrefixedUrls.IS_BUSINESS_REGISTERED);

        expect(resp.status).toBe(200);
        expect(resp.text).toContain("Is the business you work for registered with Companies House?");
        expect(resp.text).toContain('type="radio" value="false" checked');
    });
});

describe("Validate is business registered form fields with Welsh display", () => {

    it("should land on page with the correct title", async () => {
        const resp = await getRequestWithCookie(PrefixedUrls.IS_BUSINESS_REGISTERED + "?lang=cy");

        expect(resp.status).toBe(200);
        expect(resp.text).toContain("Ydy&#39;r busnes rydych chi&#39;n gweithio iddo wedi cofrestru gyda Thŷ&#39;r Cwmnïau?");
        expect(resp.text).not.toContain("Dewiswch Ydy os yw&#39;r busnes wedi cofrestru gyda Thŷ&#39;r Cwmnïau");

    });

    it("should display error message when trying to continue without selecting a radio buttom", async () => {
        const resp = await request(app)
            .post(PrefixedUrls.IS_BUSINESS_REGISTERED + "?lang=cy")
            .set("Cookie", setCookie());

        expect(resp.status).toBe(200);
        expect(resp.text).toContain("Dewiswch Ydy os yw&#39;r busnes wedi cofrestru gyda Thŷ&#39;r Cwmnïau");
    });

    it("should redirect to company number when 'yes' radio buttom is selected", async () => {
        const resp = await request(app).post(PrefixedUrls.IS_BUSINESS_REGISTERED + "?lang=cy")
            .set("Cookie", setCookie())
            .send({
                "is-business-registered": "true"
            });

        expect(resp.status).toBe(302);
        expect(resp.text).toContain(`Redirecting to ${PrefixedUrls.COMPANY_SEARCH}`);
    });

    it("should redirect to business name when 'no' radio buttom is selected", async () => {
        const resp = await request(app).post(PrefixedUrls.IS_BUSINESS_REGISTERED + "?lang=cy")
            .set("Cookie", setCookie())
            .send({
                "is-business-registered": "false"
            });

        expect(resp.status).toBe(302);
        expect(resp.text).toContain(`Redirecting to ${PrefixedUrls.ENTER_BUSINESS_NAME}`);
    });

    it("should check radiobox 'yes' when session is set to true", async () => {
        session.setExtraData(ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY, { "isBusinessRegistered": true });

        const resp = await getRequestWithCookie(PrefixedUrls.IS_BUSINESS_REGISTERED + "?lang=cy");

        expect(resp.status).toBe(200);
        expect(resp.text).toContain("Ydy&#39;r busnes rydych chi&#39;n gweithio iddo wedi cofrestru gyda Thŷ&#39;r Cwmnïau?");
        expect(resp.text).toContain('type="radio" value="true" checked');
    });

    it("should check radiobox 'no' when session is set to false", async () => {
        session.setExtraData(ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY, { "isBusinessRegistered": false });

        const resp = await getRequestWithCookie(PrefixedUrls.IS_BUSINESS_REGISTERED + "?lang=cy");

        expect(resp.status).toBe(200);
        expect(resp.text).toContain("Ydy&#39;r busnes rydych chi&#39;n gweithio iddo wedi cofrestru gyda Thŷ&#39;r Cwmnïau?");
        expect(resp.text).toContain('type="radio" value="false" checked');
    });
});


