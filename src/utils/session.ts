import { Session } from "@companieshouse/node-session-handler";
import { Request } from "express";
import { isDetails } from "private-api-sdk-node/dist/services/presenter-account/types";
import { type Details } from "private-api-sdk-node/src/services/presenter-account/types";

export const PRESENTER_ACCOUNT_SESSION_KEY = "presenter_account_details";

export function getPresenterAccountDetails(req: Request): Details {
    const session = req.session as Session;
    const presenterAccountDetails = session.getExtraData(PRESENTER_ACCOUNT_SESSION_KEY);

    if (presenterAccountDetails === undefined) {
        throw new Error(`Presenter account details are undefined`);
    }

    if (!isDetails(presenterAccountDetails)) {
        throw new Error(`Invalid presenter account details`);
    }

    return presenterAccountDetails;
}


export function setPresenterAccountDetails(req: Request, details: Details) {
    const session = req.session as Session;
    session.setExtraData(PRESENTER_ACCOUNT_SESSION_KEY, details);
}
