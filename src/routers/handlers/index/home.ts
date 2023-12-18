import { Request, Response } from "express";
import { GenericHandler, HomeViewData, ViewModel, defaultBaseViewData } from "./../generic";
import logger from "../../../lib/Logger";
import { homeDefaultViewData } from "../../../utils/constants/home";

export class HomeHandler extends GenericHandler {
    private title: string;
    private sampleKey: string | undefined;
    private backURL: string | null;
    private homeViewData: ViewModel<HomeViewData>;

    constructor (data: ViewModel<HomeViewData> = {
        templatePath: ``,
        viewData: homeDefaultViewData
    }) {
        super({
            ...defaultBaseViewData,
            title: data.viewData.title,
            backURL: data.viewData.backURL
        });

        this.title = data.viewData.title;
        this.sampleKey = data.viewData.sampleKey;
        this.backURL = data.viewData.backURL;
        this.homeViewData = data;
    }

    public execute (req: Request, response: Response): ViewModel<HomeViewData> {
        logger.info(`GET request for to serve home page`);
        // ...process request here and return data for the view
        return this.homeViewData;
    }
};
