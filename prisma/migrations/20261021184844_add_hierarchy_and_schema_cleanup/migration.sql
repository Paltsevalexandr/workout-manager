/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `target` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `WorkoutExercise` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetType` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MuscleGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PerformedSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PlannedSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Workout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `WorkoutExercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Category` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Exercise` DROP COLUMN `isDeleted`,
    DROP COLUMN `target`,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `parentId` INTEGER NULL,
    ADD COLUMN `targetType` ENUM('reps', 'duration') NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `MuscleGroup` ADD COLUMN `parentId` INTEGER NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `PerformedSession` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `PlannedSession` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Workout` ADD COLUMN `archivedAt` DATETIME(3) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `WorkoutExercise` DROP COLUMN `isDeleted`,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `position` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `WorkoutExercise_workoutId_position_idx` ON `WorkoutExercise`(`workoutId`, `position`);

-- AddForeignKey
ALTER TABLE `Exercise` ADD CONSTRAINT `Exercise_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Exercise`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MuscleGroup` ADD CONSTRAINT `MuscleGroup_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `MuscleGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
