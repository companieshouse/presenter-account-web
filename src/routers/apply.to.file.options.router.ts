import { Request, Response, Router, NextFunction } from "express";
import { ApplyToFileOptionsHandler } from "./handlers/apply_to_file_options";

const router: Router = Router();

router.get("/", (req: Request, res: Response, _next: NextFunction) => {
    const handler = new ApplyToFileOptionsHandler();
    const { templatePath, viewData } = handler.executeGet(req, res);
    res.render(templatePath, viewData);
});

router.post("/", (req: Request, res: Response, _next: NextFunction) => {
    const handler = new ApplyToFileOptionsHandler();
    const { redirect } = handler.executePost(req, res);

    return res.redirect(redirect);
});

export default router;
