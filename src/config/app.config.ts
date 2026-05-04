import { ConfigType, registerAs } from "@nestjs/config";

export const appConfig = registerAs("app", () => ({
	nodeEnv: process.env.NODE_ENV,
	port: Number(process.env.PORT ?? 3000),
	csrfSecret: process.env.CSRF_SECRET as string,
}));

export type AppConfig = ConfigType<typeof appConfig>;
