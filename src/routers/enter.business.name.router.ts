import { Request, Response, Router, NextFunction } from "express";
import { handleExceptions } from "../utils/async.handler";
import { noCacheMiddleware } from "../middleware/no.cache.middleware";
import { validateEnterBusinessNameForm } from "../middleware/formvalidation.middleware";
import { EnterBusinessNameHandler } from "./handlers/enter_business_name";

const router = Router();

// Prevent caching on this page.
// If the user presses the back button, it will render the page as it apeared previously using
// cached HTML even though the details could have already been submitted and session cleared.
router.use(noCacheMiddleware);

router.get("/", handleExceptions( async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new EnterBusinessNameHandler();
    const { templatePath, viewData } = handler.executeGet(req, res);
    return res.render(templatePath, viewData);
}));

router.post("/", validateEnterBusinessNameForm, handleExceptions( async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new EnterBusinessNameHandler();
    const handlerPostResp = handler.executePost(req, res);

    if ('redirect' in handlerPostResp){
        return res.redirect(handlerPostResp.redirect);
    }

    return res.render(handlerPostResp.templatePath, handlerPostResp.viewData);
}));

export default router;
