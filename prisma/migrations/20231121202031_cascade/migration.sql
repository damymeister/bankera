-- DropForeignKey
ALTER TABLE `Currency_History` DROP FOREIGN KEY `Currency_History_buy_currency_id_fkey`;

-- DropForeignKey
ALTER TABLE `Currency_History` DROP FOREIGN KEY `Currency_History_sell_currency_id_fkey`;

-- DropForeignKey
ALTER TABLE `Currency_Pair` DROP FOREIGN KEY `Currency_Pair_buy_currency_id_fkey`;

-- DropForeignKey
ALTER TABLE `Currency_Pair` DROP FOREIGN KEY `Currency_Pair_sell_currency_id_fkey`;

-- DropForeignKey
ALTER TABLE `Currency_Storage` DROP FOREIGN KEY `Currency_Storage_currency_id_fkey`;

-- DropForeignKey
ALTER TABLE `Currency_Storage` DROP FOREIGN KEY `Currency_Storage_wallet_id_fkey`;

-- DropForeignKey
ALTER TABLE `Forex_Currency_Storage` DROP FOREIGN KEY `Forex_Currency_Storage_forex_currency_id_fkey`;

-- DropForeignKey
ALTER TABLE `Forex_Currency_Storage` DROP FOREIGN KEY `Forex_Currency_Storage_forex_wallet_id_fkey`;

-- DropForeignKey
ALTER TABLE `Inner_Transaction` DROP FOREIGN KEY `Inner_Transaction_currency_pair_id_fkey`;

-- DropForeignKey
ALTER TABLE `Inner_Transaction` DROP FOREIGN KEY `Inner_Transaction_wallet_id_fkey`;

-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Speculative_Transaction` DROP FOREIGN KEY `Speculative_Transaction_currency_pair_id_fkey`;

-- DropForeignKey
ALTER TABLE `Speculative_Transaction` DROP FOREIGN KEY `Speculative_Transaction_forex_wallet_id_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_forex_wallet_id_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_wallet_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_to_User_Transaction` DROP FOREIGN KEY `User_to_User_Transaction_currency_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_to_User_Transaction` DROP FOREIGN KEY `User_to_User_Transaction_wallet_recipient_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_to_User_Transaction` DROP FOREIGN KEY `User_to_User_Transaction_wallet_sender_id_fkey`;

-- DropForeignKey
ALTER TABLE `Wallet_Forex_Wallet_Transaction` DROP FOREIGN KEY `Wallet_Forex_Wallet_Transaction_currency_id_fkey`;

-- DropForeignKey
ALTER TABLE `Wallet_Forex_Wallet_Transaction` DROP FOREIGN KEY `Wallet_Forex_Wallet_Transaction_forex_wallet_id_fkey`;

-- DropForeignKey
ALTER TABLE `Wallet_Forex_Wallet_Transaction` DROP FOREIGN KEY `Wallet_Forex_Wallet_Transaction_wallet_id_fkey`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `Wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_forex_wallet_id_fkey` FOREIGN KEY (`forex_wallet_id`) REFERENCES `Forex_Wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Currency_Storage` ADD CONSTRAINT `Currency_Storage_currency_id_fkey` FOREIGN KEY (`currency_id`) REFERENCES `Currency`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Currency_Storage` ADD CONSTRAINT `Currency_Storage_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `Wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Forex_Currency_Storage` ADD CONSTRAINT `Forex_Currency_Storage_forex_currency_id_fkey` FOREIGN KEY (`forex_currency_id`) REFERENCES `Currency`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Forex_Currency_Storage` ADD CONSTRAINT `Forex_Currency_Storage_forex_wallet_id_fkey` FOREIGN KEY (`forex_wallet_id`) REFERENCES `Forex_Wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Currency_Pair` ADD CONSTRAINT `Currency_Pair_sell_currency_id_fkey` FOREIGN KEY (`sell_currency_id`) REFERENCES `Currency`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Currency_Pair` ADD CONSTRAINT `Currency_Pair_buy_currency_id_fkey` FOREIGN KEY (`buy_currency_id`) REFERENCES `Currency`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Currency_History` ADD CONSTRAINT `Currency_History_sell_currency_id_fkey` FOREIGN KEY (`sell_currency_id`) REFERENCES `Currency`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Currency_History` ADD CONSTRAINT `Currency_History_buy_currency_id_fkey` FOREIGN KEY (`buy_currency_id`) REFERENCES `Currency`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_to_User_Transaction` ADD CONSTRAINT `User_to_User_Transaction_wallet_sender_id_fkey` FOREIGN KEY (`wallet_sender_id`) REFERENCES `Wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_to_User_Transaction` ADD CONSTRAINT `User_to_User_Transaction_wallet_recipient_id_fkey` FOREIGN KEY (`wallet_recipient_id`) REFERENCES `Wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_to_User_Transaction` ADD CONSTRAINT `User_to_User_Transaction_currency_id_fkey` FOREIGN KEY (`currency_id`) REFERENCES `Currency`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inner_Transaction` ADD CONSTRAINT `Inner_Transaction_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `Wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inner_Transaction` ADD CONSTRAINT `Inner_Transaction_currency_pair_id_fkey` FOREIGN KEY (`currency_pair_id`) REFERENCES `Currency_Pair`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wallet_Forex_Wallet_Transaction` ADD CONSTRAINT `Wallet_Forex_Wallet_Transaction_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `Wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wallet_Forex_Wallet_Transaction` ADD CONSTRAINT `Wallet_Forex_Wallet_Transaction_forex_wallet_id_fkey` FOREIGN KEY (`forex_wallet_id`) REFERENCES `Forex_Wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wallet_Forex_Wallet_Transaction` ADD CONSTRAINT `Wallet_Forex_Wallet_Transaction_currency_id_fkey` FOREIGN KEY (`currency_id`) REFERENCES `Currency`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Speculative_Transaction` ADD CONSTRAINT `Speculative_Transaction_currency_pair_id_fkey` FOREIGN KEY (`currency_pair_id`) REFERENCES `Currency_Pair`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Speculative_Transaction` ADD CONSTRAINT `Speculative_Transaction_forex_wallet_id_fkey` FOREIGN KEY (`forex_wallet_id`) REFERENCES `Forex_Wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
