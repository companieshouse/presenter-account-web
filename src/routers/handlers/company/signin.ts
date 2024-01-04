import { Request, Response } from "express";
import { GenericHandler } from "./../generic";
import logger from "../../../lib/Logger";
import { SignInFormsValidator } from "./../../../lib/validation/formValidators/signin";

export class SignInHandler extends GenericHandler {

    validator: SignInFormsValidator;

    constructor () {
        super();
        this.validator = new SignInFormsValidator();
        this.viewData.title = "Sign in to Companies House";
        this.viewData.sampleKey = "login page";
    }

    public async execute (req: Request, response: Response, method: string): Promise<any> {
        logger.info(`${method} request to sign in to companies house`);
        try {
            if (method !== "POST") {
                return this.viewData;
            }
            this.viewData.payload = req.body;
            await this.validator.validateSignIn(req.body);
            await this.save(req.body);
            this.viewData.dataSaved = true;
        } catch (err: any) {
            logger.error(`login error : ${err}`);
            this.viewData.errors = this.processHandlerException(err);
        }
        return this.viewData;
    }

    private save (payload: any): Object {
        logger.info(`I am in save method.`);
        // const {emailAddress, password} = payload;
        if (payload.email === "test@abc.com" && payload.password === "password") {
            return Promise.resolve(true);
        }
        logger.info(`I am in leaving save method.`);
        return Promise.resolve(false);
    }

    private supportMethod2 (): Object {
        return Promise.resolve(true);
    }
};
