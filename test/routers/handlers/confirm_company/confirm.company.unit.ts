import { mockSession, session } from "../../../mocks/session.middleware.mock";
import { mockGetCompanyProfile } from "../../../mocks/api.client.mock";

import app from "../../../../src/app";
import request from "supertest";
import {  ContextKeys, PrefixedUrls, QueryParameters } from "../../../../src/constants";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { Resource } from "@companieshouse/api-sdk-node";
import { PRESENTER_ACCOUNT_SESSION_KEY, PresenterSessionDetails } from "../../../../src/utils/session";

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

        session.setExtraData(PRESENTER_ACCOUNT_SESSION_KEY, {
            isBusinessRegistered: true
        });
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
            .post(`${PrefixedUrls.CONFIRM_COMPANY}?${QueryParameters.COMPANY_NUMBER}=${companyNumber}`);


        expect(response.status).toBe(302);
        expect(response.header['location']).toEqual(PrefixedUrls.ENTER_YOUR_DETAILS);
        expect((session.getExtraData(PRESENTER_ACCOUNT_SESSION_KEY) as PresenterSessionDetails).companyNumber).toEqual(companyNumber);
    });

    it('should return 500 when set the company number in the session after post, when presenterAccountDetails is not present', async () => {
        mockSession();

        const companyNumber = '00006400';
        const response = await request(app)
            .post(`${PrefixedUrls.CONFIRM_COMPANY}?${QueryParameters.COMPANY_NUMBER}=${companyNumber}`);


        expect(response.status).toBe(500);
    });

    it('should return 500 when presenter account details are unable to be found', async () => {

        mockSession();

        session.setExtraData(PRESENTER_ACCOUNT_SESSION_KEY, undefined);
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
            .post(`${PrefixedUrls.CONFIRM_COMPANY}?${QueryParameters.COMPANY_NUMBER}=${companyNumber}`);

        expect(response.status).toBe(500);
    });
});

describe("Test confirm company with different status in Welsh", () => {
    const companyStatusLanguageMap = new Map();
    companyStatusLanguageMap.set('active', 'Gweithredol');
    companyStatusLanguageMap.set('dissolved', 'Wedi&#39;i ddiddymu');
    companyStatusLanguageMap.set('liquidation', 'Datodiad');
    companyStatusLanguageMap.set('receivership', 'Derbynyddiad');
    companyStatusLanguageMap.set('converted-closed', 'Wedi&#39;i throsi-ar gau');
    companyStatusLanguageMap.set('open', 'Ar agor');
    companyStatusLanguageMap.set('closed', 'Ar gau');
    companyStatusLanguageMap.set('insolvency-proceedings', 'Trafodion- ansolfedd');
    companyStatusLanguageMap.set('voluntary-arrangement', 'Trefniant gwirfoddol');
    companyStatusLanguageMap.set('administration', 'Yn nwylo gweinyddwy');
    companyStatusLanguageMap.set('registered', 'Wedi&#39;i gofrestru');
    companyStatusLanguageMap.set('removed', 'Wedi&#39;i ddileu');

    for (const [companyStatusInEnglish, companyStatusInWelsh] of companyStatusLanguageMap){
        it('Should show the company status and month of date in welsh', async () => {
            mockSession();

            const companyNumber = '00006400';
            const companyProfile = {
                companyName: 'COMPANY NAME',
                companyNumber,
                dateOfCreation: '1983-04-05',
                companyStatus: companyStatusInEnglish,
            } as Partial<CompanyProfile>;

            const companyProfileResource = {
                httpStatusCode: 200,
                resource: companyProfile as CompanyProfile
            } as Resource<CompanyProfile>;

            session.setExtraData(ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY, { isBusinessRegistered: true });

            mockGetCompanyProfile.mockResolvedValueOnce(companyProfileResource);

            const response = await request(app)
                .get(`${PrefixedUrls.CONFIRM_COMPANY}?${QueryParameters.COMPANY_NUMBER}=${companyNumber}&lang=cy`);

            expect(response.status).toBe(200);
            expect(response.text).toContain('COMPANY NAME');
            expect(response.text).toContain(companyNumber);
            expect(response.text).toContain(companyStatusInWelsh);
            expect(response.text).toContain('5 Ebrill 1983');
        });
    }
    it('Should show the company status in English, if there is no translation in Welsh', async () => {
        mockSession();

        const companyNumber = '00006400';
        const companyProfile = {
            companyName: 'COMPANY NAME',
            companyNumber,
            dateOfCreation: '1983-04-05',
            companyStatus: 'unknown status',
        } as Partial<CompanyProfile>;

        const companyProfileResource = {
            httpStatusCode: 200,
            resource: companyProfile as CompanyProfile
        } as Resource<CompanyProfile>;

        session.setExtraData(ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY, { isBusinessRegistered: true });

        mockGetCompanyProfile.mockResolvedValueOnce(companyProfileResource);

        const response = await request(app)
            .get(`${PrefixedUrls.CONFIRM_COMPANY}?${QueryParameters.COMPANY_NUMBER}=${companyNumber}&lang=cy`);

        expect(response.status).toBe(200);
        expect(response.text).toContain('COMPANY NAME');
        expect(response.text).toContain(companyNumber);
        expect(response.text).toContain('Unknown status');
        expect(response.text).toContain('5 Ebrill 1983');
    });
});

describe("Test confirm company with different incorporated month in Welsh", () => {
    const monthLanguageMap = new Map();
    monthLanguageMap.set('01', 'Ionawr');
    monthLanguageMap.set('02', 'Chwefror');
    monthLanguageMap.set('03', 'Mawrth');
    monthLanguageMap.set('04', 'Ebrill');
    monthLanguageMap.set('05', 'Mai');
    monthLanguageMap.set('06', 'Mehefin');
    monthLanguageMap.set('07', 'Gorffennaf');
    monthLanguageMap.set('08', 'Awst');
    monthLanguageMap.set('09', 'Medi');
    monthLanguageMap.set('10', 'Hydref');
    monthLanguageMap.set('11', 'Tachwedd');
    monthLanguageMap.set('12', 'Rhagfyr');

    for (const [month, monthInWelsh] of monthLanguageMap){
        it('Should show the company incorporated month in welsh', async () => {
            mockSession();

            const companyNumber = '00006400';
            const companyProfile = {
                companyName: 'COMPANY NAME',
                companyNumber,
                dateOfCreation: `1983-${month}-05`,
                companyStatus: 'active',
            } as Partial<CompanyProfile>;

            const companyProfileResource = {
                httpStatusCode: 200,
                resource: companyProfile as CompanyProfile
            } as Resource<CompanyProfile>;

            session.setExtraData(ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY, { isBusinessRegistered: true });

            mockGetCompanyProfile.mockResolvedValueOnce(companyProfileResource);

            const response = await request(app)
                .get(`${PrefixedUrls.CONFIRM_COMPANY}?${QueryParameters.COMPANY_NUMBER}=${companyNumber}&lang=cy`);

            expect(response.status).toBe(200);
            expect(response.text).toContain('COMPANY NAME');
            expect(response.text).toContain(companyNumber);
            expect(response.text).toContain('Gweithredol');
            expect(response.text).toContain(`5 ${monthInWelsh} 1983`);
        });
    }
});
