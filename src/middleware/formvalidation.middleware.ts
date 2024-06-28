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
            viewData.errors = convertValidationErrorsToErrorManifestType(errors.array());
            viewData.address = req.body;

            return res.status(200).render(EnterYourDetailsHandler.templatePath, viewData);
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
