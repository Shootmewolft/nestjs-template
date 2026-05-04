import { drizzle } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";

export const DATABASE_CONNECTION = Symbol("DATABASE_CONNECTION");

export const schema = {};

export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

export function createDrizzle(pool: Pool): DrizzleDB {
	return drizzle(pool, { schema });
}
