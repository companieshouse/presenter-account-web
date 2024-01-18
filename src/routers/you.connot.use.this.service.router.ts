import { Request, Response, Router, NextFunction } from "express";
import { YouCannotUseThisServiceHandler } from "./handlers/you_cannot_use_this_service";

const router: Router = Router();

router.get("/", (req: Request, res: Response, _next: NextFunction) => {
    const handler = new YouCannotUseThisServiceHandler();
    const { templatePath, viewData } = handler.execute(req, res);
    res.render(templatePath, viewData);
});

export default router;
