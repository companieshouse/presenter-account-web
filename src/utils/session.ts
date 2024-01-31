import { defaultDetails } from "../constants";
import { Request } from "express";
import { Name, type Details } from "private-api-sdk-node/src/services/presenter-account/types";

export const PRESENTER_ACCOUNT_SESSION_KEY = "presenter_account_details";

export function getPresenterAccountDetails(req: Request): Details {
    let presenterAccountDetails: Details | undefined;
    if (req.session !== undefined){
        presenterAccountDetails = req.session.getExtraData(PRESENTER_ACCOUNT_SESSION_KEY);
        if (presenterAccountDetails === undefined) {
            presenterAccountDetails =  fetchUserDetails(req, defaultDetails);
            setPresenterAccountDetails(req, defaultDetails);
        }
        return presenterAccountDetails;
    }
    return fetchUserDetails(req, defaultDetails);
}


export function setPresenterAccountDetails(req: Request, details: Details) {
    if (req.session !== undefined){
        req.session.setExtraData(PRESENTER_ACCOUNT_SESSION_KEY, details);
    }
}

export function fetchUserDetails(req: Request, details: Details): Details{
    const signinInfo = req.session?.data?.signin_info;
    const email = signinInfo?.user_profile?.email;
    const userId = signinInfo?.user_profile?.id;
    const forename = signinInfo?.user_profile?.forename as string;
    const surname = signinInfo?.user_profile?.surname as string;

    const name: Name = { forename, surname };

    const createdDate = (new Date()).toISOString();

    details = { ...details,
        email,
        userId,
        name,
        createdDate
    } as Details;

    return details;
}
