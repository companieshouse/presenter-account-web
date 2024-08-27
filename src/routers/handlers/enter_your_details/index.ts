import { BaseViewData, GenericHandler, Redirect, ViewModel } from "./../generic";
import { Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { PrefixedUrls, countries } from "../../../constants";
import { setPresenterAccountDetails, getPresenterAccountDetailsOrDefault, PresenterSessionDetails } from "./../../../utils/session";
import { type Details, type Address, isAddress, isLang, Name, isName } from "private-api-sdk-node/dist/services/presenter-account/types";
import { env } from "../../../config";
import { getLocalesField } from "../../../utils/localise";

interface EnterYourDetailsViewData extends BaseViewData{
    address: Address ;
    name: Name;
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

        if (details.address !== undefined) {viewData.address = details.address;}
        if (details.name !== undefined){ viewData.name = details.name;}

        return {
            templatePath: EnterYourDetailsHandler.templatePath,
            viewData
        };
    }

    public executePost(req: Request, _response: Response): ViewModel<EnterYourDetailsViewData> | Redirect {
        logger.info(`${this.constructor.name} post execute called`);
        const details: PresenterSessionDetails =  getPresenterAccountDetailsOrDefault(req);

        const { premises, addressLine1, addressLine2, townOrCity, country, postCode, forename, surname } = req.body;

        const address: Address = {
            premises,
            addressLine1,
            addressLine2,
            townOrCity,
            country,
            postCode,
        };

        const name: Name = {
            forename,
            surname,
        };

        if (isAddress(address)){
            details.address = address;
        } else {
            throw new Error("Incorrect Address format set for presenter account details");
        }

        if (isName(name)){
            details.name = name;
        } else {
            throw new Error("Incorrect name given for presenter account details");
        }

        const lang = (req.query.lang ?? req.session?.getExtraData("lang")) as Details["lang"];
        if (isLang(lang)){
            details.lang = lang;
        } else {
            throw new Error(`Invalid language: ${lang} variable should be either 'en' or 'cy'`);
        }
        setPresenterAccountDetails(req, details);
        return { redirect: PrefixedUrls.CHECK_DETAILS };
    }

    public static getTemplatePath(){
        return this.templatePath;
    }
}
