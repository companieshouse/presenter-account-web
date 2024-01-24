import { Request, Response, Router, NextFunction } from "express";
import { YouCannotUseThisServiceHandler } from "./handlers/you_cannot_use_this_service";
import { handleExceptions } from "../utils/async.handler";

const router: Router = Router();

router.get("/", handleExceptions(async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new YouCannotUseThisServiceHandler();
    const { templatePath, viewData } = handler.execute(req, res);
    res.render(templatePath, viewData);
}));

export default router;
