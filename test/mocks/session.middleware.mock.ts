jest.mock("ioredis");
jest.mock("../../src/middleware/session.middleware");

import { NextFunction, Request, Response } from "express";
import { sessionMiddleware } from "../../src/middleware/session.middleware";
import { Session } from "@companieshouse/node-session-handler";
import { getSessionRequest } from "./session.mock";

// get handle on mocked function
export const mockSessionMiddleware = sessionMiddleware as jest.Mock;

export let session = new Session();

export const mockSession = () => session = getSessionRequest();

mockSessionMiddleware.mockImplementation((_) => {
    return (req: Request, res: Response, next: NextFunction) => {
        req.session = session;
        req.session.data.extra_data["payment-nonce"] = "123456";
        next();
    };
});

