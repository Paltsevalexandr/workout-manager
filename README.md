# Workout Manager

A web app for planning workouts, logging what you actually did, and keeping a history of it.
Built with Next.js, TypeScript, Prisma and MySQL.

> **Status: work in progress.** This project is not finished and I am actively working on it.
> The backend (data layer and Server Actions) is done; the frontend is being moved from mock data
> to the real database page by page. Expect rough edges and unfinished screens. See [Roadmap](#roadmap).

## What it does

- **Exercises**: a catalog of exercises with categories, muscle groups (a two-level tree) and
  parent/child relationships (e.g. a variation of another exercise). Target is either reps or duration.
- **Workouts**: named lists of ordered exercises. A workout can be archived, restored, or deleted.
- **Sessions**: every workout can have *planned* sessions (what you intend to do) and
  *performed* sessions (what you actually did: sets, target, weight, rest per exercise).
- **Trash**: exercises and workouts are soft-deleted so history stays intact; permanent removal
  only when nothing references them.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Actions), React 19 |
| Language | TypeScript (strict) |
| Database | MySQL 8, Prisma 7 with the MariaDB driver adapter |
| Validation | Zod 4 |
| Styling | SCSS modules, Tailwind CSS 4 |
| Tooling | ESLint (including type-aware `no-floating-promises` on the data layer) |

## Architecture

```
app/        Next.js routes, UI components, Server Actions (input validation with Zod)
data/       Data access layer: all database reads and writes live here
lib/        Shared helpers (Prisma client, mutation runner for Server Actions)
prisma/     Schema, hand-reviewed migrations, seed
```

Some design decisions worth a look:

- **Data access layer (`data/`)**: the only place that talks to the database. Functions return
  plain DTOs and throw a `DataError` for expected failures (e.g. "name already taken"), which
  Server Actions turn into messages for the UI; unexpected errors are rethrown.
- **Unique names without race conditions**: active exercise and workout names are kept unique by
  a unique index over a generated (virtual) column, created in a hand-written migration.
  A violation is converted into a user-facing error, so two simultaneous requests cannot both succeed.
- **Atomic updates**: multi-step changes (e.g. updating a workout with its exercises, or replacing
  the exercises of a session) run in a transaction and take the row lock first (`updateMany` + count
  check), so concurrent deletes and updates give a clean error instead of corrupt data.
- **Soft delete with history**: sessions reference workout exercise rows, so removed rows and
  deleted workouts are marked with `deletedAt` and past sessions stay readable.
- **Server-only code**: data modules use `server-only`, so they cannot leak into client bundles.

## Getting started

Requirements: Node.js 20+ and MySQL 8.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```
   DATABASE_URL="mysql://USER:PASSWORD@127.0.0.1:3306/workout_manager"
   ```

   The database and the user must already exist. Use `utf8mb4` with a `_unicode_ci` collation.

3. Apply migrations and generate the Prisma client:

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

   Use `migrate deploy`, not `db push`: some columns (the generated name columns) are created
   by hand-written SQL in the migrations and Prisma cannot describe them in the schema.

4. Optionally load sample data (categories, muscle groups, a few exercises):

   ```bash
   npx prisma db seed
   ```

5. Run the app:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

Other scripts: `npm run build`, `npm run lint`.

## Current state

| Part | State |
| --- | --- |
| Data layer: exercises, workouts, planned and performed sessions | Done, checked with scripts against a scratch database |
| Server Actions: exercises | Done and wired to the UI |
| Server Actions: workouts, planned and performed sessions | Written (Zod validation); not wired to the UI yet |
| Exercises page | Uses the real database |
| Workouts and home pages | Still use in-memory mock data, being migrated |
| Automated tests | Not added yet |

## Roadmap

- Replace the mock data providers in the UI with real queries and the new Server Actions
  (workouts, planned and performed sessions).
- Trash screen: restore deleted items, scheduled permanent removal after 30 days.
- Authentication, with data and unique names scoped per user.
- Automated tests and a Docker setup for a reproducible MySQL environment.
