import * as v from "valibot";

export const EnvSchema = v.object({
	NODE_ENV: v.picklist(["development", "production", "qa", "test"]),
	PORT: v.pipe(
		v.optional(v.string(), "3000"),
		v.transform(Number),
		v.integer(),
		v.minValue(1),
		v.maxValue(65535),
	),
	DATABASE_URL: v.pipe(v.string(), v.minLength(1)),
	CSRF_SECRET: v.pipe(v.string(), v.minLength(32)),
	JWT_SECRET: v.pipe(v.string(), v.minLength(32)),
	JWT_EXPIRES_IN: v.optional(v.string(), "15m"),
	JWT_REFRESH_SECRET: v.pipe(v.string(), v.minLength(32)),
	JWT_REFRESH_EXPIRES_IN: v.optional(v.string(), "7d"),
	CORS_ORIGIN: v.optional(v.string(), "*"),
});

export type Env = v.InferOutput<typeof EnvSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
	const result = v.safeParse(EnvSchema, config);

	if (!result.success) {
		const issues = result.issues
			.map((issue) => {
				const path = issue.path?.map((p) => p.key).join(".") ?? "unknown";
				return `  - ${path}: ${issue.message}`;
			})
			.join("\n");

		throw new Error(`Environment validation failed:\n${issues}`);
	}

	return result.output;
}
