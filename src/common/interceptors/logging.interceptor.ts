import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	Logger,
	type NestInterceptor,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { type Observable, tap } from "rxjs";
import { REQUEST_ID_HEADER } from "../middleware/request-id.middleware";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger = new Logger("HTTP");

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const req = context.switchToHttp().getRequest<Request>();
		const res = context.switchToHttp().getResponse<Response>();
		const { method, url } = req;
		const requestId = req.headers[REQUEST_ID_HEADER] as string;
		const start = Date.now();

		return next.handle().pipe(
			tap({
				next: () => {
					this.logger.log(
						`${method} ${url} ${res.statusCode} +${Date.now() - start}ms [${requestId}]`,
					);
				},
				error: () => {
					this.logger.error(
						`${method} ${url} ERR +${Date.now() - start}ms [${requestId}]`,
					);
				},
			}),
		);
	}
}
