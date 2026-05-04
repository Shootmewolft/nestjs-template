import { DatabaseHealthIndicator } from "@modules/health/infrastructure/adapters/database-health.adapter";
import { HealthController } from "@modules/health/presentation/http/controllers/health.controller";
import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { DatabaseModule } from "@/database";

@Module({
	imports: [TerminusModule, DatabaseModule],
	controllers: [HealthController],
	providers: [DatabaseHealthIndicator],
})
export class HealthModule {}
