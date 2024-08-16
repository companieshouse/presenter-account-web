import { Router } from "express";
import { handleExceptions } from "../utils/async.handler";
import { ExternalUrls } from "../constants";
import { isBusinessRegistered } from "../utils/session";

const router = Router();

router.use('/', handleExceptions(async (req, res) => {
    if (!isBusinessRegistered(req)) {
        throw new Error('Not registered as a business');
    }

    res.redirect(ExternalUrls.COMPANY_LOOKUP);
}));

export default router;
