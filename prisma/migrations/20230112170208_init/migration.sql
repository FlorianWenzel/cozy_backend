/*
  Warnings:

  - Added the required column `abbreviation` to the `Unit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Unit` ADD COLUMN `abbreviation` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;
