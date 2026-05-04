import type { PaginationDto } from "@common/pagination/pagination.dto";
import type { PaginationService } from "@common/pagination/pagination.service";
import type { PaginatedApiResponse } from "@common/types/api-response.types";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { UpdateUserData, UserEntity } from "../domain/user.entity";
import {
	type IUserRepository,
	USER_REPOSITORY,
} from "../domain/user.repository.interface";

export const PAGINATION_SERVICE = Symbol("PAGINATION_SERVICE");

@Injectable()
export class UsersService {
	constructor(
		@Inject(USER_REPOSITORY) private readonly usersRepo: IUserRepository,
		@Inject(PAGINATION_SERVICE)
		private readonly paginationService: PaginationService,
	) {}

	async findAll(dto: PaginationDto): Promise<PaginatedApiResponse<UserEntity>> {
		const page = dto.page ?? 1;
		const limit = dto.limit ?? 20;
		const result = await this.usersRepo.findAll(page, limit);
		return this.paginationService.paginate(result, dto);
	}

	async findById(id: string): Promise<UserEntity> {
		const user = await this.usersRepo.findById(id);
		if (!user) {
			throw new NotFoundException(`User ${id} not found`);
		}
		return user;
	}

	async update(id: string, data: UpdateUserData): Promise<UserEntity> {
		const user = await this.usersRepo.update(id, data);
		if (!user) {
			throw new NotFoundException(`User ${id} not found`);
		}
		return user;
	}

	async delete(id: string): Promise<void> {
		const deleted = await this.usersRepo.delete(id);
		if (!deleted) {
			throw new NotFoundException(`User ${id} not found`);
		}
	}
}
