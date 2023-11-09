/*
  Warnings:

  - You are about to drop the column `forex_wallet_id` on the `Forex_Currency_Storage` table. All the data in the column will be lost.
  - You are about to drop the column `forex_wallet_id` on the `Speculative_Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `forex_wallet_id` on the `Wallet_Forex_Wallet_Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[forex_wallet_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Forex_Currency_Storage` DROP FOREIGN KEY `Forex_Currency_Storage_forex_wallet_id_fkey`;

-- DropForeignKey
ALTER TABLE `Speculative_Transaction` DROP FOREIGN KEY `Speculative_Transaction_forex_wallet_id_fkey`;

-- DropForeignKey
ALTER TABLE `Wallet_Forex_Wallet_Transaction` DROP FOREIGN KEY `Wallet_Forex_Wallet_Transaction_forex_wallet_id_fkey`;

-- AlterTable
ALTER TABLE `Forex_Currency_Storage` DROP COLUMN `forex_wallet_id`;

-- AlterTable
ALTER TABLE `Forex_Wallet` MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT;

-- AlterTable
ALTER TABLE `Speculative_Transaction` DROP COLUMN `forex_wallet_id`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `forex_wallet_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `Wallet_Forex_Wallet_Transaction` DROP COLUMN `forex_wallet_id`;

-- CreateIndex
CREATE UNIQUE INDEX `User_forex_wallet_id_key` ON `User`(`forex_wallet_id`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_forex_wallet_id_fkey` FOREIGN KEY (`forex_wallet_id`) REFERENCES `Forex_Wallet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
