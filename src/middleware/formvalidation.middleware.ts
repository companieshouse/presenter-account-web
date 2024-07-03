import { ValidationError, validationResult } from "express-validator";
import { formValidation } from "../validation/enter.your.details.validation";
import { NextFunction, Request, Response } from "express";
import { EnterYourDetailsHandler } from "../routers/handlers/enter_your_details";
import { ErrorManifestValidationType } from "../utils/error_manifests/default";

export const validateForm = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const validations = formValidation(req);

        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()){
            const handler = new EnterYourDetailsHandler();
            const viewData = handler.getViewData(req);

            // Convert validation errors to an error manifest type
            viewData.errors = orderErrors(convertValidationErrorsToErrorManifestType(errors.array()));
            viewData.address = req.body;

            return res.status(200).render(EnterYourDetailsHandler.getTemplatePath(), viewData);
        }
        next();

    } catch (error){
        next(new Error(`Error in validateForm middleware: ${error}`));
    }
};

export function convertValidationErrorsToErrorManifestType(errors: ValidationError[]){
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

function orderErrors(errors: ErrorManifestValidationType){
    const order = ['premises', 'address-line-1', 'address-line-2', 'town-or-city', 'post-code', 'country'];
    const reorderErrors: ErrorManifestValidationType = {};
    order.forEach(key => {
        if (Object.prototype.hasOwnProperty.call(errors, key)){
            reorderErrors[key] = errors[key];
        }
    });
    return reorderErrors;
}
