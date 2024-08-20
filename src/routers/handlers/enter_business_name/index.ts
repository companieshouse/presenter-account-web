import { BaseViewData, GenericHandler, Redirect, ViewModel } from "./../generic";
import { Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { type Details, isLang } from "private-api-sdk-node/dist/services/presenter-account/types";
import { PrefixedUrls } from "../../../constants";
import { setPresenterAccountDetails, getPresenterAccountDetailsOrDefault, getPresenterAccountDetails, PresenterSessionDetails } from "./../../../utils/session";
import { getLocalesField } from "../../../utils/localise";


interface EnterBusinessNameViewData extends BaseViewData{
    businessName?: string | null;
}

export class EnterBusinessNameHandler extends GenericHandler<EnterBusinessNameViewData>{
    private static readonly templatePath = "router_views/enter-business-name/enter-business-name";

    /**
     * Gets the viewdata from the request
     * @param req : Request
     * @returns: EnterBusinessNameViewData
     */
    public getViewData(req: Request): EnterBusinessNameViewData {
        const baseViewData = super.getViewData(req);
        return {
            ...baseViewData,
            viewName: 'enter business name',
            title: getLocalesField("enter_business_name_page_title", req),
            backURL: PrefixedUrls.IS_BUSINESS_REGISTERED,
            currentUrl: PrefixedUrls.ENTER_BUSINESS_NAME
        };
    }

    public executeGet(req: Request, _response: Response): ViewModel<EnterBusinessNameViewData>{
        logger.info(`${this.constructor.name} get execute called`);
        const viewData = this.getViewData(req);
        const presenterDetailsInSession = getPresenterAccountDetails(req);
        if (presenterDetailsInSession?.businessName !== undefined){
            viewData.businessName = presenterDetailsInSession?.businessName;
        }

        return {
            templatePath: EnterBusinessNameHandler.templatePath,
            viewData
        };
    }

    public executePost(req: Request, _response: Response): ViewModel<EnterBusinessNameViewData> | Redirect {
        logger.info(`${this.constructor.name} post execute called`);
        const details: PresenterSessionDetails = getPresenterAccountDetailsOrDefault(req);

        const lang = (req.query.lang ?? req.session?.getExtraData("lang")) as Details["lang"];
        if (isLang(lang)){
            details.lang = lang;
        } else {
            throw new Error(`Invalid language: ${lang} variable should be either 'en' or 'cy'`);
        }
        if (!details.isBusinessRegistered){
            // Set the business name in session, if business is not registered
            details.businessName = req.body.businessName;
        } else {
            // TODO
            throw new Error('Business registered question not answered');
        }
        setPresenterAccountDetails(req, details);
        return { redirect: PrefixedUrls.ENTER_YOUR_DETAILS };
    }

    public static getTemplatePath(){
        return this.templatePath;
    }
}
