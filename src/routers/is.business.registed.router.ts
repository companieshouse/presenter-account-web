import { Request, Response, Router } from "express";
import { IsBusinessRegisteredHandler } from "./handlers/is_business_registered";
import { handleExceptions } from "../utils/async.handler";

const router = Router();

router.get('/', handleExceptions(async (req: Request, res: Response) => {
    const handler = new IsBusinessRegisteredHandler();
    const viewData = handler.executeGet(req, res);
    res.render("router_views/is_business_registered/is_business_registered.njk", viewData);
}));

router.post('/', handleExceptions(async (req: Request, res: Response) => {
    const handler = new IsBusinessRegisteredHandler();
    const nextPage = handler.executePost(req, res);
    res.redirect(nextPage);
}));

export default router;
