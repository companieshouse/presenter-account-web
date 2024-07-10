import { Details } from "private-api-sdk-node/src/services/presenter-account/types";

export const examplePresenterAccountDetails: Details = {
    email: "example@email.com",
    userId: "123e4567-e89b-12d3-a456-426614174000",
    createdDate: "2022-01-01T00:00:00Z",
    name: {
        forename: "John",
        surname: "Doe"
    },
    address: {
        premises: "123",
        addressLine1: "Heol Las",
        addressLine2: "Trem yr Afon",
        townOrCity: "Abertawe",
        country: "Cymru",
        postCode: "SA1 1ZZ"
    },
    lang: "en"
};
