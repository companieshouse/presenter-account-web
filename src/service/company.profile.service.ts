import { Resource } from "@companieshouse/api-sdk-node";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { logger } from "../utils/logger";
import { Request } from "express";
import { createPublicOAuthApiClient } from "./api.client.service";
import { failure, Result, success } from "@companieshouse/api-sdk-node/dist/services/result";


export class CompanyProfileService {
    constructor(private apiClient: ApiClient) {}

    async getCompanyProfile(companyNumber: string): Promise<Result<CompanyProfile, Error>> {
        const companyProfile: Resource<CompanyProfile> = await this.apiClient.companyProfile.getCompanyProfile(companyNumber);
        if (companyProfile.httpStatusCode !== 200) {
            logger.error(`Company Profile has return http status of ${companyProfile.httpStatusCode}`);
            return failure(new Error("Unable to process requested company number"));
        }

        if (!companyProfile.resource) {
            logger.error(`Company profile return without a resource`);
            return failure(new Error("Unable to process requested company number"));
        }

        return success(companyProfile.resource);
    }

    public static fromRequest(request: Request): CompanyProfileService {
        const apiClient = createPublicOAuthApiClient(request);
        return new CompanyProfileService(apiClient);
    }
}
