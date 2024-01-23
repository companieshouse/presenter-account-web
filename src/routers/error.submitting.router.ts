import { Request, Response, Router, NextFunction } from "express";
import { ErrorSubmittingHandler } from "./handlers/error_submitting";

const router: Router = Router();

router.get("/", (req: Request, res: Response, _next: NextFunction) => {
    const handler = new ErrorSubmittingHandler();
    const { templatePath, viewData } = handler.execute(req, res);
    res.render(templatePath, viewData);
});

export default router;
