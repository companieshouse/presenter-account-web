export enum EnterYourDetailsErrorMessages {
    // Blank Error Messages
    PREMISES_BLANK = "Property name or number is required",
    ADDRESS_LINE_1_BLANK = "Address line 1 is required",
    TOWN_OR_CITY_BLANK = "Town or city is required",
    POST_CODE_BLANK = "Postcode is required",
    COUNTRY_BLANK = "Please select a country",

    // Length Error Messages
    PREMISES_LENGTH = "Property name or number must be 40 characters or less",
    ADDRESS_LINE_1_LENGTH = "Address line 1 must be 40 characters or less",
    ADDRESS_LINE_2_LENGTH = "Address line 2 must be 40 characters or less",
    TOWN_OR_CITY_LENGTH = "City or town must be 40 characters or less",
    POST_CODE_LENGTH = "Postcode/zip code must be 10 characters or less",

    // Invalid Character
    PREMISES_INVALID_CHARACTER = "Property name or number must have only valid characters",
    ADDRESS_LINE_1_INVALID_CHARACTER = "Address line 1 must have only valid characters",
    ADDRESS_LINE_2_INVALID_CHARACTER = "Address line 2 must have only valid characters",
    TOWN_OR_CITY_INVALID_CHARACTER = "Town or city must have only valid characters",
    POST_CODE_INVALID_CHARACTER = "Postcode must have only valid characters"
}
