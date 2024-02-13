import { body } from "express-validator";
import { EnterYourDetailsErrorMessages } from "../utils/error_manifests/enter.your.details.errors";

export const formValidation = () => {
    return [
        body("premises")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(EnterYourDetailsErrorMessages.PREMISES_BLANK)
            .isLength({ max: 40 }).withMessage(EnterYourDetailsErrorMessages.PREMISES_LENGTH),
        body("addressLine1")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(EnterYourDetailsErrorMessages.ADDRESS_LINE_1_BLANK)
            .isLength({ max: 40 }).withMessage(EnterYourDetailsErrorMessages.ADDRESS_LINE_1_LENGTH),
        body("addressLine2")
            .isLength({ max: 40 }).withMessage(EnterYourDetailsErrorMessages.ADDRESS_LINE_2_LENGTH),
        body("townOrCity")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(EnterYourDetailsErrorMessages.TOWN_OR_CITY_BLANK)
            .isLength({ max: 40 }).withMessage(EnterYourDetailsErrorMessages.TOWN_OR_CITY_LENGTH),
        body("postCode")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(EnterYourDetailsErrorMessages.POST_CODE_BLANK)
            .isLength({ max: 10 }).withMessage(EnterYourDetailsErrorMessages.POST_CODE_LENGTH),
        body("country")
            .not().isIn(["choose"]).withMessage(EnterYourDetailsErrorMessages.COUNTRY_BLANK),
    ];
};
