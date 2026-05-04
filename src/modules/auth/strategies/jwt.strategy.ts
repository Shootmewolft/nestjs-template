import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { type AppConfig, appConfig } from "@/config";
import type { JwtPayload } from "../domain/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(@Inject(appConfig.KEY) config: AppConfig) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.jwtSecret,
		});
	}

	validate(payload: JwtPayload): JwtPayload {
		return { sub: payload.sub, email: payload.email };
	}
}
