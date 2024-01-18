import { Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { BaseViewData, GenericHandler, ViewModel } from "../generic";
import { env } from "../../../config";
import { PrefixedUrls } from "../../../constants";


interface ConfirmationViewData extends BaseViewData {
}


export class ConfirmationHandler extends GenericHandler<ConfirmationViewData> {
    public static templatePath = "router_views/confirmation/confirmation";


    public getViewData(req: Request): ConfirmationViewData {
        const baseViewData = super.getViewData(req);

        return {
            ...baseViewData,
            backURL: PrefixedUrls.APPLY_TO_FILE_OPTIONS,
            title: "Apply to file with Companies House using software"
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

