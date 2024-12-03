import { isValidCompanyNumber } from "../../src/validation/company_number";


describe("validation company number", () => {

    const NUMBER = "12345678";
    const SC = "SC123456";
    const NI = "NI123456";
    const OE = "OE123456";
    const FC = "FC123456";
    const NF = "NF123456";
    const OC = "OC123456";
    const SO = "SO123456";
    const NC = "NC123456";

    const NON_MATCH = "QU123456";

    it("should allow company number starting with SC", () => {
        expect(isValidCompanyNumber(SC)).toBe(true);
    });
    it("should allow company number starting with NI", () => {
        expect(isValidCompanyNumber(NI)).toBe(true);
    });
    it("should allow company number starting with OE", () => {
        expect(isValidCompanyNumber(OE)).toBe(true);
    });
    it("should allow company number starting with FC", () => {
        expect(isValidCompanyNumber(FC)).toBe(true);
    });
    it("should allow company number starting with NF", () => {
        expect(isValidCompanyNumber(NF)).toBe(true);
    });
    it("should allow company number starting with OC", () => {
        expect(isValidCompanyNumber(OC)).toBe(true);
    });
    it("should allow company number starting with SO", () => {
        expect(isValidCompanyNumber(SO)).toBe(true);
    });
    it("should allow company number starting with NC", () => {
        expect(isValidCompanyNumber(NC)).toBe(true);
    });
    it("should allow company number starting with NUMBERS", () => {
        expect(isValidCompanyNumber(NUMBER)).toBe(true);
    });
    it("should disallow company number starting with invalid start", () => {
        expect(isValidCompanyNumber(NON_MATCH)).toBe(false);
    });
});
