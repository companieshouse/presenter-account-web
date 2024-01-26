import { Request, Response, Router, NextFunction } from "express";
import { EnterYourDetailsHandler } from "./handlers/enter_your_details";
import { blank_field_validations } from "./../validation/enter.your.details.validation";

const router: Router = Router();

router.get("/", (req: Request, res: Response, _next: NextFunction) => {
    const handler = new EnterYourDetailsHandler();
    const { templatePath, viewData } = handler.executeGet(req, res);
    res.render(templatePath, viewData);
});

router.post("/", blank_field_validations(), (req: Request, res: Response, _next: NextFunction) => {
    const handler = new EnterYourDetailsHandler();
    const response = handler.executePost(req, res);

    if ('redirect' in response){
        return res.redirect(response.redirect);
    }

    const { templatePath, viewData }  = response ;
    return res.render(templatePath, viewData);
});

export default router;
