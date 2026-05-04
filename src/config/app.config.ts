import { ConfigType, registerAs } from "@nestjs/config";

export const appConfig = registerAs("app", () => ({
	nodeEnv: process.env.NODE_ENV,
	port: Number(process.env.PORT ?? 3000),
	csrfSecret: process.env.CSRF_SECRET as string,
	jwtSecret: process.env.JWT_SECRET as string,
	jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "15m",
	jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
	jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
	corsOrigin: process.env.CORS_ORIGIN ?? "*",
}));

export type AppConfig = ConfigType<typeof appConfig>;
