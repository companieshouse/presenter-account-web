import { Request, Response } from "express";
import { createAndLogError, logger } from "../../../utils/logger";
import { getIsBusinessRegisteredFromExtraData, setExtraDataIsBusinessRegistered } from "../../../utils/session";
import { BaseViewData, GenericHandler, ViewModel } from "../generic";
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
            viewName: "Is the business you work for registered with Companies House?",
            backURL: null,
            isBusinessRegistered: getIsBusinessRegisteredFromExtraData(req)
        };
    }

    executeGet(
        req: Request,
        _response: Response
    ): ViewModel<IsBusinessRegisteredViewData> {
        const viewData = this.getViewData(req);

        return {
            viewData,
            templatePath: IsBusinessRegisteredHandler.templatePath,
        };
    }


    executePost(req: Request, _res: Response) {
        if (req.session === undefined) {
            throw createAndLogError("Session is undefined. Unable to store is business registered choice.");
        }

        const isRegistered = req.body[isBusinessRegisteredKey];
        if (isRegistered === undefined) {
            throw new Error("Neither option was selected for whether the business is registered with companies house or not");
        }
        logger.debug(`is business registered with companies house: ${JSON.stringify(isRegistered)}`);
        setExtraDataIsBusinessRegistered(req, isRegistered)
        return addLangToUrl(PrefixedUrls.ENTER_YOUR_DETAILS, selectLang(req.query.lang));

    }
}