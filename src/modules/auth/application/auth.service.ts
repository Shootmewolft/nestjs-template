import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { StringValue } from "ms";
import { type AppConfig, appConfig } from "@/config";
import type { JwtPayload } from "../domain/jwt-payload.interface";

export interface Tokens {
	accessToken: string;
	refreshToken: string;
}

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		@Inject(appConfig.KEY) private readonly config: AppConfig,
	) {}

	generateTokens(payload: JwtPayload): Tokens {
		const accessToken = this.jwtService.sign(payload, {
			secret: this.config.jwtSecret,
			expiresIn: this.config.jwtExpiresIn as StringValue,
		});

		const refreshToken = this.jwtService.sign(payload, {
			secret: this.config.jwtRefreshSecret,
			expiresIn: this.config.jwtRefreshExpiresIn as StringValue,
		});

		return { accessToken, refreshToken };
	}

	verifyRefreshToken(token: string): JwtPayload {
		return this.jwtService.verify<JwtPayload>(token, {
			secret: this.config.jwtRefreshSecret,
		});
	}
}
