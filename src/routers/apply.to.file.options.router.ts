import { Request, Response, Router, NextFunction } from "express";
import { ApplyToFileOptionsHandler } from "./handlers/apply_to_file_options";

const router: Router = Router();

router.get("/", (req: Request, res: Response, _next: NextFunction) => {
    const handler = new ApplyToFileOptionsHandler();
    const { templatePath, viewData } = handler.executeGet(req, res);
    return res.render(templatePath, viewData);
});

router.post("/", (req: Request, res: Response, _next: NextFunction) => {
    const handler = new ApplyToFileOptionsHandler();
    const response = handler.executePost(req, res);

    if ('redirect' in response) {
        return res.redirect(response.redirect);
    }

    const { templatePath, viewData }  = response;
    return res.render(templatePath, viewData);
});

export default router;
