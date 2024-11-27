import { session } from "../mocks/session.middleware.mock";
import mockCsrfProtectionMiddleware from "../mocks/csrf.protection.middleware.mock";

import { examplePresenterAccountDetails } from "../mocks/example.presenter.account.details.mock";
import { ContextKeys, PrefixedUrls } from "../../src/constants";
import { getRequestWithCookie } from "../helper/requests";

const CHOICE_EN = "?lang=en";
const CHOICE_CY = "?lang=cy";
const CHOICE_FOO = "?lang=foo";
const CHOICE_CY_ALSO = "?foo=bar&lang=cy";
const EN_NEW_SERVICE_TEXT = "This is a new service";
const CY_NEW_SERVICE_TEXT = "Mae hwn yn wasanaeth newydd";



describe("Locale middleware test", () => {

    beforeEach(() => {
        mockCsrfProtectionMiddleware.mockClear();
    });

    test("If lang is not set to either en or cy. Default to English", async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );

        const resp = await getRequestWithCookie(PrefixedUrls.ENTER_YOUR_DETAILS);

        expect(resp.text).toContain(EN_NEW_SERVICE_TEXT);
        expect(resp.status).toBe(200);
    });

    test("If ?lang set to en. Return English", async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );



        const resp = await getRequestWithCookie(PrefixedUrls.ENTER_YOUR_DETAILS + CHOICE_EN);

        expect(resp.text).toContain(EN_NEW_SERVICE_TEXT);
        expect(resp.status).toBe(200);
    });

    test("If ?lang set to cy. Return Welsh", async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );



        const resp = await getRequestWithCookie(PrefixedUrls.ENTER_YOUR_DETAILS + CHOICE_CY);

        expect(resp.text).toContain(CY_NEW_SERVICE_TEXT);
        expect(resp.status).toBe(200);
    });

    test("If &lang set to cy. Return Welsh", async () => {
        session.setExtraData(
            ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );


        const resp = await getRequestWithCookie(PrefixedUrls.ENTER_YOUR_DETAILS + CHOICE_CY_ALSO);

        expect(resp.text).toContain(CY_NEW_SERVICE_TEXT);
        expect(resp.status).toBe(200);
    });

    describe("If LOCALE_ENABLED=false", () => {

        test("If &lang set to cy. Return English.", async () => {
            const originalValue = process.env.LOCALES_ENABLED;
            try {
                process.env.LOCALES_ENABLED = "false";
                session.setExtraData(
                    ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
                    examplePresenterAccountDetails
                );


                const resp = await getRequestWithCookie(PrefixedUrls.ENTER_YOUR_DETAILS + CHOICE_CY_ALSO);

                expect(resp.text).toContain(EN_NEW_SERVICE_TEXT);
                expect(resp.status).toBe(200);
            } finally {
                process.env.LOCALES_ENABLED = originalValue;
            }


        });

        test("If ?lang set to en. Return English.", async () => {
            const originalValue = process.env.LOCALES_ENABLED;
            try {
                process.env.LOCALES_ENABLED = "false";
                session.setExtraData(
                    ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
                    examplePresenterAccountDetails
                );


                const resp = await getRequestWithCookie(PrefixedUrls.ENTER_YOUR_DETAILS + CHOICE_EN);

                expect(resp.text).toContain(EN_NEW_SERVICE_TEXT);
                expect(resp.status).toBe(200);
            // Do testing here
            } finally {
                process.env.LOCALES_ENABLED = originalValue;
            }


        });

        test("If ?lang set to foo. Return English.", async () => {
            const originalValue = process.env.LOCALES_ENABLED;
            try {
                process.env.LOCALES_ENABLED = "false";
                session.setExtraData(
                    ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
                    examplePresenterAccountDetails
                );


                const resp = await getRequestWithCookie(PrefixedUrls.ENTER_YOUR_DETAILS + CHOICE_FOO);

                expect(resp.text).toContain(EN_NEW_SERVICE_TEXT);
                expect(resp.status).toBe(200);
            // Do testing here
            } finally {
                process.env.LOCALES_ENABLED = originalValue;
            }


        });

        test("Return English.", async () => {
            const originalValue = process.env.LOCALES_ENABLED;
            try {
                process.env.LOCALES_ENABLED = "false";
                session.setExtraData(
                    ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY,
                    examplePresenterAccountDetails
                );


                const resp = await getRequestWithCookie(PrefixedUrls.ENTER_YOUR_DETAILS + CHOICE_EN);

                expect(resp.text).toContain(EN_NEW_SERVICE_TEXT);
                expect(resp.status).toBe(200);
            // Do testing here
            } finally {
                process.env.LOCALES_ENABLED = originalValue;
            }


        });

    });
});
