import { Request, Response, Router, NextFunction } from "express";
import { CheckDetailsHandler } from "./handlers/check_details";

const router: Router = Router();

router.get("/check_details", (req: Request, res: Response, _next: NextFunction) => {
    const handler = new CheckDetailsHandler();
    const { templatePath, viewData } = handler.execute(req, res);
    res.render(templatePath, viewData);
});


export default router;
