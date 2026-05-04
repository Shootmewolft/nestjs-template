export interface ResponseMeta {
	timestamp: string;
	pagination?: PaginationMeta;
}

export interface PaginationMeta {
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

export interface PaginationLinks {
	first: string;
	prev: string | null;
	current: string;
	next: string | null;
	last: string;
}

export interface ApiResponse<T> {
	success: true;
	data: T;
	meta: ResponseMeta;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
	links: PaginationLinks;
}

export interface ApiErrorResponse {
	success: false;
	error: {
		code: string;
		message: string;
		details?: Array<{ field: string; message: string }>;
	};
	meta: Pick<ResponseMeta, "timestamp">;
}
