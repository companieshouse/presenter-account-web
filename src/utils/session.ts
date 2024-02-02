import { defaultDetails } from "../constants";
import { Request } from "express";
import { Name, type Details } from "private-api-sdk-node/src/services/presenter-account/types";

export const PRESENTER_ACCOUNT_SESSION_KEY = "presenter_account_details";

export function getPresenterAccountDetails(req: Request): Details {
    let presenterAccountDetails = req.session?.getExtraData(PRESENTER_ACCOUNT_SESSION_KEY);
    if (presenterAccountDetails === undefined) {
        presenterAccountDetails =  fetchUserDetails(req, defaultDetails);
        setPresenterAccountDetails(req, defaultDetails);
    }
    return presenterAccountDetails as Details;
}


export function setPresenterAccountDetails(req: Request, details: Details) {
    req.session?.setExtraData(PRESENTER_ACCOUNT_SESSION_KEY, details);
}

export function fetchUserDetails(req: Request, details: Details): Details{
    const signinInfo = req.session?.data?.signin_info;
    const email = signinInfo?.user_profile?.email ?? "";
    const userId = signinInfo?.user_profile?.id ?? "";
    const forename = signinInfo?.user_profile?.forename ?? "";
    const surname = signinInfo?.user_profile?.surname ?? "";

    const name: Name = { forename, surname };

    const createdDate = (new Date()).toISOString();

    return { ...details,
        email,
        userId,
        name,
        createdDate
    };
}
