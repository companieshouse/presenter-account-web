import { NextFunction, Request, Response, Router } from "express";
import { CheckDetailsHandler } from "./handlers/check_details";
import { handleExceptions } from "../utils/async.handler";
const router: Router = Router();

router.get("/", handleExceptions(async (req: Request, res: Response) => {
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
