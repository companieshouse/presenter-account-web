import { BaseViewData, GenericHandler, Redirect, ViewModel } from "./../generic";
import { Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { type Address } from "private-api-sdk-node/src/services/presenter-account/types";
import { PrefixedUrls, countries } from "../../../constants";
import { setPresenterAccountDetails, getPresenterAccountDetailsOrDefault } from "./../../../utils/session";
import { ValidationError, validationResult } from "express-validator";
import { ErrorManifestValidationType } from "utils/error_manifests/default";
import { isAddress } from "private-api-sdk-node/dist/services/presenter-account/types";

interface EnterYourDetailsViewData extends BaseViewData{
    address: Address ;
    countries: Array<{value: string, text: string, selected?: boolean}>;
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
        const countriesWithChoose = [ { value: "choose", text: "Choose Country", selected: true }, ...countries ];
        return {
            ...baseViewData,
            title: this.title,
            backURL: PrefixedUrls.HOME,
            countries: countriesWithChoose
        };
    }

    public executeGet(req: Request, _response: Response): ViewModel<EnterYourDetailsViewData>{
        logger.info(`${this.constructor.name} get execute called`);

        const details = getPresenterAccountDetailsOrDefault(req);

        const viewData = this.getViewData(req);
        viewData.address = details.address;

        return {
            templatePath: EnterYourDetailsHandler.templatePath,
            viewData
        };
    }

    public executePost(req: Request, _response: Response): ViewModel<EnterYourDetailsViewData> | Redirect {
        logger.info(`${this.constructor.name} post execute called`);
        // validating the form using the req object
        const errors = validationResult(req);

        if (!errors.isEmpty()){
            const viewData = this.getViewData(req);
            // if validation errors exists, get them as an array
            viewData.errors = this.convertValidationErrorsToErrorManifestType(errors.array());
            viewData.address = req.body;
            return {
                templatePath: EnterYourDetailsHandler.templatePath,
                viewData
            };
        }
        const details =  getPresenterAccountDetailsOrDefault(req);

        const address = { ...req.body };
        if (isAddress(address)){
            details.address = address;
        } else {
            throw new Error("Incorrect Address format set for presenter account details");
        }

        setPresenterAccountDetails(req, details);
        return { redirect: PrefixedUrls.CHECK_DETAILS };
    }

    private convertValidationErrorsToErrorManifestType(errors: ValidationError[]){
        const errorManifest: ErrorManifestValidationType = {};
        errors.forEach((error) => {
            // use element id as key
            if (error.type === 'field') {
                const key = error.path.split(/(?=[A-Z0-9])/).join('-').toLocaleLowerCase();
                errorManifest[key] = {
                    inline: error.msg,
                    summary: error.msg
                };
            }
        });
        return errorManifest;
    }
}
