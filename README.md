# NestJS Template

Base template para APIs REST con NestJS, PostgreSQL y Drizzle ORM. Clonalo, adaptalo y úsalo como punto de partida para cada proyecto.

## Stack

- **Runtime**: Node.js 24 / Bun 1.3
- **Framework**: NestJS 11
- **Base de datos**: PostgreSQL 17 + Drizzle ORM
- **Validación**: class-validator + Valibot (env)
- **Autenticación**: JWT (access + refresh) via passport-jwt
- **Seguridad**: Helmet, CSRF (csrf-csrf), Rate limiting, CORS configurable
- **Docs**: Swagger / OpenAPI (JSON + YAML)
- **Linting/Formato**: Biome
- **Docker**: Multi-stage build (dev / builder / runner)

## Estructura

```
src/
├── common/
│   ├── filters/          # GlobalExceptionFilter
│   ├── interceptors/     # ResponseInterceptor, LoggingInterceptor
│   ├── middleware/        # RequestIdMiddleware
│   ├── pagination/        # PaginationDto, PaginationService, PaginationModule
│   └── types/            # ApiResponse, PaginatedApiResponse, ApiErrorResponse
├── config/               # Variables de entorno tipadas con Valibot
├── database/             # DatabaseModule, DrizzleDB, schema
└── modules/
    ├── auth/             # JwtStrategy, JwtRefreshStrategy, JwtAuthGuard, @Public()
    ├── health/           # Health check (DB)
    └── users/            # Módulo de ejemplo con arquitectura completa
        ├── application/  # UsersService
        ├── domain/       # UserEntity, IUserRepository
        ├── infrastructure/database/  # users.schema.ts, UsersRepository
        └── presentation/http/        # UsersController, DTOs
```

## Primeros pasos

### 1. Clonar y configurar el entorno

```bash
cp .env.example .env
# Edita .env con tus valores reales
```

Genera secrets seguros:

```bash
openssl rand -hex 32  # para CSRF_SECRET, JWT_SECRET, JWT_REFRESH_SECRET
```

### 2. Instalar dependencias

```bash
bun install
```

### 3. Levantar la base de datos

```bash
bun run docker:db
```

### 4. Ejecutar migraciones

```bash
bun run push
```

### 5. Iniciar en desarrollo

```bash
bun run dev
```

La API estará disponible en `http://localhost:3000`.
Swagger: `http://localhost:3000/docs`

## Scripts

| Script | Descripción |
|---|---|
| `bun run dev` | Modo watch (desarrollo) |
| `bun run build` | Compila a `dist/` |
| `bun run prod` | Ejecuta `dist/main.js` |
| `bun run test` | Tests unitarios |
| `bun run test:e2e` | Tests e2e |
| `bun run test:cov` | Cobertura |
| `bun run generate` | Genera migraciones Drizzle |
| `bun run migrate` | Aplica migraciones |
| `bun run push` | `generate` + `migrate` |
| `bun run lint` | Linting con Biome |
| `bun run check` | Lint + formato con Biome |

## Docker

```bash
# Levantar todo (API + Postgres) en modo dev
bun run docker:dev

# Solo la base de datos
bun run docker:db

# Producción
bun run docker:prod

# Ver logs de la API
bun run docker:logs
```

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `NODE_ENV` | `development` \| `production` \| `qa` | — |
| `PORT` | Puerto HTTP | `3000` |
| `DATABASE_URL` | Connection string PostgreSQL | — |
| `CSRF_SECRET` | Secret para CSRF (mín. 32 chars) | — |
| `JWT_SECRET` | Secret para access tokens (mín. 32 chars) | — |
| `JWT_EXPIRES_IN` | Expiración del access token | `15m` |
| `JWT_REFRESH_SECRET` | Secret para refresh tokens (mín. 32 chars) | — |
| `JWT_REFRESH_EXPIRES_IN` | Expiración del refresh token | `7d` |
| `CORS_ORIGIN` | Orígenes permitidos, separados por coma, o `*` | `*` |

Ver `.env.example` para referencia completa.

## Autenticación

Todas las rutas están protegidas por `JwtAuthGuard` de forma global. Para rutas públicas usa el decorator `@Public()`:

```ts
import { Public } from '@modules/auth/decorators/public.decorator';

@Public()
@Get('ping')
ping() { return 'pong'; }
```

Para acceder al usuario autenticado:

```ts
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import type { JwtPayload } from '@modules/auth/domain/jwt-payload.interface';

@Get('me')
getMe(@CurrentUser() user: JwtPayload) {
  return user;
}
```

`AuthService.generateTokens(payload)` genera el par access/refresh token.

## Crear un nuevo módulo

Sigue el patrón del módulo `users/`:

```
src/modules/<nombre>/
├── application/          # <Nombre>Service
├── domain/               # entidad, interface de repositorio
├── infrastructure/database/  # *.schema.ts, *.repository.ts
└── presentation/http/    # controller, DTOs
```

Registra el schema en `src/database/database.connection.ts`:

```ts
import { tuTabla } from '@modules/<nombre>/infrastructure/database/<nombre>.schema';
export const schema = { users, tuTabla };
```

## Respuestas estándar

Todas las respuestas siguen el mismo formato:

```jsonc
// Éxito
{ "success": true, "data": { ... }, "meta": { "timestamp": "..." } }

// Paginado
{ "success": true, "data": [...], "meta": { "timestamp": "...", "pagination": { ... } }, "links": { ... } }

// Error
{ "success": false, "error": { "code": "NOT_FOUND", "message": "..." }, "meta": { "timestamp": "..." } }
```

## Versionado

Las rutas están versionadas por URI con prefijo `v1` por defecto:

```
GET /v1/users
GET /v1/health  (sin versión, @Public)
```

Para cambiar la versión de un controlador:

```ts
@Controller({ path: 'users', version: '2' })
```

## Licencia

MIT
