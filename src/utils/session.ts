import { Request } from "express";
import { isDetails } from "private-api-sdk-node/dist/services/presenter-account/types";
import { Name, type Details } from "private-api-sdk-node/src/services/presenter-account/types";

export const PRESENTER_ACCOUNT_SESSION_KEY = "presenter_account_details";

export function getPresenterAccountDetails(req: Request): Details {
    const presenterAccountDetails = req.session?.getExtraData(PRESENTER_ACCOUNT_SESSION_KEY);

    if (presenterAccountDetails === undefined) {
        throw new Error(`Presenter account details are undefined`);
    }

    if (!isDetails(presenterAccountDetails)) {
        throw new Error(`Invalid presenter account details`);
    }

    return presenterAccountDetails;
}


export function setPresenterAccountDetails(req: Request, details: Details) {
    req.session?.setExtraData(PRESENTER_ACCOUNT_SESSION_KEY, details);
}

export function generateUserDetails(req: Request): Details{
    const signinInfo = req.session?.data?.signin_info;
    const details = {} as Details;

    details.email = signinInfo?.user_profile?.email as string;
    details.userId = signinInfo?.user_profile?.id as string;

    const forename = signinInfo?.user_profile?.forename as string;
    const surname = signinInfo?.user_profile?.surname as string;

    const name: Name = { forename, surname };

    details.name = name;

    details.address = req.body;

    const createdDate = new Date();

    details.createdDate = createdDate.toISOString();

    return details;
}
