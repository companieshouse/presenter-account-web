import { Request, Response, Router, NextFunction } from "express";
import { HomeHandler } from "./handlers/index/home";
import { handleExceptions } from "../utils/async.handler";

const router: Router = Router();

router.get("/", handleExceptions(async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new HomeHandler();
    const params = handler.execute(req, res);
    if (params.templatePath && params.viewData) {
        res.render(params.templatePath, params.viewData);
    }
}));

export default router;
