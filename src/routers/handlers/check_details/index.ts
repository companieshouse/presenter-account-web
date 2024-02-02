import { Request, Response } from "express";
import {
    BaseViewData,
    GenericHandler,
    Redirect,
    ViewModel,
} from "./../generic";
import { logger } from "../../../utils/logger";
import { type Address } from "private-api-sdk-node/src/services/presenter-account/types";
import { getPresenterAccountDetails } from "../../../utils/session";
import { PrefixedUrls } from "../../../constants";
import { createOauthPrivateApiClient } from "../../../service/api.client.service";
import { Result, failure } from "@companieshouse/api-sdk-node/dist/services/result";

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
        };
    }

    public executeGet(
        req: Request,
        _response: Response
    ): ViewModel<CheckDetailsViewData> {
        logger.info(`CheckDetailsHandler execute called`);
        const viewData = this.getViewData(req);

        return {
            templatePath: CheckDetailsHandler.templatePath,
            viewData
        };
    }

    private async submitDetails(req: Request): Promise<Result<void, Error>> {
        try {
            const details = getPresenterAccountDetails(req);

            if (details === undefined) {
                throw new Error("Presenter account details not found in session.");
            }

            const apiClient = createOauthPrivateApiClient(req);
            return await apiClient.presenterAccountService.submitPresenterAccountDetails(details);
        } catch (e: any) {
            const errorMessage = e.message ?? `${e}`;
            return failure(new Error(`Error submitting the presenter account details: ${errorMessage}`));
        }
    }

    public async executePost(
        req: Request,
        _response: Response
    ): Promise<Redirect | Error> {
        logger.info(`CheckDetailsHandler executePost called`);

        const submitResult = await this.submitDetails(req);
        if (submitResult.isFailure()) {
            const errorMessage = `Error submitting details to the presenter-account-api: ${submitResult.value.message}`;
            logger.error(errorMessage);
            return new Error(errorMessage);
        }

        return {
            redirect: PrefixedUrls.CONFIRMATION
        };
    }
}
