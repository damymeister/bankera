-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `wallet_id` INTEGER NOT NULL,
    `forex_wallet_id` INTEGER NULL,
    `account_created_on` DATETIME(3) NOT NULL,
    `role_id` INTEGER NOT NULL,

    UNIQUE INDEX `User_wallet_id_key`(`wallet_id`),
    UNIQUE INDEX `User_forex_wallet_id_key`(`forex_wallet_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_title` VARCHAR(191) NOT NULL,
    `post_content` VARCHAR(191) NOT NULL,
    `posted_on` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `role_id` INTEGER NOT NULL,
    `role_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wallet` (
    `wallet_id` INTEGER NOT NULL AUTO_INCREMENT,
    `wallet_created_on` DATETIME(3) NOT NULL,

    PRIMARY KEY (`wallet_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Forex_Wallet` (
    `forex_wallet_id` INTEGER NOT NULL,
    `forex_wallet_created_on` DATETIME(3) NOT NULL,

    PRIMARY KEY (`forex_wallet_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Currency` (
    `currency_id` INTEGER NOT NULL AUTO_INCREMENT,
    `currency_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`currency_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Currency_Storage` (
    `currency_storage_id` INTEGER NOT NULL AUTO_INCREMENT,
    `currency_amount` DOUBLE NOT NULL,
    `currency_id` INTEGER NOT NULL,
    `wallet_id` INTEGER NOT NULL,

    PRIMARY KEY (`currency_storage_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Forex_Currency_Storage` (
    `forex_currency_storage_id` INTEGER NOT NULL,
    `forex_currency_id` INTEGER NOT NULL,
    `forex_currency_amount` DOUBLE NOT NULL,
    `forex_wallet_id` INTEGER NOT NULL,

    PRIMARY KEY (`forex_currency_storage_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Currency_Pair` (
    `currency_pair_id` INTEGER NOT NULL AUTO_INCREMENT,
    `sell_currency_id` INTEGER NOT NULL,
    `buy_currency_id` INTEGER NOT NULL,
    `conversion_value` DOUBLE NOT NULL,

    PRIMARY KEY (`currency_pair_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_to_User_Transaction` (
    `transaction_id` VARCHAR(191) NOT NULL,
    `wallet_sender_id` INTEGER NOT NULL,
    `wallet_recipient_id` INTEGER NOT NULL,
    `currency_pair_id` INTEGER NOT NULL,
    `inital_amount` DOUBLE NOT NULL,
    `converted_amount` DOUBLE NOT NULL,
    `transaction_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inner_Transaction` (
    `inner_transaction_id` VARCHAR(191) NOT NULL,
    `wallet_id` INTEGER NOT NULL,
    `currency_pair_id` INTEGER NOT NULL,
    `inital_amount` DOUBLE NOT NULL,
    `converted_amount` DOUBLE NOT NULL,
    `transaction_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`inner_transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `External_Transaction` (
    `external_transaction_id` VARCHAR(191) NOT NULL,
    `wallet_id` INTEGER NOT NULL,
    `currency_id` INTEGER NOT NULL,
    `bank_account` VARCHAR(191) NOT NULL,
    `transaction_amount` INTEGER NOT NULL,
    `transaction_commision` DOUBLE NOT NULL,
    `transaction_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`external_transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wallet_Forex_Wallet_Transaction` (
    `wallet_forex_wallet_transaction_id` INTEGER NOT NULL,
    `wallet_id` INTEGER NOT NULL,
    `forex_wallet_id` INTEGER NOT NULL,
    `currency_id` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `transaction_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`wallet_forex_wallet_transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Speculative_Transaction` (
    `speculative_transaction_id` INTEGER NOT NULL,
    `transaction_type` INTEGER NOT NULL,
    `currency_pair_id` INTEGER NOT NULL,
    `financial_leverage` INTEGER NOT NULL,
    `lots` DOUBLE NOT NULL,
    `entry_course_value` DOUBLE NOT NULL,
    `exit_course_value` DOUBLE NULL,
    `transaction_balance` DOUBLE NOT NULL,
    `entry_date` DATETIME(3) NOT NULL,
    `exit_date` DATETIME(3) NULL,
    `authors_profit` DOUBLE NOT NULL,

    PRIMARY KEY (`speculative_transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `Wallet`(`wallet_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_forex_wallet_id_fkey` FOREIGN KEY (`forex_wallet_id`) REFERENCES `Forex_Wallet`(`forex_wallet_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Currency_Storage` ADD CONSTRAINT `Currency_Storage_currency_id_fkey` FOREIGN KEY (`currency_id`) REFERENCES `Currency`(`currency_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Currency_Storage` ADD CONSTRAINT `Currency_Storage_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `Wallet`(`wallet_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Forex_Currency_Storage` ADD CONSTRAINT `Forex_Currency_Storage_forex_currency_id_fkey` FOREIGN KEY (`forex_currency_id`) REFERENCES `Currency`(`currency_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Forex_Currency_Storage` ADD CONSTRAINT `Forex_Currency_Storage_forex_wallet_id_fkey` FOREIGN KEY (`forex_wallet_id`) REFERENCES `Forex_Wallet`(`forex_wallet_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Currency_Pair` ADD CONSTRAINT `Currency_Pair_sell_currency_id_fkey` FOREIGN KEY (`sell_currency_id`) REFERENCES `Currency`(`currency_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Currency_Pair` ADD CONSTRAINT `Currency_Pair_buy_currency_id_fkey` FOREIGN KEY (`buy_currency_id`) REFERENCES `Currency`(`currency_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_to_User_Transaction` ADD CONSTRAINT `User_to_User_Transaction_wallet_sender_id_fkey` FOREIGN KEY (`wallet_sender_id`) REFERENCES `Wallet`(`wallet_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_to_User_Transaction` ADD CONSTRAINT `User_to_User_Transaction_wallet_recipient_id_fkey` FOREIGN KEY (`wallet_recipient_id`) REFERENCES `Wallet`(`wallet_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_to_User_Transaction` ADD CONSTRAINT `User_to_User_Transaction_currency_pair_id_fkey` FOREIGN KEY (`currency_pair_id`) REFERENCES `Currency_Pair`(`currency_pair_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inner_Transaction` ADD CONSTRAINT `Inner_Transaction_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `Wallet`(`wallet_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inner_Transaction` ADD CONSTRAINT `Inner_Transaction_currency_pair_id_fkey` FOREIGN KEY (`currency_pair_id`) REFERENCES `Currency_Pair`(`currency_pair_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `External_Transaction` ADD CONSTRAINT `External_Transaction_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `Wallet`(`wallet_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `External_Transaction` ADD CONSTRAINT `External_Transaction_currency_id_fkey` FOREIGN KEY (`currency_id`) REFERENCES `Currency`(`currency_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wallet_Forex_Wallet_Transaction` ADD CONSTRAINT `Wallet_Forex_Wallet_Transaction_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `Wallet`(`wallet_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wallet_Forex_Wallet_Transaction` ADD CONSTRAINT `Wallet_Forex_Wallet_Transaction_forex_wallet_id_fkey` FOREIGN KEY (`forex_wallet_id`) REFERENCES `Forex_Wallet`(`forex_wallet_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wallet_Forex_Wallet_Transaction` ADD CONSTRAINT `Wallet_Forex_Wallet_Transaction_currency_id_fkey` FOREIGN KEY (`currency_id`) REFERENCES `Currency`(`currency_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Speculative_Transaction` ADD CONSTRAINT `Speculative_Transaction_currency_pair_id_fkey` FOREIGN KEY (`currency_pair_id`) REFERENCES `Currency_Pair`(`currency_pair_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
