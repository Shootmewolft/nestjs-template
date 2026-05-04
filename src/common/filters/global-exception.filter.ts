import {
	type ArgumentsHost,
	Catch,
	type ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from "@nestjs/common";
import type { Response } from "express";
import type { ApiErrorResponse } from "../types/api-response.types";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(GlobalExceptionFilter.name);

	catch(exception: unknown, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const res = ctx.getResponse<Response>();
		const req = ctx.getRequest<{
			headers: Record<string, string>;
			method: string;
			url: string;
		}>();

		const { status, code, message, details } = this.resolveException(exception);

		if (status >= 500) {
			this.logger.error(
				`${req.method} ${req.url} → ${status}`,
				exception instanceof Error ? exception.stack : String(exception),
			);
		}

		const body: ApiErrorResponse = {
			success: false,
			error: { code, message, ...(details ? { details } : {}) },
			meta: {
				timestamp: new Date().toISOString(),
			},
		};

		res.status(status).json(body);
	}

	private resolveException(exception: unknown): {
		status: number;
		code: string;
		message: string;
		details?: Array<{ field: string; message: string }>;
	} {
		if (exception instanceof HttpException) {
			const status = exception.getStatus();
			const response = exception.getResponse();

			if (
				typeof response === "object" &&
				response !== null &&
				"message" in response &&
				Array.isArray((response as { message: unknown }).message)
			) {
				const messages = (response as { message: string[] }).message;
				return {
					status,
					code: "VALIDATION_ERROR",
					message: "Request validation failed",
					details: messages.map((msg) => {
						const [field, ...rest] = msg.split(" ");
						return {
							field: field ?? "unknown",
							message: rest.join(" ") || msg,
						};
					}),
				};
			}

			const message =
				typeof response === "string"
					? response
					: ((response as { message?: string }).message ?? exception.message);

			return {
				status,
				code: toErrorCode(status),
				message,
			};
		}

		return {
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			code: "INTERNAL_SERVER_ERROR",
			message: "An unexpected error occurred",
		};
	}
}

function toErrorCode(status: number): string {
	const map: Record<number, string> = {
		400: "BAD_REQUEST",
		401: "UNAUTHORIZED",
		403: "FORBIDDEN",
		404: "NOT_FOUND",
		409: "CONFLICT",
		422: "UNPROCESSABLE_ENTITY",
		429: "TOO_MANY_REQUESTS",
		500: "INTERNAL_SERVER_ERROR",
		503: "SERVICE_UNAVAILABLE",
	};
	return map[status] ?? "HTTP_ERROR";
}
