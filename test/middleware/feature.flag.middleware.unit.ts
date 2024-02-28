import { featureFlagMiddleware } from "../../src/middleware/feature.flag.middleware";
import { Response, Request } from "express";

describe("Feature flag middleware test", () => {
    it("should render the 404 page if feature flag is off", async () => {
        process.env.FEATURE_FLAG_PRESENTER_ACCOUNT_280224 = "false";

        const res = mockres();

        featureFlagMiddleware({} as unknown as Request,res,()=>{});

        expect(res.render).toHaveBeenCalledWith("partials/error_404");
    });
});

function mockres(){
    return {
     render:jest.fn()
    } as unknown as Response;
    
}