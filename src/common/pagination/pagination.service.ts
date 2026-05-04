import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import type { PaginatedApiResponse } from "../types/api-response.types";
import type { PaginationDto } from "./pagination.dto";

export interface PaginationQueryResult<T> {
	items: T[];
	totalItems: number;
}

@Injectable()
export class PaginationService {
	private static readonly DEFAULT_PAGE = 1;
	private static readonly DEFAULT_LIMIT = 20;

	constructor(@Inject(REQUEST) private readonly request: Request) {}

	paginate<T>(
		result: PaginationQueryResult<T>,
		dto: PaginationDto,
	): PaginatedApiResponse<T> {
		const page = dto.page ?? PaginationService.DEFAULT_PAGE;
		const limit = dto.limit ?? PaginationService.DEFAULT_LIMIT;
		const { items, totalItems } = result;

		const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / limit);
		const hasNextPage = page < totalPages;
		const hasPrevPage = page > 1;

		const baseUrl = this.buildBaseUrl();

		return {
			success: true,
			data: items,
			meta: {
				timestamp: new Date().toISOString(),
				pagination: {
					page,
					limit,
					totalItems,
					totalPages,
					hasNextPage,
					hasPrevPage,
				},
			},
			links: {
				first: `${baseUrl}?page=1&limit=${limit}`,
				prev: hasPrevPage ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
				current: `${baseUrl}?page=${page}&limit=${limit}`,
				next: hasNextPage ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
				last: `${baseUrl}?page=${totalPages}&limit=${limit}`,
			},
		};
	}

	private buildBaseUrl(): string {
		const protocol = this.request.protocol;
		const host = this.request.headers.host ?? "localhost";
		const pathname = new URL(this.request.url, `${protocol}://${host}`)
			.pathname;
		return `${protocol}://${host}${pathname}`;
	}
}
