import { defaultDetails } from "./../constants";
import { Request } from "express";
import { isDetails } from "private-api-sdk-node/dist/services/presenter-account/types";
import { type Details } from "private-api-sdk-node/src/services/presenter-account/types";

export const PRESENTER_ACCOUNT_SESSION_KEY = "presenter_account_details";

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

export function populatePresenterAccountDetails(req: Request, details: Details): Details{
    const user_profile = req.session?.data?.signin_info?.user_profile;
    const createdDate = (new Date()).toISOString();

    if (user_profile === undefined) {
        throw new Error("User profile is undefined");
    }

    const { email, id, forename, surname } = user_profile;
    const detailObject = { ...details,
        email: email,
        userId: id,
        name: { forename, surname },
        createdDate
    };

    if (isDetails(detailObject)){
        return detailObject;
    }

    throw new Error("Presenter account detail object format not supported");
}

export function getPresenterAccountDetailsOrDefault(req: Request) {
    let details = getPresenterAccountDetails(req);
    if (details === undefined) {
        details = populatePresenterAccountDetails(req, defaultDetails);
        setPresenterAccountDetails(req, details);
    }
    return details;
}

export function cleanSessionOnSubmit(req: Request) {
    req.session?.setExtraData(PRESENTER_ACCOUNT_SESSION_KEY, undefined);
}
