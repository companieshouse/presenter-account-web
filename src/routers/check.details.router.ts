import { NextFunction, Request, Response, Router } from "express";
import { CheckDetailsHandler } from "./handlers/check_details";
import { handleExceptions } from "../utils/async.handler";
import { noCacheMiddleware } from "../middleware/no.cache.middleware";
import { requirePresenterAccountDetailsMiddleware } from "../middleware/require.presenter.account.details.middleware";

const router = Router();

// Prevent caching on this page.
// If the user presses the back button, it will render the page as it apeared previously using
// cached HTML even though the details could have already been submitted and session cleared.
router.use(noCacheMiddleware);

router.get("/", requirePresenterAccountDetailsMiddleware, handleExceptions(async (req: Request, res: Response) => {
    const handler = new CheckDetailsHandler();
    const { templatePath, viewData } = handler.executeGet(req, res);
    res.render(templatePath, viewData);
}));

router.post("/", handleExceptions(async (req: Request, res: Response, next: NextFunction) => {
    const handler = new CheckDetailsHandler();
    const submitDetailsResult = await handler.executePost(req, res);
    if (submitDetailsResult instanceof Error) {
        return next(submitDetailsResult);
    }

    return res.redirect(submitDetailsResult.redirect);
}));


export default router;
