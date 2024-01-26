import { BaseViewData, GenericHandler, Redirect, ViewModel } from "./../generic";
import { Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { Details, type Address } from "private-api-sdk-node/src/services/presenter-account/types";
import { PrefixedUrls, Countries } from "../../../constants";
import { addressToQueryString } from "./../../../utils";
import { setPresenterAccountDetails, getPresenterAccountDetails } from "./../../../utils/session";
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
            countries: [{ value: 'Select a country', text: 'Select a country', selected: true }, ...Countries()]
        };
    }

    public executeGet(req: Request, _response: Response): ViewModel<EnterYourDetailsViewData>{
        const details = getPresenterAccountDetails(req);
        logger.info(`${this.constructor.name} get execute called`);

        const viewData = this.getViewData(req);
        viewData.address = details ? details.address : viewData.address;
        return {
            templatePath: EnterYourDetailsHandler.templatePath,
            viewData
        };
    }

    public executePost(req: Request, _response: Response): Redirect | ViewModel<EnterYourDetailsViewData> {
        logger.info(`${this.constructor.name} post execute called`);

        // retrieve details using session key
        const details: Details = getPresenterAccountDetails(req);
        console.log("AAA", details);
        // adding the address field to the details obj
        const address = req.body as Address;
        details.address = address;
        // converting the address object to query strings
        const queryString = addressToQueryString(details.address);
        // generate the redirect query string
        const redirect: string = `${PrefixedUrls.CHECK_DETAILS}?${queryString}`;
        // validating the form using the req object
        const errors = this.validateRequest(req);

        if (!errors.isEmpty()){
            const viewData = this.getViewData(req);
            // if validation errors exists, get them as an array
            viewData.errors = errors.array();
            // @Todo: this line will be replaced with a nunjucks filter moving forward
            viewData.errors.map((error: { [x: string]: any; path: string; }) => error["fieldId"] = error.path.split(/(?=[A-Z0-9])/).join('-').toLocaleLowerCase());
            return {
                templatePath: EnterYourDetailsHandler.templatePath,
                viewData
            };
        }
        // set updated session object back to the session
        setPresenterAccountDetails(req, details);
        return { redirect };
    }

    private validateRequest(req: Request): Result<ValidationError>{
        return validationResult(req);
    }
}
