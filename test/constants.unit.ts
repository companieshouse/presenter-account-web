import { selectCountryData, Countries } from "./../src/constants";

describe("Countries collection", () => {
    test('should not be listed in alphabetical order', async () => {
        const areEqual: Array<boolean> = [];
        await selectCountryData.forEach((country, index) => {
            return areEqual.push(selectCountryData[index].value === Countries()[index].value);
        });
        expect(areEqual.every(Boolean)).toBeFalsy();
    });

    test('should be listed in alphabetical order', async () => {
        const areEqual: Array<boolean> = [];
        selectCountryData.sort((a, b) => a.value.localeCompare(b.value));
        await selectCountryData.forEach((country, index) => areEqual.push(selectCountryData[index].value === Countries()[index].value));
        expect(areEqual.every(Boolean)).toBeTruthy();
    });
});

