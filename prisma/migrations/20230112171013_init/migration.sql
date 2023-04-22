/*
  Warnings:

  - Added the required column `householdId` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Unit` ADD COLUMN `householdId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Unit` ADD CONSTRAINT `Unit_householdId_fkey` FOREIGN KEY (`householdId`) REFERENCES `Household`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
