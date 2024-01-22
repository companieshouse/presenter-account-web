import { Request, Response } from "express";
import { BaseViewData, GenericHandler, Redirect, ViewModel } from "./../generic";
import { logger } from "../../../utils/logger";
import { PrefixedUrls } from "../../../constants";
import { env } from "../../../config";

/**
 * Interface for the view data options when applying to a file.
 * @interface ApplyToFileOptionsViewData
 * @extends {BaseViewData}
 * @property {string} applyToRegisterAsLenderLink - The link to apply to register as a lender.
 * @property {string} filingFeeFieldName - The field name for the filing fee.
 * @property {typeof FilingFeeOptions} FilingFeeOptions - The options for filing fee.
 */
interface ApplyToFileOptionsViewData extends BaseViewData {
    applyToRegisterAsLenderLink: string
    filingFeeFieldName: string
    FilingFeeOptions: typeof FilingFeeOptions
    radioNotSelected: boolean
}

/**
 * The field name for the filing fee.
 * @type {string}
 */
export const filingFeeFieldName = 'filingFee';

/**
 * The options for filing fee.
 * @type {Object}
 * @property {string} NO - Option for no filing fee.
 * @property {string} YES - Option for filing fee.
 */
export const FilingFeeOptions = {
    NO: 'no',
    YES: 'yes'
};


/**
 * Handler for applying to file options.
 * @class ApplyToFileOptionsHandler
 * @extends {GenericHandler<ApplyToFileOptionsViewData>}
 */
export class ApplyToFileOptionsHandler extends GenericHandler<ApplyToFileOptionsViewData> {
    /**
     * Path to the template for the apply to file options page.
     * @type {string}
     */
    public static templatePath = "router_views/apply_to_file_options/apply_to_file_options_page";

    /**
     * Get the view data for the apply to file options page.
     * @param {Request} req - The request object.
     * @returns {ApplyToFileOptionsViewData} - The view data for the page.
     */
    public getViewData(req: Request): ApplyToFileOptionsViewData {
        const baseViewData = super.getViewData(req);

        return {
            ...baseViewData,
            backURL: PrefixedUrls.HOME,
            title: "Apply to file with Companies House using software",
            applyToRegisterAsLenderLink: env.APPLICATION_FORM_LINK,
            filingFeeFieldName,
            FilingFeeOptions: FilingFeeOptions,
            radioNotSelected: false
        };
    }

    /**
     * Handle GET request to serve the apply to file options page.
     * @param {Request} req - The request object.
     * @param {Response} _res - The response object.
     * @returns {ViewModel<BaseViewData>} - The view model for the page.
     */
    public executeGet(req: Request, _res: Response): ViewModel<ApplyToFileOptionsViewData> {
        logger.info("GET request to serve the 'apply to file options page'");
        return {
            templatePath: ApplyToFileOptionsHandler.templatePath,
            viewData: this.getViewData(req),
        };
    }

    /**
     * Handle POST request to serve the apply to file options page.
     * @param {Request} req - The request object.
     * @param {Response} _res - The response object.
     * @returns {Redirect} - The redirect object.
     */
    public executePost(req: Request, _res: Response): Redirect | ViewModel<ApplyToFileOptionsViewData> {
        logger.info("POST request to serve the 'apply to file options page'");

        const filingFeeResponse = req.body[filingFeeFieldName] as string;

        switch (filingFeeResponse) {
                case FilingFeeOptions.NO:
                    logger.debug(`User selected '${FilingFeeOptions.NO}' on the 'what-do-you-need-to-file' page.`);
                    return { redirect: PrefixedUrls.ENTER_YOUR_DETAILS };
                case FilingFeeOptions.YES:
                    logger.debug(`User selected '${FilingFeeOptions.NO}' on the 'what-do-you-need-to-file' page.`);
                    return { redirect: PrefixedUrls.YOU_CANNOT_USE_THIS_SERVICE };
                default:
                    logger.debug(`User did not select a valid option. Showing error message.`);
                    
                    const viewData = this.getViewData(req);
                    viewData.radioNotSelected = true;

                    return {
                        templatePath: ApplyToFileOptionsHandler.templatePath,
                        viewData: viewData,
                    };
        }
    }
}

