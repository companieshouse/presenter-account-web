import { logger } from "../../../utils/logger";
import { PrefixedUrls, QueryParameters } from "../../../constants";
import { addLangToUrl, getLanguageChoice, getLocalesField } from "../../../utils/localise";
import { BaseViewData, GenericHandler, Redirect, ViewModel } from "../generic";
import { Request, Response } from "express";
import { isValidCompanyNumber } from "../../../validation/company_number";
import { CompanyProfileService } from "../../../service/company.profile.service";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { getPresenterAccountDetails, setPresenterAccountDetails } from "../../../utils/session";

interface ConfirmCompanyViewData extends BaseViewData {
    companyNumber: string
    status: string
    incorporatedOn: string
    companyName: string,
    language?: string
}

export class ConfirmCompanyHandler extends GenericHandler<ConfirmCompanyViewData> {
    public static templatePath = "router_views/confirm_company/confirm_company";

    public getViewData(req: Request): ConfirmCompanyViewData {
        const baseViewData = super.getViewData(req);

        const languageChoice = getLanguageChoice(req)

        const currentUrl = addLangToUrl(this.appendCompanyNumberQuery(PrefixedUrls.CONFIRM_COMPANY, req), languageChoice);

        return {
            ...baseViewData,
            currentUrl,
            title: getLocalesField("confirm_company_title", req),
            viewName: 'confirm_company',
            backURL: PrefixedUrls.COMPANY_SEARCH,
            language: languageChoice
        };
    }

    public async executeGet(req: Request, _res: Response): Promise<ViewModel<ConfirmCompanyViewData>> {
        const companyNumber = this.getCompanyNumberFromRequest(req);

        const { companyStatus: status, dateOfCreation: incorporatedOn, companyName } = await this.getCompanyProfile(req, companyNumber);

        const viewData = {
            ...this.getViewData(req),
            companyNumber,
            status,
            incorporatedOn,
            companyName
        };

        return {
            templatePath: ConfirmCompanyHandler.templatePath,
            viewData,
        };
    }

    /**
     * Retrieves the company profile for a given company number.
     *
     * @param {Request} req - The Express request object.
     * @param {string} companyNumber - The unique identifier for the company.
     * @returns {Promise<CompanyProfile>} A promise that resolves to the company profile.
     * @throws {Error} If the company profile retrieval fails.
     */
    private async getCompanyProfile(req: Request, companyNumber: string): Promise<CompanyProfile> {
        const companyProfileService = CompanyProfileService.fromRequest(req);
        const companyProfileResult = await companyProfileService.getCompanyProfile(companyNumber);
        if (companyProfileResult.isFailure()) {
            logger.error(`Failed to get company profile for company number "${companyNumber}"`);
            throw new Error("Failed to get company profile");
        }
        return companyProfileResult.value;
    }


    /**
     * Extracts and validates the company number from the request parameters.
     *
     * @param {Request} req - The Express request object containing the company number parameter.
     * @returns {string} The validated company number.
     * @throws {Error} If the company number is invalid.
     */
    private getCompanyNumberFromRequest(req: Request) {
        const companyNumber = req.query[QueryParameters.COMPANY_NUMBER];
        if (!isValidCompanyNumber(companyNumber)) {
            logger.error(`Company number "${companyNumber}" is invalid`);
            throw new Error("Invalid company number");
        }
        return companyNumber!.toString();
    }

    public async executePost(req: Request, _res: Response): Promise<Redirect> {
        const companyNumber = this.getCompanyNumberFromRequest(req);
        const { companyName } = await this.getCompanyProfile(req, companyNumber);
        logger.info(`Company number '${companyNumber}' confirmed`);


        this.setCompanyName(req, companyName);
        this.setCompanyNumber(req, companyNumber);

        return {
            redirect: PrefixedUrls.ENTER_YOUR_DETAILS
        };
    }

    private setCompanyNumber(req: Request, companyNumber: string) {
        const presenterAccountDetails = getPresenterAccountDetails(req);
        if (presenterAccountDetails === undefined){
            throw Error("Presenter account details is undefined, journey is in invalid state.");
        }
        setPresenterAccountDetails(req, { ...presenterAccountDetails, companyNumber });
    }

    private setCompanyName(req: Request, companyName: string) {
        const presenterAccountDetails = getPresenterAccountDetails(req);
        if (presenterAccountDetails === undefined){
            throw Error("Presenter account details is undefined, journey is in invalid state.");
        }
        setPresenterAccountDetails(req, { ...presenterAccountDetails, companyName });
    }

    private appendCompanyNumberQuery(url: String, req: Request) {
        const companyNumber = this.getCompanyNumberFromRequest(req);
        return `${url}?${QueryParameters.COMPANY_NUMBER}=${companyNumber}`;
    }
}

