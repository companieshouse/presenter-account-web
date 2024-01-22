import { Request, Response, Router, NextFunction } from "express";
import { CheckDetailsHandler } from "./handlers/check_details";
const router: Router = Router();

router.get("/", (req: Request, res: Response, _next: NextFunction) => {
    const handler = new CheckDetailsHandler();
    const { templatePath, viewData } = handler.executeGet(req, res);
    res.render(templatePath, viewData);
});

router.post("/", async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new CheckDetailsHandler();
    const { redirect } = await handler.executePost(req, res);
    
    res.redirect(redirect);
});


export default router;
