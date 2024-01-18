// Generic handler is the base handler that is extended by all other handlers
// It contains methods that are common to multiple route handlers

import { PrefixedUrls, servicePathPrefix } from "../../constants";
import errorManifest from "../../utils/error_manifests/default";
import { Request } from "express";

const pageLinks = {
    contactUs: "https://www.gov.uk/contact-companies-house",
    applicationPresenterAccountLink: "https://www.gov.uk/government/publications/apply-for-a-companies-house-online-filing-presenter-account",
    abilityNetLink: "https://mcmw.abilitynet.org.uk/"
};

export interface BaseViewData {
    errors: any
    title: string
    isSignedIn: boolean
    backURL: string | null
    pageLinks: typeof pageLinks
    servicePathPrefix: string
    Urls: typeof PrefixedUrls
    userEmail: string | null
    [key: string]: any
}

export const defaultBaseViewData: Partial<BaseViewData> = {
    errors: {},
    isSignedIn: false,
    backURL: null,
    servicePathPrefix: servicePathPrefix,
    Urls: PrefixedUrls,
    userEmail: null,
    pageLinks
};


export interface Redirect {
    redirect: string
}

export abstract class GenericHandler<T extends BaseViewData> {
    errorManifest: any;
    private viewData: T;

    constructor() {
        this.errorManifest = errorManifest;
        this.viewData = {
            ...defaultBaseViewData
        } as T;
    }

    processHandlerException (err: any): Object {
        if (err.name === "VALIDATION_ERRORS") {
            return err.stack;
        }
        return {
            serverError: this.errorManifest.generic.serverError
        };
    }

    populateViewData(req: Request) {
        const { signin_info } = req.session?.data ?? {};
        const isSignedIn = signin_info?.signed_in !== undefined;
        this.viewData.isSignedIn = isSignedIn;

        if (!isSignedIn) {return;}

        const userEmail = signin_info?.user_profile?.email;
        if (!userEmail) {
            throw new Error("GenericHandler unable to get email. Email is undefined.");
        }

        this.viewData.userEmail = userEmail;
    }


    getViewData(req: Request): T {
        this.populateViewData(req);
        return this.viewData;
    }
}

export interface ViewModel<T> {
    templatePath: string,
    viewData: T
}
