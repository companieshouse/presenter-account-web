import { convertSessionDetailsToApiDetails } from "../../src/utils/convert.details";
import { PresenterSessionDetails } from "../../src/utils/session";
import { examplePresenterAccountDetails } from "../mocks/example.presenter.account.details.mock";


describe("convert details from session to api", () => {

    test("if session details is a valid api details", () => {
        const sessionDetails = {...examplePresenterAccountDetails, isBusinessRequired: true
        } as unknown as PresenterSessionDetails;
        expect(convertSessionDetailsToApiDetails(sessionDetails)).toStrictEqual(examplePresenterAccountDetails);
    })

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
