import { Request, Response } from "express";
import { GenericHandler, HomeViewData, ViewModel, defaultBaseViewData } from "./../generic";
import { logger } from "../../../utils/logger";

const title = "Apply for a Companies House presenter account for online filing (prototype)";
const backURL = null;
const routeViews = "router_views/index/home";
const pageLinks = {};
const contactUs = "https://www.gov.uk/contact-companies-house";
const applicationPresenterAccountLink = "https://www.gov.uk/government/publications/apply-for-a-companies-house-online-filing-presenter-account";
const abilityNetLink = "https://mcmw.abilitynet.org.uk/";

const homeDefaultViewData: ViewModel<HomeViewData> = {
    templatePath: routeViews,
    viewData: {
        title,
        backURL,
        pageLinks: { ...pageLinks, contactUs, applicationPresenterAccountLink, abilityNetLink }
    }
};

export class HomeHandler extends GenericHandler {
    constructor () {
        super({
            ...defaultBaseViewData,
            ...homeDefaultViewData.viewData
        });
    }

    public execute (_req: Request, _response: Response): ViewModel<HomeViewData> {
        logger.info(`GET request for to serve home page`);
        // ...process request here and return data for the view
        return homeDefaultViewData;
    }
}
