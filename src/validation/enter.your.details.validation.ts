import { body } from "express-validator";
import { EnterYourDetailsErrorMessages } from "../utils/error_manifests/enter.your.details.errors";
import { countries } from "../constants";

export const blankFieldValidations = () => {
    return [
        body("premises")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(EnterYourDetailsErrorMessages.PREMISES_BLANK),
        body("addressLine1")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(EnterYourDetailsErrorMessages.ADDRESS_LINE_1_BLANK),
        body("townOrCity")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(EnterYourDetailsErrorMessages.TOWN_OR_CITY_BLANK),
        body("postCode")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(EnterYourDetailsErrorMessages.POST_CODE_BLANK),
        body("country")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(EnterYourDetailsErrorMessages.COUNTRY_BLANK)
            .isIn(countries).withMessage(EnterYourDetailsErrorMessages.COUNTRY_BLANK),
    ];
};
