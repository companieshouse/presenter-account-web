import { Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { BaseViewData, GenericHandler, ViewModel } from "../generic";
import { PrefixedUrls } from "../../../constants";

interface ErrorSubmittingViewData extends BaseViewData {
}


export class ErrorSubmittingHandler extends GenericHandler<ErrorSubmittingViewData> {
    public static templatePath = "router_views/error_submitting/error_submitting";


    public getViewData(req: Request): ErrorSubmittingViewData {
        const baseViewData = super.getViewData(req);

        return {
            ...baseViewData,
            backURL: null,
            title: "Error submitting application with Companies House using software"
        };
    }


    public execute (req: Request, _response: Response): ViewModel<ErrorSubmittingViewData> {
        logger.info(`GET request to serve the error submitting screen`);
        return {
            templatePath: ErrorSubmittingHandler.templatePath,
            viewData: this.getViewData(req),
        };
    }
}
