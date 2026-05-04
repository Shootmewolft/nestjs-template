import type { CallHandler, ExecutionContext } from "@nestjs/common";
import { of } from "rxjs";
import { ResponseInterceptor } from "./response.interceptor";

const mockContext = {} as ExecutionContext;

function makeHandler<T>(value: T): CallHandler<T> {
	return { handle: () => of(value) };
}

describe("ResponseInterceptor", () => {
	let interceptor: ResponseInterceptor<unknown>;

	beforeEach(() => {
		interceptor = new ResponseInterceptor();
	});

	it("wraps plain data in success envelope", (done) => {
		interceptor
			.intercept(mockContext, makeHandler({ id: 1 }))
			.subscribe((result) => {
				expect(result).toMatchObject({
					success: true,
					data: { id: 1 },
					meta: { timestamp: expect.any(String) },
				});
				done();
			});
	});

	it("passes through paginated responses unchanged", (done) => {
		const paginated = {
			success: true,
			data: [{ id: 1 }],
			meta: { timestamp: new Date().toISOString(), pagination: {} },
			links: { first: "/", prev: null, current: "/", next: null, last: "/" },
		};

		interceptor
			.intercept(mockContext, makeHandler(paginated))
			.subscribe((result) => {
				expect(result).toEqual(paginated);
				done();
			});
	});

	it("wraps null data correctly", (done) => {
		interceptor
			.intercept(mockContext, makeHandler(null))
			.subscribe((result) => {
				expect(result).toMatchObject({ success: true, data: null });
				done();
			});
	});
});
