/*
  Warnings:

  - Added the required column `forex_wallet_id` to the `Speculative_Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Speculative_Transaction` ADD COLUMN `forex_wallet_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Speculative_Transaction` ADD CONSTRAINT `Speculative_Transaction_forex_wallet_id_fkey` FOREIGN KEY (`forex_wallet_id`) REFERENCES `Forex_Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
