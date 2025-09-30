import { Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { BaseViewData, GenericHandler, ViewModel } from "../generic";
import { PrefixedUrls } from "../../../constants";
import { getLocalesField } from "../../../utils/localise";


export class ConfirmationHandler extends GenericHandler<BaseViewData> {
    public static templatePath = "router_views/confirmation/confirmation";


    public getViewData(req: Request): BaseViewData {
        const baseViewData = super.getViewData(req);

        return {
            ...baseViewData,
            currentUrl: PrefixedUrls.CONFIRMATION,
            title: getLocalesField("confirmation_page_title", req),
            viewName: 'confirmation',
        };
    }


    public execute (req: Request, _response: Response): ViewModel<BaseViewData> {
        logger.info(`GET request to serve the confirmation screen`);
        return {
            templatePath: ConfirmationHandler.templatePath,
            viewData: this.getViewData(req),
        };
    }
}

