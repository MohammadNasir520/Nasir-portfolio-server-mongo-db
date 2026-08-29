# Nasir Portfolio — Backend API

Express + TypeScript + **Mongoose** REST API for the portfolio site.
Ported from the previous Prisma/PostgreSQL backend; all endpoint paths and
response shapes are preserved so the existing frontend works unchanged.

## Getting started

```bash
npm install
cp .env.example .env     # then fill in DATABASE_URL and the JWT secrets
npm run dev              # tsx watch on src/server.ts
```

| Script          | Purpose                          |
| --------------- | -------------------------------- |
| `npm run dev`   | Watch mode                       |
| `npm run build` | Compile TypeScript to `dist/`    |
| `npm start`     | Run the compiled server          |

## Layout

```
src/
  app.ts                  express app: cors, helmet, parsers, routes, errors
  server.ts               mongoose connect + http listen
  config/                 env-backed config object
  enums/                  ENUM_USER_ROLE
  errors/                 ApiError + mongoose/zod error translators
  interfaces/             shared response & pagination types
  shared/                 catchAsync, sendResponse, pick
  app/
    helpers/              jwt, pagination
    middlewares/          auth, validateRequest, rateLimit, globalErrorHandler
    routes/index.ts       route table
    modules/<name>/       interface | model | validation | service | controller | routes
api/index.ts              Vercel serverless entrypoint (cached mongoose connection)
```

Each module follows the same six-file shape, so adding a resource means copying
an existing folder and changing the schema.

## Endpoints

Base path: `/api/v1`

| Method                | Path                       | Auth         |
| --------------------- | -------------------------- | ------------ |
| POST                  | `/auth/signup`             | public       |
| POST                  | `/auth/signin`             | public       |
| GET / PATCH           | `/profile`                 | any logged-in|
| POST                  | `/admins`                  | super_admin  |
| GET                   | `/admins`, `/admins/:id`   | admin        |
| PATCH                 | `/admins/:id`              | super_admin  |
| DELETE                | `/admins/:id`              | admin        |
| GET                   | `/skills`, `/skills/:id`   | public       |
| POST/PATCH/DELETE     | `/skills`                  | admin        |
| GET                   | `/learning-projects`       | public       |
| POST/PATCH/DELETE     | `/learning-projects`       | admin        |
| GET                   | `/blogs`                   | public       |
| POST/PATCH/DELETE     | `/blogs`                   | admin        |
| GET                   | `/about`                   | public       |
| GET                   | `/banners`                 | public       |
| GET                   | `/social-links`            | public       |
| GET                   | `/achievements`            | public       |
| GET                   | `/extra-activities`        | public       |

The last five accept `POST` / `PATCH /:id` / `DELETE /:id` for admins.

`super_admin` inherits every `admin`-guarded route.

### Filtering

- `?searchTerm=` — case-insensitive regex over each module's searchable fields
  (`title` for most; `title` and `stack` for projects).
- `/learning-projects` also accepts `level`, `title`, `stack`, and repeatable
  `technology` (`?technology=react&technology=node` matches **any** of them).

### Response shapes

Handlers wrap payloads in `{ statusCode, success, message, data }`.

List endpoints put rows under `data.data` with `data.meta.total` — **except
`/learning-projects`, which nests its rows under `data.meta.data`**. That
asymmetry is inherited from the Prisma API and the frontend reads
`projects.meta.data`, so it is deliberate. See `IProjectsListResponse`.

## Auth

JWT in the `Authorization` header, as either `Bearer <token>` or the raw token
(the frontend sends it raw). Sign-in also sets an httpOnly `refreshToken`
cookie. Token payload is `{ userId, role }`.

Passwords are hashed with bcrypt by a `pre("save")` hook on the user model and
are never returned — `password` is `select: false` and stripped in `toJSON`.
Because hashing lives in that hook, updates that change a password must go
through `.save()` rather than `findByIdAndUpdate`.

## Notes on the Prisma port

- Postgres `uuid` ids became Mongo `ObjectId`s. Documents serialize with both
  `_id` and `id` so either works on the client.
- Collection names keep the old Prisma `@@map` values, typos included
  (`achivement`, `extraActivites`, `socialLink`, `banner`, `about`).
- `technology: { hasSome: [...] }` became `{ $in: [...] }`. `hpp` is configured
  to whitelist `technology` so repeated query params survive.
- `Level` enum → a string enum on the projects schema, still defaulting to
  `learning`.
- Prisma error handlers were replaced with mongoose `ValidationError` /
  `CastError` / duplicate-key (`E11000`) translators.
- `image1` / `image2` are optional (default `""`); they were required in Prisma
  but absent from the admin-create validation, so admin creation could not
  succeed.

## Deployment

`vercel.json` routes all traffic to `api/index.ts`, which reuses a cached
mongoose connection across warm invocations. Run `vercel link` to attach this
directory to the correct Vercel project before deploying.
# Nasir-portfolio-server-mongo-db
