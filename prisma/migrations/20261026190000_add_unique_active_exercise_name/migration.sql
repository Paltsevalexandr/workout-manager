-- Names must be unique among active exercises only: the generated column holds the name
-- for active rows and NULL for soft-deleted ones, and MySQL doesn't treat NULLs as
-- duplicates in a unique index.
-- Prisma can't express generated columns, so the column is declared in schema.prisma
-- as `@ignore` and this migration is maintained by hand.
-- A functional index on the same expression would be simpler, but with
-- lower_case_table_names=2 (Windows) it makes MySQL store the table as `exercise`.
ALTER TABLE `Exercise` ADD COLUMN `activeName` VARCHAR(191)
    GENERATED ALWAYS AS (IF(`deletedAt` IS NULL, `name`, NULL)) VIRTUAL;
CREATE UNIQUE INDEX `Exercise_activeName_key` ON `Exercise` (`activeName`);
