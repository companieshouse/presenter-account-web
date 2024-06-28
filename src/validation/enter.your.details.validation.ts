import { body } from "express-validator";
import character_validator from "./regex.character.validator";
import { Request } from "express";
import { getLocalesField } from "../utils/getLocalesField";

export const formValidation = (req: Request) => {
    return [
        body("premises")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(getLocalesField("enter_your_details_validation_errors.PREMISES_BLANK", req))
            .isLength({ max: 40 }).withMessage(getLocalesField("enter_your_details_validation_errors.PREMISES_LENGTH", req))
            .matches(character_validator).withMessage(getLocalesField("enter_your_details_validation_errors.PREMISES_INVALID_CHARACTER", req)),
        body("addressLine1")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(getLocalesField("enter_your_details_validation_errors.ADDRESS_LINE_1_BLANK", req))
            .isLength({ max: 40 }).withMessage(getLocalesField("enter_your_details_validation_errors.ADDRESS_LINE_1_LENGTH", req))
            .matches(character_validator).withMessage(getLocalesField("enter_your_details_validation_errors.ADDRESS_LINE_1_INVALID_CHARACTER", req)),
        body("addressLine2")
            .isLength({ max: 40 }).withMessage(getLocalesField("enter_your_details_validation_errors.ADDRESS_LINE_2_LENGTH", req))
            .matches(character_validator).withMessage(getLocalesField("enter_your_details_validation_errors.ADDRESS_LINE_2_INVALID_CHARACTER", req)),
        body("townOrCity")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(getLocalesField("enter_your_details_validation_errors.TOWN_OR_CITY_BLANK", req))
            .isLength({ max: 40 }).withMessage(getLocalesField("enter_your_details_validation_errors.TOWN_OR_CITY_LENGTH", req))
            .matches(character_validator).withMessage(getLocalesField("enter_your_details_validation_errors.TOWN_OR_CITY_INVALID_CHARACTER", req)),
        body("postCode")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(getLocalesField("enter_your_details_validation_errors.POST_CODE_BLANK", req))
            .isLength({ max: 10 }).withMessage(getLocalesField("enter_your_details_validation_errors.POST_CODE_LENGTH", req))
            .matches(character_validator).withMessage(getLocalesField("enter_your_details_validation_errors.POST_CODE_INVALID_CHARACTER", req)),
        body("country")
            .not().isIn(["choose"]).withMessage(getLocalesField("enter_your_details_validation_errors.COUNTRY_BLANK", req)),
    ];
};
