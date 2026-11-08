-- Names must be unique among workouts that aren't in the trash (archived ones count):
-- the generated column holds the name for such rows and NULL for soft-deleted ones,
-- and MySQL doesn't treat NULLs as duplicates in a unique index.
-- Prisma can't express generated columns, so the column is declared in schema.prisma
-- as `@ignore` and this migration is maintained by hand.
ALTER TABLE `Workout` ADD COLUMN `activeName` VARCHAR(191)
    GENERATED ALWAYS AS (IF(`deletedAt` IS NULL, `name`, NULL)) VIRTUAL;

CREATE UNIQUE INDEX `Workout_activeName_key` ON `Workout`(`activeName`);

