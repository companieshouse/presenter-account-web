import { Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { BaseViewData, GenericHandler, ViewModel } from "../generic";
import { PrefixedUrls } from "../../../constants";

interface ConfirmationViewData extends BaseViewData {
}


export class ConfirmationHandler extends GenericHandler<ConfirmationViewData> {
    public static templatePath = "router_views/confirmation/confirmation";


    public getViewData(req: Request): ConfirmationViewData {
        const baseViewData = super.getViewData(req);

        return {
            ...baseViewData,
            currentUrl: PrefixedUrls.CONFIRMATION,
            title: "Application submitted - Apply for a Companies House online filing presenter account",
            viewName: 'confirmation',
        };
    }


    public execute (req: Request, _response: Response): ViewModel<ConfirmationViewData> {
        logger.info(`GET request to serve the confirmation screen`);
        return {
            templatePath: ConfirmationHandler.templatePath,
            viewData: this.getViewData(req),
        };
    }
}

