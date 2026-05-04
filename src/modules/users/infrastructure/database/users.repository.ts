import { Inject, Injectable } from "@nestjs/common";
import { eq, sql } from "drizzle-orm";
import { DATABASE_CONNECTION, type DrizzleDB } from "@/database";
import type {
	CreateUserData,
	UpdateUserData,
	UserEntity,
} from "../../domain/user.entity";
import type { IUserRepository } from "../../domain/user.repository.interface";
import { users } from "./users.schema";

@Injectable()
export class UsersRepository implements IUserRepository {
	constructor(@Inject(DATABASE_CONNECTION) private readonly db: DrizzleDB) {}

	async findAll(
		page: number,
		limit: number,
	): Promise<{ items: UserEntity[]; totalItems: number }> {
		const offset = (page - 1) * limit;

		const [rows, [{ count }]] = await Promise.all([
			this.db.select().from(users).limit(limit).offset(offset),
			this.db.select({ count: sql<number>`count(*)::int` }).from(users),
		]);

		return { items: rows, totalItems: count };
	}

	async findById(id: string): Promise<UserEntity | null> {
		const [row] = await this.db
			.select()
			.from(users)
			.where(eq(users.id, id))
			.limit(1);
		return row ?? null;
	}

	async findByEmail(email: string): Promise<UserEntity | null> {
		const [row] = await this.db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);
		return row ?? null;
	}

	async create(data: CreateUserData): Promise<UserEntity> {
		const [row] = await this.db.insert(users).values(data).returning();
		return row as UserEntity;
	}

	async update(id: string, data: UpdateUserData): Promise<UserEntity | null> {
		if (Object.keys(data).length === 0) {
			return this.findById(id);
		}

		const [row] = await this.db
			.update(users)
			.set(data)
			.where(eq(users.id, id))
			.returning();
		return row ?? null;
	}

	async delete(id: string): Promise<boolean> {
		const result = await this.db
			.delete(users)
			.where(eq(users.id, id))
			.returning({ id: users.id });
		return result.length > 0;
	}
}
