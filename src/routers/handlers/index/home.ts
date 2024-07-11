import { Request, Response } from "express";
import { BaseViewData, GenericHandler, Redirect, ViewModel } from "./../generic";
import { logger } from "../../../utils/logger";
import { env } from "../../../config";
import { PrefixedUrls } from "../../../constants";
import { addLangToUrl, selectLang } from "../../../utils/localise";

export class HomeHandler extends GenericHandler<BaseViewData> {
    public static templatePath = "router_views/index/home";

    public getViewData(req: Request): BaseViewData {
        const baseViewData = super.getViewData(req);

        return {
            ...baseViewData,
            title: "Apply to file with Companies House using software",
            currentUrl: PrefixedUrls.HOME,
            viewName: 'home',
            backURL: null,
        };
    }

    public execute (req: Request, _response: Response): ViewModel<BaseViewData> | Redirect {
        logger.info(`GET request to serve home page`);

        if (env.FEATURE_FLAG_GDS_START_PAGE_290424 === true) {
            logger.debug('GDS flag is on redirecting to the enter-your-details page');
            const redirectURL = addLangToUrl(PrefixedUrls.ENTER_YOUR_DETAILS, selectLang(req.query.lang));
            return { redirect: redirectURL };
        }

        return {
            templatePath: HomeHandler.templatePath,
            viewData: this.getViewData(req),
        };
    }
}
