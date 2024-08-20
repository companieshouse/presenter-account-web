import { body } from "express-validator";
import character_validator from "./regex.character.validator";
import { Request } from "express";
import { getLocalesField } from "../utils/localise";

export const formEnterBusinessDataValidation = (req: Request) => {
    return [
        body("businessName")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(getLocalesField("enter_business_name_validation_errors.BUSINESS_NAME_BLANK", req))
            .isLength({ max: 80 }).withMessage(getLocalesField("enter_business_name_validation_errors.BUSINESS_NAME_LENGTH", req))
            .matches(character_validator).withMessage(getLocalesField("enter_business_name_validation_errors.BUSINESS_NAME_INVALID_CHARACTER", req))
    ];
};
