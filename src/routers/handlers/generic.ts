// Generic handler is the base handler that is extended by all other handlers
// It contains methods that are common to multiple route handlers

import { ExternalUrls, PrefixedUrls, Urls, servicePathPrefix } from "../../constants";
import errorManifest from "../../utils/error_manifests/default";
import { Request } from "express";

export interface BaseViewData {
    errors: any
    title: string
    isSignedIn: boolean
    backURL: string | null
    servicePathPrefix: string
    currentUrl: string
    Urls: typeof PrefixedUrls
    ExternalUrls: typeof ExternalUrls
    userEmail: string | null
    feedbackLink: string
    viewName: string
}

export const defaultBaseViewData: Partial<BaseViewData> = {
    errors: {},
    isSignedIn: false,
    backURL: null,
    servicePathPrefix: servicePathPrefix,
    Urls: PrefixedUrls,
    ExternalUrls: ExternalUrls,
    userEmail: null,
    title: 'Apply to file with Companies House using software'
} as const;


export interface Redirect {
    redirect: string
}

export abstract class GenericHandler<T extends BaseViewData> {
    protected errorManifest: typeof errorManifest;
    private viewData: T;

    constructor() {
        this.errorManifest = errorManifest;
        this.viewData = structuredClone(defaultBaseViewData) as T;
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
        this.viewData.feedbackLink = this.getFeedbackLink(this.getPageName(req));

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

    getPageName(req: Request): string {
        const pathSegments = req.baseUrl.split('/').filter(Boolean);
        return pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : servicePathPrefix;
    }

    getFeedbackLink(pageName: string): string{
        if (`/${pageName}` === Urls.CONFIRMATION) {
            return ExternalUrls.FEEDBACK_CONF;
        }
        return ExternalUrls.FEEDBACK;
    }
}

export interface ViewModel<T> {
    templatePath: string,
    viewData: T
}
