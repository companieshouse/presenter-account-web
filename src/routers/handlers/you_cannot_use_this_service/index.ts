import { Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { BaseViewData, GenericHandler, ViewModel } from "../generic";
import { env } from "../../../config";
import { PrefixedUrls } from "../../../constants";

/**
 * Interface for the view data when the user cannot use the service.
 * @interface YouCannotUseThisServiceViewData
 * @extends {BaseViewData}
 * @property {string} applicationFormLink - The link to the application form.
 */
interface YouCannotUseThisServiceViewData extends BaseViewData {
    applicationFormLink: string
}

/**
 * Handler for the case when the user cannot use the service.
 * @class YouCannotUseThisServiceHandler
 * @extends {GenericHandler<YouCannotUseThisServiceViewData>}
 */
export class YouCannotUseThisServiceHandler extends GenericHandler<YouCannotUseThisServiceViewData> {
    /**
     * Path to the template for the "cannot use this service" page.
     * @type {string}
     */
    public static templatePath = "router_views/cannot_use_this_service/cannot_use_this_service_page";

    /**
     * Get the view data for the "cannot use this service" page.
     * @param {Request} req - The request object.
     * @returns {YouCannotUseThisServiceViewData} - The view data for the page.
     */
    public getViewData(req: Request): YouCannotUseThisServiceViewData {
        const baseViewData = super.getViewData(req);

        return {
            ...baseViewData,
            backURL: PrefixedUrls.APPLY_TO_FILE_OPTIONS,
            title: "Apply to file with Companies House using software",
            applicationFormLink: env.APPLICATION_FORM_LINK
        };
    }

    /**
     * Handle the execution of the "cannot use this service" page.
     * @param {Request} req - The request object.
     * @param {Response} _response - The response object.
     * @returns {ViewModel<YouCannotUseThisServiceViewData>} - The view model for the page.
     */
    public execute (req: Request, _response: Response): ViewModel<YouCannotUseThisServiceViewData> {
        logger.info(`GET request for to serve home page`);
        return {
            templatePath: YouCannotUseThisServiceHandler.templatePath,
            viewData: this.getViewData(req),
        };
    }
}

