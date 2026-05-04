import type { ArgumentsHost } from "@nestjs/common";
import { HttpException, HttpStatus } from "@nestjs/common";
import { GlobalExceptionFilter } from "./global-exception.filter";

function mockHost(json: jest.Mock) {
	return {
		switchToHttp: () => ({
			getResponse: () => ({
				status: () => ({ json }),
			}),
			getRequest: () => ({
				headers: {},
				method: "GET",
				url: "/test",
			}),
		}),
	} as unknown as ArgumentsHost;
}

describe("GlobalExceptionFilter", () => {
	let filter: GlobalExceptionFilter;
	let json: jest.Mock;

	beforeEach(() => {
		filter = new GlobalExceptionFilter();
		json = jest.fn();
	});

	it("maps HttpException to correct status and code", () => {
		const exception = new HttpException("Not found", HttpStatus.NOT_FOUND);
		filter.catch(exception, mockHost(json));

		expect(json).toHaveBeenCalledWith(
			expect.objectContaining({
				success: false,
				error: expect.objectContaining({
					code: "NOT_FOUND",
					message: "Not found",
				}),
			}),
		);
	});

	it("maps validation errors to VALIDATION_ERROR with details", () => {
		const exception = new HttpException(
			{ message: ["email must be an email", "name should not be empty"] },
			HttpStatus.BAD_REQUEST,
		);
		filter.catch(exception, mockHost(json));

		const body = json.mock.calls[0][0];
		expect(body.error.code).toBe("VALIDATION_ERROR");
		expect(body.error.details).toHaveLength(2);
	});

	it("maps unknown errors to 500 INTERNAL_SERVER_ERROR", () => {
		filter.catch(new Error("boom"), mockHost(json));

		const body = json.mock.calls[0][0];
		expect(body.error.code).toBe("INTERNAL_SERVER_ERROR");
	});
});
