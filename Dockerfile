# ── Stage 1: deps ──────────────────────────────────────────────
FROM oven/bun:1.3-alpine AS deps

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ── Stage 2: dev ───────────────────────────────────────────────
FROM oven/bun:1.3-alpine AS dev

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000

CMD ["bun", "run", "dev"]

# ── Stage 3: builder ───────────────────────────────────────────
FROM oven/bun:1.3-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun run build

# ── Stage 3: runner ────────────────────────────────────────────
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Only copy production artefacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nestjs
USER nestjs

EXPOSE 3000

CMD ["node", "dist/main"]
