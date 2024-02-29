import { Response, Request } from "express";

describe("Feature flag middleware test", () => {

    it("should render the 404 page if feature flag is off", async () => {

        process.env.FEATURE_FLAG_PRESENTER_ACCOUNT_280224 = "false";

        const { featureFlagMiddleware } = await import("../../src/middleware/feature.flag.middleware");

        const res = mockResponse();
        const next = jest.fn();

        featureFlagMiddleware(mockRequest(), res, next);

        expect(res.render).toHaveBeenCalledWith("partials/error_404");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should call the next function if feature flag is on", async () => {

        process.env.FEATURE_FLAG_PRESENTER_ACCOUNT_280224 = "true";

        const { featureFlagMiddleware } = await import("../../src/middleware/feature.flag.middleware");

        const res = mockResponse();
        const next = jest.fn();

        featureFlagMiddleware(mockRequest(), res, next);

        expect(res.render).toHaveBeenCalledTimes(0);
        expect(next).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
        jest.resetModules();
    });
});

function mockResponse() {
    return {
        render:jest.fn()
    } as unknown as Response;
}

function mockRequest() {
    return {} as unknown as Request;
}