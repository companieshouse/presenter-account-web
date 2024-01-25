import { env } from "../config";
import { Request } from "express";
import { createPrivateApiClient } from "private-api-sdk-node";

export function createOauthPrivateApiClient(req: Request) {
    const oauthAccessToken = req.session?.data.signin_info?.access_token?.access_token;
    return createPrivateApiClient(undefined, oauthAccessToken, env.INTERNAL_API_URL, undefined);
}
