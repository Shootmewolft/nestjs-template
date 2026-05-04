import { Inject, Injectable } from "@nestjs/common";
import { HealthIndicatorService } from "@nestjs/terminus";
import { sql } from "drizzle-orm";
import { DATABASE_CONNECTION, type DrizzleDB } from "@/database";

@Injectable()
export class DatabaseHealthIndicator {
	@Inject(DATABASE_CONNECTION)
	private readonly db!: DrizzleDB;

	constructor(
		private readonly healthIndicatorService: HealthIndicatorService,
	) {}

	async isHealthy(key: string) {
		const indicator = this.healthIndicatorService.check(key);
		try {
			await this.db.execute(sql`SELECT 1`);
			return indicator.up();
		} catch (error) {
			return indicator.down({
				message: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
}
