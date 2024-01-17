import { Request, Response } from "express";
import {
    BaseViewData,
    GenericHandler,
    ViewModel,
} from "./../generic";
import { logger } from "../../../utils/logger";
import { type Address } from "private-api-sdk-node/src/services/presenter-account/types";
import { getPresenterAccountDetails } from "../../../utils/session";
import { PrefixedUrls } from "../../../constants";

interface CheckDetailsViewData extends BaseViewData {
    address: Address;
}

export class CheckDetailsHandler extends GenericHandler<CheckDetailsViewData> {
    private static templatePath = "router_views/check_details/check_details";

    public getViewData(req: Request): CheckDetailsViewData {
        const baseViewData = super.getViewData(req);

        const details = getPresenterAccountDetails(req);
        if (details === undefined) {
            throw new Error("Presenter account details not found in session.");
        }

        return {
            ...baseViewData,
            title: "Application submitted - Apply for a Companies House online filing presenter account - GOV.UK",
            backURL: PrefixedUrls.ENTER_YOUR_DETAILS,
            address: details.address 
        }
    }

    public execute(
        req: Request,
        _response: Response
    ): ViewModel<CheckDetailsViewData> {
        logger.info(`GET request for to serve check details page`);

        const viewData = this.getViewData(req);

        return {
            templatePath: CheckDetailsHandler.templatePath,
            viewData
        };
    }
}
