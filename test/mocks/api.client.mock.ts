export const mockGetCompanyProfile = jest.fn();

const mockApiClient = {
    companyProfile: {
        getCompanyProfile: mockGetCompanyProfile
    }
};

const mockCreatePublicOAuthApiClient = jest.fn();

mockCreatePublicOAuthApiClient.mockReturnValue(mockApiClient);

jest.mock("../../src/service/api.client.service", () => {
    return {
        createPublicOAuthApiClient: mockCreatePublicOAuthApiClient,
    };
});
