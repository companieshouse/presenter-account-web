import { env } from "./config";

export const servicePathPrefix = "/presenter-account";

export const Urls = {
    ACCESSIBILITY_STATEMENT: "/accessibility-statement",
    HOME: "/",
    HEALTHCHECK: "/healthcheck",
    APPLY_TO_FILE_OPTIONS: "/what-do-you-need-to-file",
    ENTER_YOUR_DETAILS: "/enter-your-details",
    CHECK_DETAILS: "/check_details",
    YOU_CANNOT_USE_THIS_SERVICE: "/you-cannot-use-this-service",
    CONFIRMATION: "/confirmation",
    SUBMITTED: "/submitted",
    ERROR_SUBMITTING: "/error-submitting"
} as const;

export const PrefixedUrls = {
    ACCESSIBILITY_STATEMENT: servicePathPrefix + Urls.ACCESSIBILITY_STATEMENT,
    HOME: servicePathPrefix + Urls.HOME,
    APPLY_TO_FILE_OPTIONS: servicePathPrefix + Urls.APPLY_TO_FILE_OPTIONS,
    HEALTHCHECK: servicePathPrefix + Urls.HEALTHCHECK,
    ENTER_YOUR_DETAILS: servicePathPrefix + Urls.ENTER_YOUR_DETAILS,
    CHECK_DETAILS: servicePathPrefix + Urls.CHECK_DETAILS,
    YOU_CANNOT_USE_THIS_SERVICE: servicePathPrefix + Urls.YOU_CANNOT_USE_THIS_SERVICE,
    CONFIRMATION: servicePathPrefix + Urls.CONFIRMATION,
    SUBMITTED: servicePathPrefix + Urls.SUBMITTED,
    ERROR_SUBMITTING: servicePathPrefix + Urls.ERROR_SUBMITTING,
    COOKIES: "/help/cookies"
} as const;

export const ExternalUrls = {
    ABILITY_NET: env.ABILITY_NET_LINK,
    CONTACT_US: env.CONTACT_US_LINK,
    DEVELOPERS: env.DEVELOPERS_LINK,
    FEEDBACK: env.FEEDBACK_URL,
    OPEN_GOVERNMENT_LICENSE: env.OPEN_GOVERNMENT_LICENSE_LINK,
    POLICIES: env.POLICIES_LINK,
} as const;
