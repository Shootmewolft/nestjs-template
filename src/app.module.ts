import { HealthModule } from "@modules/health/health.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { appConfig, validateEnv } from "@/config";
import { DatabaseModule, databaseConfig } from "@/database";

const ENV = process.env.NODE_ENV ?? "development";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [`.env.${ENV}`, ".env"],
			validate: validateEnv,
			load: [appConfig, databaseConfig],
		}),
		ThrottlerModule.forRoot([
			{
				name: "short",
				ttl: 1000,
				limit: 10,
			},
			{
				name: "medium",
				ttl: 10000,
				limit: 50,
			},
			{
				name: "long",
				ttl: 60000,
				limit: 100,
			},
		]),
		DatabaseModule,
		HealthModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
