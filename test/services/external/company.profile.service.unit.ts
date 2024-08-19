import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { Resource } from "@companieshouse/api-sdk-node";
import { CompanyProfileService } from "../../../src/service/company.profile.service";


jest.mock('@companieshouse/api-sdk-node/dist/client', () => {
    return jest.fn().mockImplementation(() => {
        return {
            companyProfile: {
                getCompanyProfile: jest.fn()
            }
        };
    });
});

function createApiResponse() {
    return {
        companyName: "COMPANY_NAME_???",
        companyNumber: "00000000",
        companyStatus: "active",
        dateOfCreation: "1999-12-31",
        type: "type",
        registeredOfficeAddress: {
            addressLineOne: "line one",
            addressLineTwo: "line two",
            postalCode: "ZZ78A 8OP"
        },
        accounts: {
            nextAccounts: {
                periodStartOn: "2017-01-22",
            },
            nextDue: "2019-01-22",
        }
    };
}

describe("CompanyProfileService", () => {
    let service: CompanyProfileService;
    const mockGetStatus = jest.fn<Promise<Resource<CompanyProfile>>, []>();

    beforeEach(() => {
        jest.resetAllMocks();

        service = new CompanyProfileService({
            companyProfile: {
                getCompanyProfile: mockGetStatus
            }
        } as unknown as ApiClient);
    });

    it("should return a successful result with company profile for a valid request", async () => {
        const mockResponse = { httpStatusCode: 200, resource: createApiResponse() as unknown as CompanyProfile };
        mockGetStatus.mockResolvedValue(mockResponse);

        const result = await service.getCompanyProfile("00000000");

        expect(result.isSuccess()).toBe(true);

        const value = result.value;

        expect(value).toHaveProperty("dateOfCreation", "1999-12-31");
        expect(value).toHaveProperty("companyName", "COMPANY_NAME_???");
        expect(value).toHaveProperty("companyNumber", "00000000");
        expect(value).toHaveProperty("companyStatus", "active");
        expect(value).toHaveProperty("registeredOfficeAddress.addressLineOne", "line one");
        expect(value).toHaveProperty("registeredOfficeAddress.addressLineTwo", "line two");
        expect(value).toHaveProperty("registeredOfficeAddress.postalCode", "ZZ78A 8OP");
        expect(value).toHaveProperty("accounts.nextAccounts.periodStartOn", "2017-01-22");
        expect(value).toHaveProperty("accounts.nextDue", "2019-01-22");
    });

    it("should return a failure result if http code is not 200", async () => {
        const mockResponse = { httpStatusCode: 418, resource: createApiResponse() as unknown as CompanyProfile };
        mockGetStatus.mockResolvedValue(mockResponse);

        const result = await service.getCompanyProfile("00000000");
        expect(result.isFailure()).toBe(true);
        expect(result.value).toBeInstanceOf(Error);
        expect((result.value as Error).message).toBe("Unable to process requested company number");
    });

    it("should return a failure result if resource is undefined", async () => {
        const mockResponse = { httpStatusCode: 200, resource: undefined };
        mockGetStatus.mockResolvedValue(mockResponse);

        const result = await service.getCompanyProfile("00000000");
        expect(result.isFailure()).toBe(true);
        expect(result.value).toBeInstanceOf(Error);
        expect((result.value as Error).message).toBe("Unable to process requested company number");
    });
});
