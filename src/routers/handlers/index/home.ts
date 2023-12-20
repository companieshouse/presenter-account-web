import { Request, Response } from "express";
import { GenericHandler, HomeViewData, ViewModel, defaultBaseViewData } from "./../generic";
import { logger } from "../../../utils/logger";

const title = "Home handler for index router";
const backURL = null;
const routeViews = "router_views/index/home";

const homeDefaultViewData: ViewModel<HomeViewData> = {
    templatePath: routeViews,
    viewData: {
        title,
        backURL }
};

export class HomeHandler extends GenericHandler {
    constructor () {
        super({
            ...defaultBaseViewData,
            ...homeDefaultViewData.viewData
        });
    }

    public execute (_req: Request, _response: Response): ViewModel<HomeViewData> {
        logger.info(`GET request for to serve home page`);
        // ...process request here and return data for the view
        return homeDefaultViewData;
    }
}
