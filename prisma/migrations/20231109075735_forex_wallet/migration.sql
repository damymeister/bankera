/*
  Warnings:

  - Added the required column `forex_wallet_id` to the `Forex_Currency_Storage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forex_wallet_id` to the `Speculative_Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forex_wallet_id` to the `Wallet_Forex_Wallet_Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Forex_Currency_Storage` ADD COLUMN `forex_wallet_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Speculative_Transaction` ADD COLUMN `forex_wallet_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Wallet_Forex_Wallet_Transaction` ADD COLUMN `forex_wallet_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Forex_Currency_Storage` ADD CONSTRAINT `Forex_Currency_Storage_forex_wallet_id_fkey` FOREIGN KEY (`forex_wallet_id`) REFERENCES `Forex_Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wallet_Forex_Wallet_Transaction` ADD CONSTRAINT `Wallet_Forex_Wallet_Transaction_forex_wallet_id_fkey` FOREIGN KEY (`forex_wallet_id`) REFERENCES `Forex_Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Speculative_Transaction` ADD CONSTRAINT `Speculative_Transaction_forex_wallet_id_fkey` FOREIGN KEY (`forex_wallet_id`) REFERENCES `Forex_Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
