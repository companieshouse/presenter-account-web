import { Session } from "@companieshouse/node-session-handler";
import { PrefixedUrls } from "../constants";
import { Request, Response, Router, NextFunction } from "express";
import { Address, Details } from "private-api-sdk-node/src/services/presenter-account/types";
import { setPresenterAccountDetails } from "utils/session";
import { addressToQueryString } from "../utils";

const router: Router = Router();

router.post("/", (req: Request, res: Response, _next: NextFunction) => {
    req['session'] as Session;
    const details: Details = {} as Details;
    details.address = req.query as unknown as Address;
    setPresenterAccountDetails(req, details);
    const queryString = addressToQueryString(req.query);
    res.redirect(`${PrefixedUrls.CHECK_DETAILS}?${queryString}`);
});

export default router;
