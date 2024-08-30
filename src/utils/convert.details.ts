import { Company, Details, isDetails } from "private-api-sdk-node/dist/services/presenter-account/types";
import { PresenterSessionDetails } from "./session";


export function convertSessionDetailsToApiDetails(details: PresenterSessionDetails): Details {
    const company: Company = {
        companyName: details.companyName,
        companyNumber: details.companyNumber
    } as Company;
    const business: Company = {
        companyName: details.businessName,
        companyNumber: null
    } as Company;
    const apiDetails = {
        email: details.email,
        userId: details.userId,
        company: details.isBusinessRegistered ? company : business,
        lang: details.lang,
        name: details.name,
        address: details.address
    };
    if (isDetails(apiDetails)) {
        return apiDetails;
    } else {
        throw new Error(`Presenter account was unable to be set.`);
    }
}
