import { convertSessionDetailsToApiDetails } from "../../src/utils/convert.details"
import { PresenterSessionDetails } from "../../src/utils/session";


describe("convert details from session to api", () => {

    test("if session details is not a valid api details", () => {
        const sessionDetails = {
            isBusinessRegistered: false,
            email: "abc",
            userId: undefined
        } as unknown as PresenterSessionDetails
        expect(() => {
            convertSessionDetailsToApiDetails(sessionDetails)}
        ).toThrow(new Error(`Presenter Account Session Details to Presenter Account API Details failed`));
    })
}

)