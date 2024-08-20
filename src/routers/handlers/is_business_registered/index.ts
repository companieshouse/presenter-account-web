import { Request, Response } from "express";
import { createAndLogError, logger } from "../../../utils/logger";
import { BaseViewData, GenericHandler, Redirect, ViewModel } from "../generic";
import { PrefixedUrls } from "../../../constants";
import { getLocalesField } from "../../../utils/localise";
import { env } from "../../../config";
import { COMPANY_NUMBER_SESSION_KEY, getPresenterAccountDetails, setPresenterAccountDetails } from "../../../utils/session";

interface IsBusinessRegisteredViewData extends BaseViewData {
    isBusinessRegistered?: string;
}

const isBusinessRegisteredKey = "is-business-registered";

export class IsBusinessRegisteredHandler extends GenericHandler<IsBusinessRegisteredViewData> {
    private static readonly templatePath = "router_views/is_business_registered/is_business_registered";

    /**
     * Gets the viewdata from the request
     * @param req : Request
     * @returns: IsBusinessRegisteredViewData
     */
    public getViewData(req: Request): IsBusinessRegisteredViewData {
        const baseViewData = super.getViewData(req);
        return {
            ...baseViewData,
            title: "Is the business you work for registered with Companies House? – File package accounts with Companies House – GOV.UK",
            backURL: env.FEATURE_FLAG_GDS_START_PAGE_290424 ? env.GDS_START_PAGE_LINK : PrefixedUrls.HOME,
            currentUrl: PrefixedUrls.IS_BUSINESS_REGISTERED,
            isBusinessRegistered: String(getPresenterAccountDetails(req)?.isBusinessRegistered),
        };
    }

    async executeGet(
        req: Request,
        _response: Response
    ): Promise<ViewModel<IsBusinessRegisteredViewData>> {
        const viewData = this.getViewData(req);

        return {
            viewData,
            templatePath: IsBusinessRegisteredHandler.templatePath,
        };
    }

    async executePost(req: Request, _res: Response): Promise<ViewModel<IsBusinessRegisteredViewData> | Redirect> {
        const viewData = this.getViewData(req);
        if (req.session === undefined) {
            throw createAndLogError("Session is undefined. Unable to store is business registered choice.");
        }

        const isRegistered = req.body[isBusinessRegisteredKey];

        const isBusinessRegistered = this.isBusinessRegistered(isRegistered);

        if (isBusinessRegistered === undefined) {
            viewData.errors.business_registered = { "summary": getLocalesField("is_business_registered_non_selection_error_message_summary", req) };
            return {
                templatePath: IsBusinessRegisteredHandler.templatePath,
                viewData
            };
        }
        logger.debug(`is business registered with companies house: ${JSON.stringify(isRegistered)}`);
        const detail = { ...getPresenterAccountDetails(req), isBusinessRegistered };
        let redirectUrl: string;

        if (isBusinessRegistered) {
            // Reset the business name value in session, when the business is registered
            detail.businessName = null;
            redirectUrl = PrefixedUrls.COMPANY_SEARCH;
        } else {
            // Deleted the company number from session, when the business is not registered
            req.session?.deleteExtraData(COMPANY_NUMBER_SESSION_KEY);
            redirectUrl = PrefixedUrls.ENTER_BUSINESS_NAME;
        }
        setPresenterAccountDetails(req, detail);
        return { redirect: redirectUrl };

    }

    private isBusinessRegistered(isRegistered: string|undefined): boolean|undefined {
        const TRUE = 'true';
        const FALSE = 'false';
        if (isRegistered !== undefined && [TRUE, FALSE].includes(isRegistered)){
            return isRegistered === TRUE;
        } else {
            return undefined;
        }
    }


}
