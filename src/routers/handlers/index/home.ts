import { Request, Response } from "express";
import { BaseViewData, GenericHandler, Redirect, ViewModel } from "./../generic";
import { logger } from "../../../utils/logger";
import { env } from "../../../config";
import { PrefixedUrls } from "../../../constants";

export class HomeHandler extends GenericHandler<BaseViewData> {
    public static templatePath = "router_views/index/home";
    private static viewName = 'home';

    public getViewData(req: Request): BaseViewData {
        const baseViewData = super.getViewData(req);

        return {
            ...baseViewData,
            title: "Apply to file with Companies House using software",
            viewName: HomeHandler.viewName,
            backURL: null,
        };
    }

    public execute (req: Request, _response: Response): ViewModel<BaseViewData> | Redirect {
        logger.info(`GET request to serve home page`);

        if (env.FEATURE_FLAG_GDS_START_PAGE_290424 === true) {
            logger.debug('GDS flag is on redirecting to the enter-your-details page');
            return { redirect: PrefixedUrls.ENTER_YOUR_DETAILS };
        }

        return {
            templatePath: HomeHandler.templatePath,
            viewData: this.getViewData(req),
        };
    }
}
