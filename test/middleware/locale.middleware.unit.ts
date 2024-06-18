import { session } from "../mocks/session.middleware.mock";

import request from "supertest";
import app from "../../src/app";
import { examplePresenterAccountDetails } from "../mocks/example.presenter.account.details.mock";
import { PRESENTER_ACCOUNT_SESSION_KEY } from "../../src/utils/session";
import { PrefixedUrls } from "../../src/constants";

const CHOICE_EN = "?lang=en";
const CHOICE_CY = "?lang=cy";
const CHOICE_CY_ALSO = "?foo=bar&lang=cy";
const EN_NEW_SERVICE_TEXT = "This is a new service";
const CY_NEW_SERVICE_TEXT = "Mae hwn y wasanaeth newydd";

describe("Locale middleware test", () => {
    
    
    test("If lang is not set to either en or cy. Default to English", async () => {
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );    
        const resp = await request(app).get(PrefixedUrls.ENTER_YOUR_DETAILS);

            expect(resp.text).toContain(EN_NEW_SERVICE_TEXT)
            expect(resp.status).toBe(200);
        });

    test("If ?lang set to either en. Return English", async () => {
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );    
        
        const resp = await request(app).get(PrefixedUrls.ENTER_YOUR_DETAILS+CHOICE_EN);

            expect(resp.text).toContain(EN_NEW_SERVICE_TEXT)
            expect(resp.status).toBe(200);
        });

    test("If ?lang set to either cy. Return Welsh", async () => {
        session.setExtraData(
            PRESENTER_ACCOUNT_SESSION_KEY,
            examplePresenterAccountDetails
        );    
        
        const resp = await request(app).get(PrefixedUrls.ENTER_YOUR_DETAILS+CHOICE_CY);

            expect(resp.text).toContain(CY_NEW_SERVICE_TEXT)
            expect(resp.status).toBe(200);
        });

        test("If &lang set to either cy. Return Welsh", async () => {
            session.setExtraData(
                PRESENTER_ACCOUNT_SESSION_KEY,
                examplePresenterAccountDetails
            );    
            const resp = await request(app).get(PrefixedUrls.ENTER_YOUR_DETAILS+CHOICE_CY_ALSO);
    
                expect(resp.text).toContain(CY_NEW_SERVICE_TEXT)
                expect(resp.status).toBe(200);
            });
    })