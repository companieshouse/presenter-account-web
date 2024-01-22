import { env } from "../config";
import { Request } from "express";
import { createPrivateApiClient } from "private-api-sdk-node";

export function createOauthPrivateApiClient(req: Request) {
    const oatuhAccessToken = req.session?.data.signin_info?.access_token?.access_token;
    return createPrivateApiClient(undefined, oatuhAccessToken, env.INTERNAL_API_URL, undefined);
}
