import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import { map, type Observable } from "rxjs";
import type {
	ApiResponse,
	PaginatedApiResponse,
} from "../types/api-response.types";

@Injectable()
export class ResponseInterceptor<T>
	implements NestInterceptor<T, ApiResponse<T>>
{
	intercept(
		_context: ExecutionContext,
		next: CallHandler<T>,
	): Observable<ApiResponse<T>> {
		return next.handle().pipe(
			map((data) => {
				if (isPaginated(data)) {
					return data as unknown as ApiResponse<T>;
				}

				return {
					success: true,
					data,
					meta: {
						timestamp: new Date().toISOString(),
					},
				};
			}),
		);
	}
}

function isPaginated(data: unknown): data is PaginatedApiResponse<unknown> {
	return (
		typeof data === "object" &&
		data !== null &&
		"data" in data &&
		"meta" in data &&
		"links" in data &&
		Array.isArray((data as PaginatedApiResponse<unknown>).data)
	);
}
