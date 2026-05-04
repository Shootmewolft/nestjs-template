process.env.NODE_ENV = process.env.NODE_ENV ?? "test";
process.env.PORT = process.env.PORT ?? "3001";
process.env.DATABASE_URL =
	process.env.DATABASE_URL ??
	// biome-ignore lint/security/noSecrets: testing environment variable, not a real secret
	"postgresql://postgres:postgres@localhost:5432/nestjs_test";
process.env.CSRF_SECRET =
	process.env.CSRF_SECRET ?? "test_csrf_secret_at_least_32_chars_long_xx";
process.env.JWT_SECRET =
	process.env.JWT_SECRET ?? "test_jwt_secret_at_least_32_chars_long_xxxx";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "15m";
process.env.JWT_REFRESH_SECRET =
	process.env.JWT_REFRESH_SECRET ??
	"test_refresh_secret_at_least_32_chars_long_x";
process.env.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN ?? "*";
