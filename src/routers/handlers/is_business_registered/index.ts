import { Request, Response } from "express";
import { createAndLogError, logger } from "../../../utils/logger";
import { getIsBusinessRegisteredFromExtraData, setExtraDataIsBusinessRegistered } from "../../../utils/session";
import { BaseViewData, GenericHandler, Redirect, ViewModel } from "../generic";
import { PrefixedUrls } from "../../../constants";
import { addLangToUrl, selectLang } from "../../../utils/localise";

interface IsBusinessRegisteredViewData extends BaseViewData {
    isBusinessRegistered?: boolean;
}

const isBusinessRegisteredKey = "is-business-registered";

export class IsBusinessRegisteredHandler extends GenericHandler<IsBusinessRegisteredViewData> {
    private static readonly templatePath = "router_views/is_business_registered/is_business_registered";

    /**
     * Gets the viewdata from the request
     * @param req : Request
     * @returns: EnterYourDetailsViewData
     */
    public getViewData(req: Request): IsBusinessRegisteredViewData {
        const baseViewData = super.getViewData(req);
        return {
            ...baseViewData,
            title: "Is the business you work for registered with Companies House? – File package accounts with Companies House – GOV.UK",
            backURL: null,
            currentUrl: PrefixedUrls.IS_BUSINESS_REGISTERED,
            isBusinessRegistered: getIsBusinessRegisteredFromExtraData(req),
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

        const userIsBusinessRegisteredBool = isRegistered === 'true' ?
            true : isRegistered === 'false' ?
                false : undefined;

        if (userIsBusinessRegisteredBool === undefined) {
            viewData.errors.business_registered = this.errorManifest.validation.business_registered.blank;
            return {
                templatePath: IsBusinessRegisteredHandler.templatePath,
                viewData
            };
        }
        logger.debug(`is business registered with companies house: ${JSON.stringify(isRegistered)}`);
        setExtraDataIsBusinessRegistered(req, isRegistered);

        if (userIsBusinessRegisteredBool) {
            return { redirect: addLangToUrl("company-search", selectLang(req.query.lang)) };
        } else {
            return { redirect: addLangToUrl("enter-business-name", selectLang(req.query.lang)) };
        }

    }
}
