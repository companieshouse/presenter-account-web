export const servicePathPrefix = "/presenter-account";

export enum URL_QUERY_PARAM {
    PARAM_COMPANY_NUMBER = "companyNumber",
    PARAM_TRANSACTION_ID = "transactionId",
    PARAM_SUBMISSION_ID = "submissionId",
}

export const COMPANY_AUTH_PROTECTED_BASE = `/company/:${URL_QUERY_PARAM.PARAM_COMPANY_NUMBER}`;
export const healthcheckUrl = "/healthcheck";
