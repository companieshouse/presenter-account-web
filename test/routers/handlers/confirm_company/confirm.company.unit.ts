import { mockSession, session } from "../../../mocks/session.middleware.mock";
import { mockGetCompanyProfile } from "../../../mocks/api.client.mock";

import app from "../../../../src/app";
import request from "supertest";
import {  ContextKeys, PrefixedUrls, QueryParameters } from "../../../../src/constants";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { Resource } from "@companieshouse/api-sdk-node";
import { COMPANY_NUMBER_SESSION_KEY } from "../../../../src/utils/session";

describe("get confirm company tests", () => {
    it('Should show the company details when page rendered', async () => {
        mockSession();

        const companyNumber = '00006400';

        const companyProfile = {
            companyName: 'COMPANY NAME',
            companyNumber,
            dateOfCreation: '1983-04-05',
            companyStatus: 'active',
        } as Partial<CompanyProfile>;

        const companyProfileResource = {
            httpStatusCode: 200,
            resource: companyProfile as CompanyProfile
        } as Resource<CompanyProfile>;

        session.setExtraData(ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY, { isBusinessRegistered: true });

        mockGetCompanyProfile.mockResolvedValueOnce(companyProfileResource);

        const response = await request(app)
            .get(`${PrefixedUrls.CONFIRM_COMPANY}?${QueryParameters.COMPANY_NUMBER}=${companyNumber}`);

        expect(response.status).toBe(200);
        expect(response.text).toContain('COMPANY NAME');
        expect(response.text).toContain(companyNumber);
        expect(response.text).toContain('Active');
        expect(response.text).toContain('5 April 1983');
    });

    it('Should show an error if no company number provided', async () => {
        mockSession();

        const response = await request(app)
            .get(`${PrefixedUrls.CONFIRM_COMPANY}`);

        expect(response.status).toBe(500);
        expect(response.text).toContain('Sorry there is a problem with the service');
    });

    it('Should show an error if company profile service throws error', async () => {
        mockSession();

        mockGetCompanyProfile.mockRejectedValueOnce(new Error('Error' as any));

        const response = await request(app)
            .get(`${PrefixedUrls.CONFIRM_COMPANY}?${QueryParameters.COMPANY_NUMBER}=00006400`);

        expect(response.status).toBe(500);
        expect(response.text).toContain('Sorry there is a problem with the service');
    });

    it("Should show an error if company profile service returns a non 200 status code", async () => {
        mockSession();
        mockGetCompanyProfile.mockReturnValueOnce({
            status: 500,
            data: {
                message: 'something went wrong',
            },
        });

        const response = await request(app)
            .get(`${PrefixedUrls.CONFIRM_COMPANY}?${QueryParameters.COMPANY_NUMBER}=00006400`);

        expect(response.status).toBe(500);
    });
});

describe('post company profile tests', () => {
    it('should set the company number in the session after post', async () => {
        mockSession();

        const companyNumber = '00006400';
        const response = await request(app)
            .post(`${PrefixedUrls.CONFIRM_COMPANY}?${QueryParameters.COMPANY_NUMBER}=${companyNumber}`);


        expect(response.status).toBe(302);
        expect(response.header['location']).toEqual(PrefixedUrls.ENTER_YOUR_DETAILS);
        expect(session.getExtraData(COMPANY_NUMBER_SESSION_KEY)).toEqual(companyNumber);
    });
});
