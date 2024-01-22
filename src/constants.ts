import { env } from "./config";

export const servicePathPrefix = "/presenter-account";

export const Urls = {
    HOME: "/",
    HEALTHCHECK: "/healthcheck",
    APPLY_TO_FILE_OPTIONS: "/what-do-you-need-to-file",
    ENTER_YOUR_DETAILS: "/enter-your-details",
    CHECK_DETAILS: "/check_details",
    SUBMITTED: "/submitted",
    YOU_CANNOT_USE_THIS_SERVICE: '/you-cannot-use-this-service'
};

export const PrefixedUrls = {
    HOME: servicePathPrefix + Urls.HOME,
    APPLY_TO_FILE_OPTIONS: servicePathPrefix + Urls.APPLY_TO_FILE_OPTIONS,
    HEALTHCHECK: servicePathPrefix + Urls.HEALTHCHECK,
    ENTER_YOUR_DETAILS: servicePathPrefix + Urls.ENTER_YOUR_DETAILS,
    CHECK_DETAILS: servicePathPrefix + Urls.CHECK_DETAILS,
    SUBMITTED: servicePathPrefix + Urls.SUBMITTED,
    YOU_CANNOT_USE_THIS_SERVICE: servicePathPrefix + Urls.YOU_CANNOT_USE_THIS_SERVICE
};


export const ExternalUrls = {
    FEEDBACK: env.FEEDBACK_URL,
}