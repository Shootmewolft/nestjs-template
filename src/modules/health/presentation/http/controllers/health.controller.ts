import { DatabaseHealthIndicator } from "@modules/health/infrastructure/adapters/database-health.adapter";
import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";

@ApiTags("Health")
@Controller("health")
export class HealthController {
	constructor(
		private readonly health: HealthCheckService,
		private readonly databaseHealth: DatabaseHealthIndicator,
	) {}

	@Get()
	@HealthCheck()
	@ApiOperation({
		summary: "Check service health",
		description:
			"Returns the current health status of the service and all registered health indicators (database, etc.).",
	})
	@ApiResponse({ status: 200, description: "All indicators are healthy." })
	@ApiResponse({ status: 503, description: "One or more indicators are down." })
	check() {
		return this.health.check([() => this.databaseHealth.isHealthy("database")]);
	}
}
