import { Request, Response, Router } from "express";
import { IsBusinessRegisteredHandler } from "./handlers/is_business_registered";
import { handleExceptions } from "../utils/async.handler";
import { isRedirect } from "./handlers/generic";

const router = Router();

router.get('/', handleExceptions(async (req: Request, res: Response) => {
    const handler = new IsBusinessRegisteredHandler();
    const viewData = await handler.executeGet(req, res);
    res.render(viewData.templatePath, viewData.viewData);
}));

router.post('/', handleExceptions(async (req: Request, res: Response) => {
    const handler = new IsBusinessRegisteredHandler();
    const viewData = await handler.executePost(req, res);
    if (isRedirect(viewData)) {
        res.redirect(viewData.redirect);
    } else {
        res.render(viewData.templatePath, viewData.viewData);
    }

}));

export default router;
