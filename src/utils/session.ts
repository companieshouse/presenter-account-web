import { Request } from "express";
import { isDetails } from "private-api-sdk-node/dist/services/presenter-account/types";
import { type Details } from "private-api-sdk-node/src/services/presenter-account/types";

export const PRESENTER_ACCOUNT_SESSION_KEY = "presenter_account_details";
const QUERY_LANG = "lang";

export function getPresenterAccountDetails(req: Request): Details | undefined {
    const presenterAccountDetails = req.session?.getExtraData(PRESENTER_ACCOUNT_SESSION_KEY);
    if (presenterAccountDetails === undefined || isDetails(presenterAccountDetails)) {
        return presenterAccountDetails;
    } else {
        throw new Error("Presenter Account Details incorrect format in session");
    }
}


export function setPresenterAccountDetails(req: Request, details: Details) {
    req.session?.setExtraData(PRESENTER_ACCOUNT_SESSION_KEY, details);
}

export function populatePresenterAccountDetails(req: Request): Details {
    const user_profile = req.session?.data?.signin_info?.user_profile;
    const createdDate = (new Date()).toISOString();

    if (user_profile === undefined) {
        throw new Error("User profile is undefined");
    }

    const { email, id, forename, surname } = user_profile;
    const detailObject = {
        email: email,
        userId: id,
        name: { forename, surname },
        createdDate,
        address: {
            premises: '',
            postCode: '',
            country: '',
            addressLine1: '',
            townOrCity: ''
        }
    } as Details;

    return detailObject;
}

export function getPresenterAccountDetailsOrDefault(req: Request) {
    let details = getPresenterAccountDetails(req);
    if (details === undefined) {
        details = populatePresenterAccountDetails(req);
        setPresenterAccountDetails(req, details);
    }
    return details;
}

export function cleanSession(req: Request) {
    req.session?.setExtraData(PRESENTER_ACCOUNT_SESSION_KEY, undefined);
    req.session?.deleteExtraData(QUERY_LANG);
}
