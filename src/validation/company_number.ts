const COMPANY_NUMBER_FORMAT = /^(?:SC|NI|OE|FC|NF|[0-9]{2})[0-9]{6}$/;

export function isValidCompanyNumber(o: any): boolean {
    return typeof o === "string" && o.length > 0 && COMPANY_NUMBER_FORMAT.test(o);
}