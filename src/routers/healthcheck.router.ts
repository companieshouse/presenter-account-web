import { Request, Response, Router, NextFunction } from "express";
import { wrapAsyncHandlerWithErrorHandler } from "../utils/async.handler";

const router: Router = Router();

router.get("/", wrapAsyncHandlerWithErrorHandler(async (req: Request, res: Response, _next: NextFunction) => {
    res.status(200).send();
}));

export default router;
