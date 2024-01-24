import { Request, Response, Router, NextFunction } from "express";
import { ConfirmationHandler } from "./handlers/confirmation";
import { handleExceptions } from "../utils/async.handler";

const router: Router = Router();

router.get("/", handleExceptions(async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new ConfirmationHandler();
    const { templatePath, viewData } = handler.execute(req, res);
    res.render(templatePath, viewData);
}));

export default router;
