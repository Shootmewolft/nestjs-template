import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { type AppConfig, appConfig } from "@/config";
import type { JwtRefreshPayload } from "../domain/jwt-payload.interface";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	"jwt-refresh",
) {
	constructor(@Inject(appConfig.KEY) config: AppConfig) {
		super({
			jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
			ignoreExpiration: false,
			secretOrKey: config.jwtRefreshSecret,
			passReqToCallback: true,
		});
	}

	validate(
		req: { body: { refreshToken: string } },
		payload: JwtRefreshPayload,
	): JwtRefreshPayload {
		return {
			...payload,
			refreshToken: req.body.refreshToken,
		};
	}
}
