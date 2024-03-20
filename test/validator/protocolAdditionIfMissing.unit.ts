import { removeProtocolIfPresent } from "../../src/config/validator";


describe("protocol handler for CDN_HOST", () => {
    it('should reeturn url unchanged if protocol present', () => {
        const url1 = "http://google.com";
        const url2 = "https://frodo.fr";

        expect(removeProtocolIfPresent(url1)).toBe(url1.substring(7));
        expect(removeProtocolIfPresent(url2)).toBe(url2.substring(8));
    });

    it('should add missing protocol', () => {
        const url1 = 'google.com';
        const url2 = 'frodo.fr';

        expect(removeProtocolIfPresent(url1)).toBe(url1);
        expect(removeProtocolIfPresent(url2)).toBe(url2);
    });

    it('should remove protocol relative url if present', () => {
        const url1 = '//google.com';
        const url2 = '//frodo.fr';

        expect(removeProtocolIfPresent(url1)).toBe(url1.substring(2));
        expect(removeProtocolIfPresent(url2)).toBe(url2.substring(2));
    });
});
