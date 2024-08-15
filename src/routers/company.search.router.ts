import { Router } from "express";
import { handleExceptions } from "../utils/async.handler";
import { ExternalUrls } from "../constants";

const router = Router();

router.use('/', handleExceptions(async (_req, res) => {
    res.redirect(ExternalUrls.COMPANY_LOOKUP);
}));

export default router;
