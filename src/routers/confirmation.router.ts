import { Request, Response, Router, NextFunction } from "express";
import { ConfirmationHandler } from "./handlers/confirmation";

const router: Router = Router();

router.get("/", (req: Request, res: Response, _next: NextFunction) => {
    const handler = new ConfirmationHandler();
    const { templatePath, viewData } = handler.execute(req, res);
    res.render(templatePath, viewData);
});

export default router;
