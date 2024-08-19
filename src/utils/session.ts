import { QueryLang, LanguageCodes, ContextKeys } from "../constants";
import { Request } from "express";
import { type Name, type Address, isLang, isName, isAddress } from "private-api-sdk-node/dist/services/presenter-account/types";

export interface PresenterSessionDetails {
    isBusinessRegistered: boolean;
    email?: string;
    userId?: string;
    createdDate?: string;
    lang?: "en" | "cy";
    name?: Name;
    address?: Address;
}


export function getPresenterAccountDetails(req: Request): PresenterSessionDetails | undefined {
    const presenterAccountDetails = req.session?.getExtraData(ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY);
    if (presenterAccountDetails === undefined || isPresenterSessionDetails(presenterAccountDetails)) {
        return presenterAccountDetails;
    } else {
        throw new Error("Presenter Account Details incorrect format in session");
    }
}


export function setPresenterAccountDetails(req: Request, details: PresenterSessionDetails) {
    req.session?.setExtraData(ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY, details);
}

export function populatePresenterAccountDetails(req: Request): PresenterSessionDetails {
    const defaultAddress = {
        premises: '',
        postCode: '',
        country: '',
        addressLine1: '',
        townOrCity: ''
    };
    const presenterAccountDetails = getPresenterAccountDetails(req);
    const isBusinessRegistered = presenterAccountDetails?.isBusinessRegistered;
    const address = presenterAccountDetails?.address === undefined ? defaultAddress : getPresenterAccountDetails(req)?.address;
    const user_profile = req.session?.data?.signin_info?.user_profile;
    const createdDate = (new Date()).toISOString();

    if (user_profile === undefined) {
        throw new Error("User profile is undefined");
    }

    const { email, id, forename, surname } = user_profile;
    const presenterAccountDetailsObject = {
        isBusinessRegistered,
        email: email,
        userId: id,
        name: { forename, surname },
        createdDate,
        address,
        lang: LanguageCodes.EN
    } as PresenterSessionDetails;

    return presenterAccountDetailsObject;
}

export function getPresenterAccountDetailsOrDefault(req: Request) {
    let details = getPresenterAccountDetails(req);
    // details is not set or userProfile is not set
    if (details === undefined || !isUserProfileSet(details)) {
        details = populatePresenterAccountDetails(req);
        setPresenterAccountDetails(req, details);
    }
    return details;
}

export function cleanSession(req: Request) {
    req.session?.setExtraData(ContextKeys.PRESENTER_ACCOUNT_SESSION_KEY, undefined);
}

export function cleanLanguage(req: Request) {
    req.session?.deleteExtraData(QueryLang);
}

function isPresenterSessionDetails(data: any): data is PresenterSessionDetails {
    return (
        typeof data.isBusinessRegistered === "boolean" &&
        data.email === undefined || typeof data.email === "string" &&
        data.userId === undefined || typeof data.userId === "string" &&
        data.createdDate === undefined || typeof data.createdDate === "string" &&
        data.lang === undefined || isLang(data.lang) &&
        data.name === undefined || isName(data.name) &&
        data.address === undefined || isAddress(data.address)
    );
}

function isUserProfileSet(presenterAccountDetails: PresenterSessionDetails): boolean {
    return (
        presenterAccountDetails.userId !== undefined && typeof presenterAccountDetails.userId === "string" &&
        presenterAccountDetails.email !== undefined && typeof presenterAccountDetails.email === "string" &&
        presenterAccountDetails.name !== undefined && isName(presenterAccountDetails.name)
    );
}
