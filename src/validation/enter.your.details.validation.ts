import { body } from "express-validator";
import { EnterYourDetailsErrorMessages } from "../utils/error_manifests/enter.your.details.errors";
import character_validator from "./regex.character.validator";

export const formValidation = () => {
    return [
        body("premises")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(EnterYourDetailsErrorMessages.PREMISES_BLANK)
            .isLength({ max: 40 }).withMessage(EnterYourDetailsErrorMessages.PREMISES_LENGTH)
            .matches(character_validator).withMessage(EnterYourDetailsErrorMessages.PREMISES_INVALID_CHARACTER),
        body("addressLine1")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(EnterYourDetailsErrorMessages.ADDRESS_LINE_1_BLANK)
            .isLength({ max: 40 }).withMessage(EnterYourDetailsErrorMessages.ADDRESS_LINE_1_LENGTH)
            .matches(character_validator).withMessage(EnterYourDetailsErrorMessages.ADDRESS_LINE_1_INVALID_CHARACTER),
        body("addressLine2")
            .isLength({ max: 40 }).withMessage(EnterYourDetailsErrorMessages.ADDRESS_LINE_2_LENGTH)
            .matches(character_validator).withMessage(EnterYourDetailsErrorMessages.ADDRESS_LINE_2_INVALID_CHARACTER),
        body("townOrCity")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(EnterYourDetailsErrorMessages.TOWN_OR_CITY_BLANK)
            .isLength({ max: 40 }).withMessage(EnterYourDetailsErrorMessages.TOWN_OR_CITY_LENGTH)
            .matches(character_validator).withMessage(EnterYourDetailsErrorMessages.TOWN_OR_CITY_INVALID_CHARACTER),
        body("postCode")
            .not().isEmpty({ ignore_whitespace: true }).withMessage(EnterYourDetailsErrorMessages.POST_CODE_BLANK)
            .isLength({ max: 10 }).withMessage(EnterYourDetailsErrorMessages.POST_CODE_LENGTH)
            .matches(character_validator).withMessage(EnterYourDetailsErrorMessages.POST_CODE_INVALID_CHARACTER),
        body("country")
            .not().isIn(["choose"]).withMessage(EnterYourDetailsErrorMessages.COUNTRY_BLANK),
    ];
};
