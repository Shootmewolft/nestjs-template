import type { CreateUserData, UpdateUserData, UserEntity } from "./user.entity";

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");

export interface IUserRepository {
	findAll(
		page: number,
		limit: number,
	): Promise<{ items: UserEntity[]; totalItems: number }>;
	findById(id: string): Promise<UserEntity | null>;
	findByEmail(email: string): Promise<UserEntity | null>;
	create(data: CreateUserData): Promise<UserEntity>;
	update(id: string, data: UpdateUserData): Promise<UserEntity | null>;
	delete(id: string): Promise<boolean>;
}
