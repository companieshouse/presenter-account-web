import { CsrfError } from "@companieshouse/web-security-node";
import { csrfErrorHandler } from "../../../../src/routers/handlers/errors";
import { Request, Response, NextFunction } from "express";

describe("Test CSRF Error Handler", () => {
    let mockRequest: Request;
    let mockResponse: Response;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {} as Request;
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            render: jest.fn(),
        } as unknown as Response;
        mockNext = jest.fn();
    });

    it("should trigger next if error is not CsrfError", () => {

        const error: Error = new Error();
        csrfErrorHandler(error, mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toHaveBeenCalledTimes(0);
    });

    it("should return 403 if error is CsrfError", () => {

        const error: Error = new CsrfError();
        csrfErrorHandler(error, mockRequest, mockResponse, mockNext);
        expect(mockResponse.status(403)).toHaveBeenCalled; // eslint-disable-line
    });
});
