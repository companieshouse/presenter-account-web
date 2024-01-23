import { Request, Response, Router, NextFunction } from "express";
import { ConfirmationHandler } from "./handlers/confirmation";
import { wrapAsyncHandlerWithErrorHandler } from "../utils/async.handler";

const router: Router = Router();

router.get("/", wrapAsyncHandlerWithErrorHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new ConfirmationHandler();
    const { templatePath, viewData } = handler.execute(req, res);
    res.render(templatePath, viewData);
}));

export default router;
