import logger from "../../Logger";
import { GenericValidator } from "../generic";

export class SignInFormsValidator extends GenericValidator {

    constructor (classParam?: string) {
        super();
    }

    validateSignIn (payload: any): Promise<any> {
        logger.info(`Request to validate sign in payload`);
        try {
            if (typeof payload.email !== "undefined" && !payload.email.length) {
                this.errors.stack.email = this.errorManifest.validation.email.blank;
            } else if (!this.isValidEmail(payload.email)) {
                this.errors.stack.email = this.errorManifest.validation.email.incorrect;
            }

            if (typeof payload.password !== "undefined" && !payload.password.length) {
                this.errors.stack.password = this.errorManifest.validation.password.blank;
            } else if (!this.isValidPassword(payload.password)) {
                this.errors.stack.password = this.errorManifest.validation.password.incorrect;
            }

            // finally, check if all fields validated correctly, or if one or more of them failed
            if (!Object.keys(this.errors.stack).length) {
                return Promise.resolve(true);
            } else {
                return Promise.reject(this.errors);
            }
        } catch (err) {
            this.errors.stack = this.errorManifest.generic.serverError;
            return Promise.reject(this.errors);
        }
    }

    validateSaveDetails (payload: any): Promise<any> {
        return Promise.resolve(true);
    }
};
