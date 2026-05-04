import { ConsoleLogger, Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { doubleCsrf } from "csrf-csrf";
import { json } from "express";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter, ResponseInterceptor } from "./common";
import { type AppConfig, appConfig } from "./config";

async function main() {
	const app = await NestFactory.create(AppModule, {
		logger: new ConsoleLogger({
			prefix: "API",
			timestamp: true,
		}),
	});
	const { port, csrfSecret, nodeEnv } = app.get<AppConfig>(appConfig.KEY);
	const { doubleCsrfProtection } = doubleCsrf({
		getSecret: () => csrfSecret,
		getSessionIdentifier: (req) =>
			req.headers.authorization ?? req.socket.remoteAddress ?? "",
		cookieName: "__host-csrf",
		cookieOptions: {
			sameSite: "strict",
			secure: nodeEnv === "production",
			httpOnly: true,
			path: "/",
		},
		ignoredMethods: ["GET", "HEAD", "OPTIONS"],
		getCsrfTokenFromRequest: (req) => req.headers["x-csrf-token"] as string,
	});
	app.use(doubleCsrfProtection);
	const pipeCustomValidations = new ValidationPipe({
		whitelist: true,
		forbidNonWhitelisted: true,
		transform: true,
	});
	app.enableCors();
	app.use(json({ limit: "5mb" }));
	app.use(helmet());
	app.useGlobalPipes(pipeCustomValidations);
	app.useGlobalInterceptors(new ResponseInterceptor());
	app.useGlobalFilters(new GlobalExceptionFilter());

	const swaggerConfig = new DocumentBuilder()
		.setTitle("NestJS Template API")
		.setDescription("NestJS template — scalable API.")
		.setVersion("1.0")
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup("docs", app, document, {
		jsonDocumentUrl: "openapi.json",
		yamlDocumentUrl: "openapi.yaml",
		customSiteTitle: "NestJS Template API Docs",
		customCss: `
			.swagger-ui .topbar { display: none }
			.swagger-ui .info { margin: 24px 0 }
			.swagger-ui .scheme-container { padding: 16px 0 }
		`,
		swaggerOptions: {
			persistAuthorization: true,
			filter: true,
			deepLinking: true,
			displayRequestDuration: true,
			docExpansion: "none",
			defaultModelsExpandDepth: 2,
			tryItOutEnabled: true,
			syntaxHighlight: { activate: true, theme: "tomorrow-night" },
		},
	});

	await app.listen(port);
	Logger.debug(`Server running on http://localhost:${port}`, "EntryPoint");
}
main();
