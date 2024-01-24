import { body } from "express-validator";
import { EnterYourDetailsErrorMessages } from "../utils/error_manifests/enter.your.details.errors";
import { Address } from "private-api-sdk-node/src/services/presenter-account/types";

const BlankValidator = {
    premises: EnterYourDetailsErrorMessages.PREMISES_BLANK,
    addressLine1: EnterYourDetailsErrorMessages.ADDRESS_LINE_1_BLANK,
    townOrCity: EnterYourDetailsErrorMessages.TOWN_OR_CITY_BLANK,
    postCode: EnterYourDetailsErrorMessages.POST_CODE_BLANK,
    country: EnterYourDetailsErrorMessages.COUNTRY_BLANK
};

export const blank_field_validations = (errors: Address = BlankValidator) => {
    return [
        body("premises")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(errors.premises),
        body("address_line_1")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(errors.addressLine1),
        body("town_or_city")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(errors.townOrCity),
        body("post_code")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(errors.postCode),
        body("country")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(errors.country)
    ];
};
