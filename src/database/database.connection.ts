import { users } from "@modules/users/infrastructure/database/users.schema";
import { drizzle } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";

export const DATABASE_CONNECTION = Symbol("DATABASE_CONNECTION");

export const schema = { users };

export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

export function createDrizzle(pool: Pool): DrizzleDB {
	return drizzle(pool, { schema });
}
