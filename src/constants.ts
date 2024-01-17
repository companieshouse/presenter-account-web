export const servicePathPrefix = "/presenter-account";

export enum URL_QUERY_PARAM {
    PARAM_COMPANY_NUMBER = "companyNumber",
    PARAM_TRANSACTION_ID = "transactionId",
    PARAM_SUBMISSION_ID = "submissionId",
}

export const COMPANY_AUTH_PROTECTED_BASE = `/company/:${URL_QUERY_PARAM.PARAM_COMPANY_NUMBER}`;

export const Urls = {
    HOME: "/",
    HEALTHCHECK: "/healthcheck",
    ENTER_YOUR_DETAILS: "/enter-your-details",
    CHECK_DETAILS: "/check_details",
    SUBMITTED: "/submitted"
}

export const PrefixedUrls = {
    HOME: servicePathPrefix + Urls.HOME,
    HEALTHCHECK: servicePathPrefix + Urls.HEALTHCHECK,
    ENTER_YOUR_DETAILS: servicePathPrefix + Urls.ENTER_YOUR_DETAILS,
    CHECK_DETAILS: servicePathPrefix + Urls.CHECK_DETAILS,
    SUBMITTED: servicePathPrefix + Urls.SUBMITTED
}
