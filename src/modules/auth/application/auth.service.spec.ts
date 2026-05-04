import { JwtService } from "@nestjs/jwt";
import { Test, type TestingModule } from "@nestjs/testing";
import { appConfig } from "@/config";
import { AuthService } from "./auth.service";

const mockConfig = {
	jwtSecret: "test_jwt_secret_at_least_32_chars_long_xx",
	jwtExpiresIn: "15m",
	jwtRefreshSecret: "test_refresh_secret_at_least_32_chars_xx",
	jwtRefreshExpiresIn: "7d",
};

describe("AuthService", () => {
	let service: AuthService;
	let jwtService: JwtService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				JwtService,
				{ provide: appConfig.KEY, useValue: mockConfig },
			],
		}).compile();

		service = module.get(AuthService);
		jwtService = module.get(JwtService);
	});

	it("generateTokens returns accessToken and refreshToken", () => {
		const payload = { sub: "user-1", email: "user@example.com" };
		const { accessToken, refreshToken } = service.generateTokens(payload);

		expect(typeof accessToken).toBe("string");
		expect(typeof refreshToken).toBe("string");
		expect(accessToken).not.toBe(refreshToken);
	});

	it("accessToken contains the correct sub claim", () => {
		const payload = { sub: "user-1", email: "user@example.com" };
		const { accessToken } = service.generateTokens(payload);

		const decoded = jwtService.decode<{ sub: string }>(accessToken);
		expect(decoded.sub).toBe("user-1");
	});

	it("verifyRefreshToken returns the original payload", () => {
		const payload = { sub: "user-2", email: "another@example.com" };
		const { refreshToken } = service.generateTokens(payload);

		const verified = service.verifyRefreshToken(refreshToken);
		expect(verified.sub).toBe("user-2");
		expect(verified.email).toBe("another@example.com");
	});

	it("verifyRefreshToken throws on tampered token", () => {
		expect(() => service.verifyRefreshToken("invalid.token.here")).toThrow();
	});
});
