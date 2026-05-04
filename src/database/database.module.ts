import { Module } from "@nestjs/common";
import { Pool } from "pg";
import { type DatabaseConfig, databaseConfig } from "./database.config";
import { createDrizzle, DATABASE_CONNECTION } from "./database.connection";

@Module({
	providers: [
		{
			provide: DATABASE_CONNECTION,
			useFactory: async (config: DatabaseConfig) => {
				const pool = new Pool({
					connectionString: config.url as string,
				});
				await pool.query("SELECT 1");
				return createDrizzle(pool);
			},
			inject: [databaseConfig.KEY],
		},
	],
	exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
