import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { env } from "../config";
import { Request } from "express";
import { createPrivateApiClient } from "private-api-sdk-node";
import { createApiClient } from "@companieshouse/api-sdk-node";
import { createAndLogError } from "../utils/logger";

export function createOauthPrivateApiClient(req: Request) {
    const oauthAccessToken = req.session?.data.signin_info?.access_token?.access_token;
    return createPrivateApiClient(undefined, oauthAccessToken, env.INTERNAL_API_URL, undefined);
}

/**
 * Creates an instance of the OAuth API client using a request object.
 *
 * @param {Request} req - The request object that contains the session with OAuth access token.
 * @returns {ApiClient} An instance of the OAuth API client.
 * @throws {Error} Will throw an error if unable to access the OAuth token.
 */
export function createPublicOAuthApiClient(req: Request): ApiClient {
    const oAuthAccessToken =
        req.session?.data.signin_info?.access_token?.access_token;
    if (oAuthAccessToken !== undefined && oAuthAccessToken.length > 0) {
        return createApiClient(undefined, oAuthAccessToken, env.API_URL);
    }

    throw createAndLogError("Error creating public OAuth API client. Unable to access OAuth token.");
}
