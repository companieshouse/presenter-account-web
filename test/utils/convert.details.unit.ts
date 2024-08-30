import { convertSessionDetailsToApiDetails } from "../../src/utils/convert.details";
import { PresenterSessionDetails } from "../../src/utils/session";
import { examplePresenterAccountDetails } from "../mocks/example.presenter.account.details.mock";


describe("convert details from session to api", () => {

    const apiDetails = {
        email: "example@email.com",
        userId: "123e4567-e89b-12d3-a456-426614174000",
        createdDate: "2022-01-01T00:00:00Z",
        lang: "en",
        company: {
            companyName: "...company",
            companyNumber: "NI123456"
        },
        name: {
            forename: "John",
            surname: "Doe",
        },
        address: {
            premises: "123",
            addressLine1: "Heol Las",
            addressLine2: "Trem yr Afon",
            townOrCity: "Abertawe",
            country: "Cymru",
            postCode: "SA1 1ZZ",
        }
    };

    test("if session details is a valid api details", () => {
        const sessionDetails = { ...examplePresenterAccountDetails,
            isBusinessRegistered: true, companyName: "...company", companyNumber: "NI123456"
        } as unknown as PresenterSessionDetails;
        expect(convertSessionDetailsToApiDetails(sessionDetails)).toStrictEqual(apiDetails);
    });

    test("if session details is a valid api details - business", () => {
        const sessionDetails = { ...examplePresenterAccountDetails,
            isBusinessRegistered: false, businessName: "---business", companyName: "...company", companyNumber: "NI123456"
        } as unknown as PresenterSessionDetails;
        expect(convertSessionDetailsToApiDetails(sessionDetails)).toStrictEqual(
            { ...apiDetails,
                company: {
                    companyName: "---business",
                    companyNumber: null
                }
            });
    });

    test("if session details is not a valid api details", () => {
        const sessionDetails = {
            isBusinessRegistered: false,
            email: "abc",
            userId: undefined
        } as unknown as PresenterSessionDetails;
        expect(() => {
            convertSessionDetailsToApiDetails(sessionDetails);
        }
        ).toThrow(new Error(`Presenter account address has not been set.`));
    });
}

);
