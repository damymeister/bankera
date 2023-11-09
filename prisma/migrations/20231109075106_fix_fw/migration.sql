/*
  Warnings:

  - You are about to drop the column `forex_wallet_id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_forex_wallet_id_fkey`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `forex_wallet_id`;
