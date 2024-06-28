import { Request, Response, Router, NextFunction } from "express";
import { EnterYourDetailsHandler } from "./handlers/enter_your_details";
import { handleExceptions } from "../utils/async.handler";
import { noCacheMiddleware } from "../middleware/no.cache.middleware";
import { validateForm } from "../middleware/formvalidation.middleware";

const router = Router();

// Prevent caching on this page.
// If the user presses the back button, it will render the page as it apeared previously using
// cached HTML even though the details could have already been submitted and session cleared.
router.use(noCacheMiddleware);

router.get("/", handleExceptions( async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new EnterYourDetailsHandler();
    const { templatePath, viewData } = handler.executeGet(req, res);
    return res.render(templatePath, viewData);
}));

router.post("/", validateForm, handleExceptions( async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new EnterYourDetailsHandler();
    const handlerPostResp = handler.executePost(req, res);

    if ('redirect' in handlerPostResp){
        return res.redirect(handlerPostResp.redirect);
    }

    return res.render(handlerPostResp.templatePath, handlerPostResp.viewData);
}));

export default router;
