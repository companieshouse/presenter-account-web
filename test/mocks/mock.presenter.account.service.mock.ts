jest.mock("../../src/service/api.client.service");

import { createOauthPrivateApiClient } from "../../src/service/api.client.service";

export const mockSubmitPresenterAccountDetails = jest.fn();

(createOauthPrivateApiClient as jest.Mock).mockReturnValue({
    presenterAccountService: {
        submitPresenterAccountDetails: mockSubmitPresenterAccountDetails
    },
});
