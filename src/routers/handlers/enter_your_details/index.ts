import { BaseViewData, GenericHandler, ViewModel } from "./../generic";
import { Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { type Address } from "private-api-sdk-node/src/services/presenter-account/types";
import { PrefixedUrls, Countries } from "../../../constants";

type CountryType = {
    value: string,
    text: string,
    selected?: boolean
};

interface AddressType extends Address
{
    county?: string
}

interface EnterYourDetailsViewData extends BaseViewData{
    address: AddressType ;
    countries: CountryType[];
}

export class EnterYourDetailsHandler extends GenericHandler<EnterYourDetailsViewData>{
    private static readonly templatePath = "router_views/enter-your-details/enter-your-details";
    readonly title = "What is your correspondence address?";

    public getViewData(req: Request): EnterYourDetailsViewData {
        const baseViewData = super.getViewData(req);

        return {
            ...baseViewData,
            title: "What is your correspondence address?",
            backURL: PrefixedUrls.SIGN_IN,
            address: req.body as Address,
            countries: [{ value: 'Select a country', text: 'Select a country', selected: true }, ...Countries]
        };
    }

    public execute(req: Request, _response: Response): ViewModel<EnterYourDetailsViewData>{
        logger.info(`${this.constructor.name} execute called`);

        const viewData = this.getViewData(req);

        return {
            templatePath: EnterYourDetailsHandler.templatePath,
            viewData
        };
    }
}
