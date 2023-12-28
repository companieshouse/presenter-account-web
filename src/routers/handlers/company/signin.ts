import { Request, Response } from "express";
import { GenericHandler } from "./../generic";
import logger from "../../../lib/Logger";

export class SignInHandler extends GenericHandler {

    constructor () {
        super();
        this.viewData.title = "Sign in to Companies House";
        this.viewData.sampleKey = "login page";
    }

    public async execute (req: Request, response: Response, method: string = "GET"): Promise<any> {
        logger.info(`${method} request to sign in to companies house`);
        try {
            if (method !== "POST") {
                return this.viewData;
            }
            this.viewData.payload = req.body;
            await this.save(req.body);
            this.viewData.dataSaved = true;
        } catch (err: any) {
            logger.error(`login error : ${err}`);
            this.viewData.errors = this.processHandlerException(err);
        }
        return this.viewData;
    }

    private save (payload: any): Object {
        return Promise.resolve(true);
    }

    private supportMethod2 (): Object {
        return Promise.resolve(true);
    }
};
