/*
  Warnings:

  - A unique constraint covering the columns `[sessionId,workoutExerciseId]` on the table `PerformedExercise` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `PlannedSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workoutId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,

    INDEX `PlannedSession_workoutId_date_idx`(`workoutId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlannedExercise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionId` INTEGER NOT NULL,
    `workoutExerciseId` INTEGER NOT NULL,
    `sets` INTEGER NOT NULL,
    `target` INTEGER NOT NULL,
    `weight` DOUBLE NOT NULL,
    `rest` INTEGER NOT NULL,

    UNIQUE INDEX `PlannedExercise_sessionId_workoutExerciseId_key`(`sessionId`, `workoutExerciseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `PerformedExercise_sessionId_workoutExerciseId_key` ON `PerformedExercise`(`sessionId`, `workoutExerciseId`);

-- AddForeignKey
ALTER TABLE `PlannedSession` ADD CONSTRAINT `PlannedSession_workoutId_fkey` FOREIGN KEY (`workoutId`) REFERENCES `Workout`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlannedExercise` ADD CONSTRAINT `PlannedExercise_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `PlannedSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlannedExercise` ADD CONSTRAINT `PlannedExercise_workoutExerciseId_fkey` FOREIGN KEY (`workoutExerciseId`) REFERENCES `WorkoutExercise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
