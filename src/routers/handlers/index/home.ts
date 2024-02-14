import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./../generic";
import { logger } from "../../../utils/logger";

export class HomeHandler extends GenericHandler<BaseViewData> {
    public static templatePath = "router_views/index/home";

    public getViewData(req: Request): BaseViewData {
        const baseViewData = super.getViewData(req);

        return {
            ...baseViewData,
            title: "Apply to file with Companies House using software",
            backURL: null
        };
    }

    public execute (req: Request, _response: Response): ViewModel<BaseViewData> {
        logger.info(`GET request to serve home page`);
        // ...process request here and return data for the view
        return {
            templatePath: HomeHandler.templatePath,
            viewData: this.getViewData(req),
        };
    }
}
