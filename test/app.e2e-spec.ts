import {
	INestApplication,
	ValidationPipe,
	VersioningType,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";
import { DATABASE_CONNECTION } from "../src/database/database.connection";

const mockDb = {
	execute: jest.fn().mockResolvedValue([{ "?column?": 1 }]),
};

describe("Health (e2e)", () => {
	let app: INestApplication<App>;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideProvider(DATABASE_CONNECTION)
			.useValue(mockDb)
			.compile();

		app = moduleFixture.createNestApplication();
		app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" });
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
			}),
		);
		await app.init();
	});

	afterAll(async () => {
		await app?.close();
	});

	it("GET /health → 200", () => {
		return request(app.getHttpServer()).get("/health").expect(200);
	});
});
