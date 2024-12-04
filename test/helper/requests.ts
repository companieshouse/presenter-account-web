import app from "../../src/app";
import { env } from "../../src/config";
import request from "supertest";

export const setCookie = () => {
    return [env.COOKIE_NAME + '=' + env.COOKIE_SECRET];
};

export const getRequestWithCookie = (uri: string) => {
    return request.agent(app).set("Cookie", setCookie()).get(uri);
};
