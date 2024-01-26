import { Request, Response, Router, NextFunction } from "express";
import { EnterYourDetailsHandler } from "./handlers/enter_your_details";
import { blank_field_validations } from "./../validation/enter.your.details.validation";
import { handleExceptions } from "../utils/async.handler";

const router: Router = Router();

router.get("/", (req: Request, res: Response, _next: NextFunction) => {
    const handler = new EnterYourDetailsHandler();
    const { templatePath, viewData } = handler.executeGet(req, res);
    return res.render(templatePath, viewData);
});

router.post("/", blank_field_validations(), handleExceptions( async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new EnterYourDetailsHandler();
    const handlerPostResp = handler.executePost(req, res);

    if ('redirect' in handlerPostResp){
        return res.redirect(handlerPostResp.redirect);
    }

    return res.render(handlerPostResp.templatePath, handlerPostResp.viewData);
}));

export default router;
