import { body } from "express-validator";
import character_validator from "./regex.character.validator";
import { Request } from "express";
import { getLocalesField } from "../utils/localise";

export const formValidation = (req: Request) => {

    // character lengths for error messages and translations
    const [forty, ten, thirtyTwo]: number[] = [40, 10, 32];

    // sole place for modifying character length in both error messages and translations en/cy
    const CHARACTER_LENGTH: {[key: string]: number} = {
        premises: forty,
        addressLine1: forty,
        addressLine2: forty,
        townOrCity: forty,
        postCode: ten,
        forename: thirtyTwo,
        surname: forty
    };

    return [
        body("premises")
            .not().isEmpty({ ignore_whitespace: true })
            .withMessage(getLocalesField("enter_your_details_validation_errors.PREMISES_BLANK", req))
            .isLength({ max: CHARACTER_LENGTH.premises })
            .withMessage(getLocalesField("enter_your_details_validation_errors.PREMISES_LENGTH", req).replace("<length>", `${CHARACTER_LENGTH.premises}`))
            .matches(character_validator)
            .withMessage(getLocalesField("enter_your_details_validation_errors.PREMISES_INVALID_CHARACTER", req)),
        body("addressLine1")
            .not().isEmpty({ ignore_whitespace: true })
            .withMessage(getLocalesField("enter_your_details_validation_errors.ADDRESS_LINE_1_BLANK", req))
            .isLength({ max: CHARACTER_LENGTH.addressLine1 })
            .withMessage(getLocalesField("enter_your_details_validation_errors.ADDRESS_LINE_1_LENGTH", req).replace("<length>", `${CHARACTER_LENGTH.addressLine1}`))
            .matches(character_validator)
            .withMessage(getLocalesField("enter_your_details_validation_errors.ADDRESS_LINE_1_INVALID_CHARACTER", req)),
        body("addressLine2")
            .isLength({ max: CHARACTER_LENGTH.addressLine2 })
            .withMessage(getLocalesField("enter_your_details_validation_errors.ADDRESS_LINE_2_LENGTH", req).replace("<length>", `${CHARACTER_LENGTH.addressLine2}`))
            .matches(character_validator)
            .withMessage(getLocalesField("enter_your_details_validation_errors.ADDRESS_LINE_2_INVALID_CHARACTER", req)),
        body("townOrCity")
            .not().isEmpty({ ignore_whitespace: true })
            .withMessage(getLocalesField("enter_your_details_validation_errors.TOWN_OR_CITY_BLANK", req))
            .isLength({ max: CHARACTER_LENGTH.townOrCity })
            .withMessage(getLocalesField("enter_your_details_validation_errors.TOWN_OR_CITY_LENGTH", req).replace("<length>", `${CHARACTER_LENGTH.townOrCity}`))
            .matches(character_validator)
            .withMessage(getLocalesField("enter_your_details_validation_errors.TOWN_OR_CITY_INVALID_CHARACTER", req)),
        body("postCode")
            .not().isEmpty({ ignore_whitespace: true })
            .withMessage(getLocalesField("enter_your_details_validation_errors.POST_CODE_BLANK", req))
            .isLength({ max: CHARACTER_LENGTH.postCode })
            .withMessage(getLocalesField("enter_your_details_validation_errors.POST_CODE_LENGTH", req).replace("<length>", `${CHARACTER_LENGTH.postCode}`))
            .matches(character_validator)
            .withMessage(getLocalesField("enter_your_details_validation_errors.POST_CODE_INVALID_CHARACTER", req)),
        body("country")
            .not().isIn(["choose"])
            .withMessage(getLocalesField("enter_your_details_validation_errors.COUNTRY_BLANK", req)),
        body("forename")
            .not().isEmpty({ ignore_whitespace: true })
            .withMessage(getLocalesField("enter_your_details_validation_errors.FIRST_NAME_BLANK", req))
            .isLength({ max: CHARACTER_LENGTH.forename })
            .withMessage(getLocalesField("enter_your_details_validation_errors.FIRST_NAME_LENGTH", req).replace("<length>", `${CHARACTER_LENGTH.forename}`))
            .matches(character_validator)
            .withMessage(getLocalesField("enter_your_details_validation_errors.FIRST_NAME_INVALID_CHARACTER", req)),
        body("surname")
            .not().isEmpty({ ignore_whitespace: true })
            .withMessage(getLocalesField("enter_your_details_validation_errors.LAST_NAME_BLANK", req))
            .isLength({ max: CHARACTER_LENGTH.surname })
            .withMessage(getLocalesField("enter_your_details_validation_errors.LAST_NAME_LENGTH", req).replace("<length>", `${CHARACTER_LENGTH.surname}`))
            .matches(character_validator)
            .withMessage(getLocalesField("enter_your_details_validation_errors.LAST_NAME_INVALID_CHARACTER", req)),
    ];
};
