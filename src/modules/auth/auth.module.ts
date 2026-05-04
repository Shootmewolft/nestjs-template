import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { appConfig } from "@/config";
import { AuthService } from "./application/auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: "jwt" }),
		JwtModule.register({}),
		ConfigModule.forFeature(appConfig),
	],
	providers: [AuthService, JwtStrategy, JwtRefreshStrategy, JwtAuthGuard],
	exports: [AuthService, JwtModule, JwtAuthGuard],
})
export class AuthModule {}
