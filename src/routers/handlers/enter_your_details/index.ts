import { BaseViewData, GenericHandler, Redirect, ViewModel } from "./../generic";
import { Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { type Address } from "private-api-sdk-node/src/services/presenter-account/types";
import { PrefixedUrls, Countries } from "../../../constants";
import { setPresenterAccountDetails, getPresenterAccountDetails, generateUserDetails } from "./../../../utils/session";
import { FieldValidationError, Result, ValidationError, validationResult } from "express-validator";

interface CountryType {
    value: string,
    text: string,
    selected?: boolean
}

interface ErrorManifest {
    [key: string]: any
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
        // retrieve details using session key
        const details = getPresenterAccountDetails(req);

        return {
            ...baseViewData,
            title: this.title,
            backURL: PrefixedUrls.APPLY_TO_FILE_OPTIONS,
            address: details?.address || req.body?.address,
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

    public executePost(req: Request, _response: Response): ViewModel<EnterYourDetailsViewData> | Redirect {
        logger.info(`${this.constructor.name} post execute called`);
        const viewData = this.getViewData(req);
        // generate the redirect query string
        const redirect: string = `${PrefixedUrls.CHECK_DETAILS}`;
        // validating the form using the req object
        const errors = this.validateRequest(req);

        if (!errors.isEmpty()){
            // if validation errors exists, get them as an array
            viewData.errors = this.convertValidationErrorsToErrorManifestType(errors.array());
            return {
                templatePath: EnterYourDetailsHandler.templatePath,
                viewData
            };
        }

        const details =  generateUserDetails(req);

        setPresenterAccountDetails(req, details);

        return { redirect };
    }

    private validateRequest(req: Request): Result<ValidationError>{
        return validationResult(req);
    }

    private convertValidationErrorsToErrorManifestType(errors: any){
        const errorManifest: ErrorManifest = {};
        errors.map((error: FieldValidationError) => {
            // use element id as key
            const key = error.path;
            errorManifest[key] = {};
            errorManifest[key].fileId = key.split(/(?=[A-Z0-9])/).join('-').toLocaleLowerCase();
            errorManifest[key].summary = error.msg;
        });
        return errorManifest;
    }
}
