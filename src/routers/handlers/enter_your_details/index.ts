import { BaseViewData, GenericHandler, Redirect, ViewModel } from "./../generic";
import { Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { Details, type Address } from "private-api-sdk-node/src/services/presenter-account/types";
import { PrefixedUrls, Countries } from "../../../constants";
import { addressToQueryString } from "./../../../utils";
import { setPresenterAccountDetails } from "./../../../utils/session";
import { Result, ValidationError, validationResult } from "express-validator";

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

    /**
     * Gets the viewdata from the request
     * @param req : Request
     * @returns: EnterYourDetailsViewData
     */
    public getViewData(req: Request): EnterYourDetailsViewData {
        const baseViewData = super.getViewData(req);

        return {
            ...baseViewData,
            title: this.title,
            backURL: PrefixedUrls.SIGN_IN,
            address: req.body as Address,
            countries: [{ value: 'Select a country', text: 'Select a country', selected: true }, ...Countries]
        };
    }

    public executeGet(req: Request, _response: Response): ViewModel<EnterYourDetailsViewData>{
        logger.info(`${this.constructor.name} get execute called`);

        const viewData = this.getViewData(req);

        return {
            templatePath: EnterYourDetailsHandler.templatePath,
            viewData
        };
    }

    public executePost(req: Request, _response: Response): Redirect | ViewModel<EnterYourDetailsViewData> {
        logger.info(`${this.constructor.name} post execute called`);
        const details: Details = {} as Details;
        details.address = req.body as Address;
        const queryString = addressToQueryString(details.address);
        const redirect: string = `${PrefixedUrls.CHECK_DETAILS}?${queryString}`;

        setPresenterAccountDetails(req, details);
        const errors = this.validateRequest(req);

        if (!errors.isEmpty()){
            const viewData = this.getViewData(req);
            viewData.errors = errors.array();
            viewData.errors.map((error: { [x: string]: any; path: string; }) => error["fieldId"] = error.path.split(/(?=[A-Z0-9])/).join('-').toLocaleLowerCase());
            return {
                templatePath: EnterYourDetailsHandler.templatePath,
                viewData
            };
        }
        return { redirect };
    }

    private validateRequest(req: Request): Result<ValidationError>{
        return validationResult(req);
    }

    private splitAtUpperCasesAndNumbers(str: string){
        return str.split(/(?=[A-Z0-9])/).join('-');
    }
}
