-- DropForeignKey
ALTER TABLE `WorkoutExercise` DROP FOREIGN KEY `WorkoutExercise_workoutId_fkey`;

-- DropIndex
DROP INDEX `WorkoutExercise_workoutId_fkey` ON `WorkoutExercise`;

-- CreateTable
CREATE TABLE `PerformedSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workoutId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,

    INDEX `PerformedSession_workoutId_date_idx`(`workoutId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PerformedExercise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionId` INTEGER NOT NULL,
    `workoutExerciseId` INTEGER NOT NULL,
    `sets` INTEGER NOT NULL,
    `target` INTEGER NOT NULL,
    `weight` DOUBLE NOT NULL,
    `rest` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkoutExercise` ADD CONSTRAINT `WorkoutExercise_workoutId_fkey` FOREIGN KEY (`workoutId`) REFERENCES `Workout`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PerformedSession` ADD CONSTRAINT `PerformedSession_workoutId_fkey` FOREIGN KEY (`workoutId`) REFERENCES `Workout`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PerformedExercise` ADD CONSTRAINT `PerformedExercise_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `PerformedSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PerformedExercise` ADD CONSTRAINT `PerformedExercise_workoutExerciseId_fkey` FOREIGN KEY (`workoutExerciseId`) REFERENCES `WorkoutExercise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
