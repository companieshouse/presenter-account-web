import { BaseViewData, GenericHandler, Redirect, ViewModel } from "./../generic";
import { Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { Details, type Address, isDetails, isAddress } from "private-api-sdk-node/src/services/presenter-account/types";
import { PrefixedUrls, Countries } from "../../../constants";
import { addressToQueryString } from "./../../../utils";
import { setPresenterAccountDetails, getPresenterAccountDetails } from "./../../../utils/session";
import { Result, ValidationError, validationResult } from "express-validator";

interface CountryType {
    value: string,
    text: string,
    selected?: boolean
}

interface EnterYourDetailsViewData extends BaseViewData{
    address: Address ;
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
        const details = getPresenterAccountDetails(req);

        return {
            ...baseViewData,
            title: this.title,
            backURL: PrefixedUrls.APPLY_TO_FILE_OPTIONS,
            address: isDetails(details) ? details.address : {} as Address,
            countries: [{ value: 'Select a country', text: 'Select a country', selected: true }, ...Countries()]
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
        const retrieveDetails = getPresenterAccountDetails(req);
        // retrieve details using session key
        const details: Details = isDetails(retrieveDetails) ? retrieveDetails : {} as Details;
        // adding the address field to the details obj
        const address = isAddress(req.body as Address) ? req.body as Address : {} as Address;
        details.address = address;
        // generate the redirect query string
        const redirect: string = `${PrefixedUrls.CHECK_DETAILS}`;
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
