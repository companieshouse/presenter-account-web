import { Request, Response } from "express";
import {
    BaseViewData,
    GenericHandler,
    Redirect,
    ViewModel,
} from "./../generic";
import { logger } from "../../../utils/logger";
import { getPresenterAccountDetails, cleanSession } from "../../../utils/session";
import { PrefixedUrls } from "../../../constants";
import { createOauthPrivateApiClient } from "../../../service/api.client.service";
import { Result, failure } from "@companieshouse/api-sdk-node/dist/services/result";
import { getLocalesField } from "../../../utils/localise";
import { convertSessionDetailsToApiDetails } from "../../../utils/convert.details";
import { type Address } from "private-api-sdk-node/dist/services/presenter-account/types";

interface CheckDetailsViewData extends BaseViewData {
    address: Address;
    businessName?: string;
    companyName?: string;
    isBusinessRegistered: boolean;
    contactName: {
        forename: string;
        surname: string;
    };
}

export class CheckDetailsHandler extends GenericHandler<CheckDetailsViewData> {
    private static templatePath = "router_views/check_details/check_details";

    public getViewData(req: Request): CheckDetailsViewData {
        const baseViewData = super.getViewData(req);

        const details = getPresenterAccountDetails(req);
        if (details === undefined) {
            throw new Error("Presenter account details not found in session.");
        }

        if (details.address === undefined) {
            throw new Error("Presenter account address has not been set.");
        }

        if (details.isBusinessRegistered === undefined) {
            throw new Error("Presenter account is business registered has not been set.");
        }

        if (details.name === undefined || details.name.forename === null || details.name.surname === null) {
            throw new Error("Presenter account name/forename/surname has not been set.");
        }


        // if isBusinessRegistered is true; company name need to be set
        if (details.companyName === undefined && details.isBusinessRegistered) {
            throw new Error("Presenter account company name has not been set for a registered business.");
        }

        // if isBusinessRegistered is false; business name need to be set
        if (details.businessName === undefined && !details.isBusinessRegistered) {
            throw new Error("Presenter account business name has not been set for a registered business.");
        }


        return {
            ...baseViewData,
            title: getLocalesField("check_your_answers_page_title", req),
            currentUrl: PrefixedUrls.CHECK_DETAILS,
            backURL: PrefixedUrls.ENTER_YOUR_DETAILS,
            address: details.address,
            companyName: details.companyName,
            businessName: details.businessName,
            isBusinessRegistered: details.isBusinessRegistered,
            contactName: {
                forename: details.name!.forename,
                surname: details.name!.surname
            },
            viewName: 'check your details',
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
            const apiDetails = convertSessionDetailsToApiDetails(details);
            return await apiClient.presenterAccountService.submitPresenterAccountDetails(apiDetails);
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
        } else {
            // On successful submission, clean up the session
            cleanSession(req);
        }

        return {
            redirect: PrefixedUrls.CONFIRMATION
        };
    }
}
