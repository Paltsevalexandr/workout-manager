-- Names must be unique among active exercises only: soft-deleted rows map to NULL,
-- and MySQL doesn't treat NULLs as duplicates in a unique index.
-- Prisma can't express this, so it is maintained by hand.
CREATE UNIQUE INDEX `Exercise_active_name_key` ON `Exercise` ((IF(`deletedAt` IS NULL, `name`, NULL)));
