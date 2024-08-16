import { mockSession } from "../../../mocks/session.middleware.mock";
import { mockGetCompanyProfile } from "../../../mocks/api.client.mock";

import app from "../../../../src/app";
import request from "supertest";
import {  PrefixedUrls, QueryParameters } from "../../../../src/constants";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { Resource } from "@companieshouse/api-sdk-node";

describe("confirm company tests", () => {
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
});
