import { defaultDetails } from "./../constants";
import { Request } from "express";
import { isDetails } from "private-api-sdk-node/dist/services/presenter-account/types";
import { type Name, type Details } from "private-api-sdk-node/src/services/presenter-account/types";

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
    const errors: string[] = [];
    if (user_profile !== undefined) {
        const { email, id, forename, surname } = user_profile;
        if ( forename === undefined || surname  === undefined) {
            errors.push("Name not found in session");
        }
        if (id === undefined){
            errors.push("UserId not found in session");
        }
        if (email === undefined) {
            errors.push("Email not found in session");
        }
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        return { ...details,
            email: email as string,
            userId: id as string,
            name: { forename, surname } as Name,
            createdDate
        };
    }
    throw new Error("User profile is undefined");
}

export function getPresenterAccountDetailsOrDefault(req: Request) {
    let details = getPresenterAccountDetails(req);
    if (details === undefined) {
        details = populatePresenterAccountDetails(req, defaultDetails);
        setPresenterAccountDetails(req, details);
    }
    return details;
}
