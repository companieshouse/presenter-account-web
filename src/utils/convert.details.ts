import { Details, isDetails } from "private-api-sdk-node/dist/services/presenter-account/types";
import { PresenterSessionDetails } from "./session";


export function convertSessionDetailsToApiDetails(details: PresenterSessionDetails): Details {
    const apiDetails = {
        email: details.email,
        userId: details.userId,
        createdDate: details.createdDate,
        lang: details.lang,
        name: details.name,
        address: details.address
    };
    if (isDetails(apiDetails)) {
        return apiDetails;
    } else {
        throw new Error(`Presenter Account Session Details to Presenter Account API Details failed`);
    }
}
