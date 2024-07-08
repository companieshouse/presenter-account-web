import { BaseViewData, GenericHandler, Redirect, ViewModel } from "./../generic";
import { Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { type Address } from "private-api-sdk-node/src/services/presenter-account/types";
import { PrefixedUrls, countries } from "../../../constants";
import { setPresenterAccountDetails, getPresenterAccountDetailsOrDefault } from "./../../../utils/session";
import { isAddress } from "private-api-sdk-node/dist/services/presenter-account/types";
import { env } from "../../../config";
import { getLocalesField, selectLang, setSessionLanguage } from "../../../utils/localise";

interface EnterYourDetailsViewData extends BaseViewData{
    address: Address ;
    countries: Array<{value: string, text: string, selected?: boolean}>;
}

export class EnterYourDetailsHandler extends GenericHandler<EnterYourDetailsViewData>{
    private static readonly templatePath = "router_views/enter-your-details/enter-your-details";

    /**
     * Gets the viewdata from the request
     * @param req : Request
     * @returns: EnterYourDetailsViewData
     */
    public getViewData(req: Request): EnterYourDetailsViewData {
        const baseViewData = super.getViewData(req);

        const chooseCountry = getLocalesField("enter_your_details_choose_country", req);

        const countriesWithChoose = [ { value: "choose", text: chooseCountry, selected: true }, ...countries ];
        return {
            ...baseViewData,
            title: getLocalesField("enter_your_details_page_title", req),
            currentUrl: PrefixedUrls.ENTER_YOUR_DETAILS,
            backURL: env.FEATURE_FLAG_GDS_START_PAGE_290424 ? env.GDS_START_PAGE_LINK : PrefixedUrls.HOME,
            viewName: 'enter your details',
            countries: countriesWithChoose
        };
    }

    public executeGet(req: Request, _response: Response): ViewModel<EnterYourDetailsViewData>{
        logger.info(`${this.constructor.name} get execute called`);

        const details = getPresenterAccountDetailsOrDefault(req);

        const viewData = this.getViewData(req);
        viewData.address = details.address;

        if (req.query.lang){
            setSessionLanguage(selectLang(req.query.lang), req);
        }

        return {
            templatePath: EnterYourDetailsHandler.templatePath,
            viewData
        };
    }

    public executePost(req: Request, _response: Response): ViewModel<EnterYourDetailsViewData> | Redirect {
        logger.info(`${this.constructor.name} post execute called`);
        const details =  getPresenterAccountDetailsOrDefault(req);

        const address = { ...req.body };
        if (isAddress(address)){
            details.address = address;
        } else {
            throw new Error("Incorrect Address format set for presenter account details");
        }

        if (req.query.lang){
            setSessionLanguage(selectLang(req.query.lang), req);
        }

        setPresenterAccountDetails(req, details);
        return { redirect: PrefixedUrls.CHECK_DETAILS };
    }

    public static getTemplatePath(){
        return this.templatePath;
    }
}
