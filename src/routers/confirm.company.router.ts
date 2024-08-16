import { Router, Request, Response } from "express";
import { noCacheMiddleware } from "../middleware/no.cache.middleware";
import { handleExceptions } from "../utils/async.handler";
import { ConfirmCompanyHandler } from "./handlers/confirm_company";

const router = Router();

// Prevent caching on this page.
// If the user presses the back button, it will render the page as it apeared previously using
// cached HTML even though the details could have already been submitted and session cleared.
router.use(noCacheMiddleware);

router.get("/", handleExceptions(async (req: Request, res: Response) => {
    const handler = new ConfirmCompanyHandler();
    const { templatePath, viewData } = await handler.executeGet(req, res);
    return res.render(templatePath, viewData);
}));

router.post("/", handleExceptions(async (req: Request, res: Response) => {
    const handler = new ConfirmCompanyHandler();
    const { redirect } = await handler.executePost(req, res);
    return res.redirect(redirect);
}));

export default router;
