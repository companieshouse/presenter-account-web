export const servicePathPrefix = "/presenter-account";

export const Urls = {
    HOME: "/",
    HEALTHCHECK: "/healthcheck",
    ENTER_YOUR_DETAILS: "/enter-your-details",
    CHECK_DETAILS: "/check_details",
    SUBMITTED: "/submitted"
};

export const PrefixedUrls = {
    HOME: servicePathPrefix + Urls.HOME,
    HEALTHCHECK: servicePathPrefix + Urls.HEALTHCHECK,
    ENTER_YOUR_DETAILS: servicePathPrefix + Urls.ENTER_YOUR_DETAILS,
    CHECK_DETAILS: servicePathPrefix + Urls.CHECK_DETAILS,
    SUBMITTED: servicePathPrefix + Urls.SUBMITTED
};
