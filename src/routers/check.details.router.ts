import { Request, Response, Router } from "express";
import { CheckDetailsHandler } from "./handlers/check_details";
import { wrapAsyncHandlerWithErrorHandler } from "../utils/async.handler";
const router: Router = Router();

router.get("/", wrapAsyncHandlerWithErrorHandler(async (req: Request, res: Response) => {
    const handler = new CheckDetailsHandler();
    const { templatePath, viewData } = handler.executeGet(req, res);
    res.render(templatePath, viewData);
}));

router.post("/", wrapAsyncHandlerWithErrorHandler(async (req: Request, res: Response) => {
    const handler = new CheckDetailsHandler();
    const { redirect } = await handler.executePost(req, res);

    res.redirect(redirect);
}));


export default router;
