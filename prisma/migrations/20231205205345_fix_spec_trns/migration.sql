/*
  Warnings:

  - Added the required column `transaction_type` to the `Speculative_Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Speculative_Transaction` ADD COLUMN `transaction_type` INTEGER NOT NULL;
