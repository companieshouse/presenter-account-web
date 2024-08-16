import { Router, Request, Response, NextFunction } from "express";
import { noCacheMiddleware } from "../middleware/no.cache.middleware";
import { handleExceptions } from "../utils/async.handler";
import { ConfirmCompanyHandler } from "./handlers/confirm_company";
import { logger } from "../utils/logger";

const router = Router();

// Prevent caching on this page.
// If the user presses the back button, it will render the page as it apeared previously using
// cached HTML even though the details could have already been submitted and session cleared.
router.use(noCacheMiddleware);

router.get("/", handleExceptions(async (req: Request, res: Response, _next: NextFunction) => {
    logger.info('Confirm company');
    const handler = new ConfirmCompanyHandler();
    const { templatePath, viewData } = await handler.executeGet(req, res);
    return res.render(templatePath, viewData);
}));

export default router;
