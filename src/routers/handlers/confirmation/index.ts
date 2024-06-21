import { Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { BaseViewData, GenericHandler, ViewModel } from "../generic";

interface ConfirmationViewData extends BaseViewData {
}


export class ConfirmationHandler extends GenericHandler<ConfirmationViewData> {
    public static templatePath = "router_views/confirmation/confirmation";
    private static viewName = 'confirmation';


    public getViewData(req: Request): ConfirmationViewData {
        const baseViewData = super.getViewData(req);

        return {
            ...baseViewData,
            title: "Application submitted - Apply for a Companies House online filing presenter account",
            viewName: ConfirmationHandler.viewName
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

