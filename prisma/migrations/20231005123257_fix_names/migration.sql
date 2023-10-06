/*
  Warnings:

  - The primary key for the `Currency` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `currency_id` on the `Currency` table. All the data in the column will be lost.
  - You are about to drop the column `currency_name` on the `Currency` table. All the data in the column will be lost.
  - The primary key for the `Currency_Pair` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `currency_pair_id` on the `Currency_Pair` table. All the data in the column will be lost.
  - The primary key for the `Currency_Storage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `currency_amount` on the `Currency_Storage` table. All the data in the column will be lost.
  - You are about to drop the column `currency_storage_id` on the `Currency_Storage` table. All the data in the column will be lost.
  - The primary key for the `External_Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `external_transaction_id` on the `External_Transaction` table. All the data in the column will be lost.
  - The primary key for the `Forex_Currency_Storage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `forex_currency_storage_id` on the `Forex_Currency_Storage` table. All the data in the column will be lost.
  - The primary key for the `Forex_Wallet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `forex_wallet_created_on` on the `Forex_Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `forex_wallet_id` on the `Forex_Wallet` table. All the data in the column will be lost.
  - The primary key for the `Inner_Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `inner_transaction_id` on the `Inner_Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `post_content` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `post_title` on the `Post` table. All the data in the column will be lost.
  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role_id` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `role_name` on the `Role` table. All the data in the column will be lost.
  - The primary key for the `Speculative_Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `speculative_transaction_id` on the `Speculative_Transaction` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - The primary key for the `User_to_User_Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `transaction_id` on the `User_to_User_Transaction` table. All the data in the column will be lost.
  - The primary key for the `Wallet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `wallet_created_on` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `wallet_id` on the `Wallet` table. All the data in the column will be lost.
  - The primary key for the `Wallet_Forex_Wallet_Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `wallet_forex_wallet_transaction_id` on the `Wallet_Forex_Wallet_Transaction` table. All the data in the column will be lost.
  - Added the required column `id` to the `Currency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Currency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Currency_Pair` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Currency_Storage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Currency_Storage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `External_Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Forex_Currency_Storage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_on` to the `Forex_Wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Forex_Wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Inner_Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Speculative_Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `User_to_User_Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_on` to the `Wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Wallet_Forex_Wallet_Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Currency_Pair` DROP FOREIGN KEY `Currency_Pair_buy_currency_id_fkey`;

-- DropForeignKey
ALTER TABLE `Currency_Pair` DROP FOREIGN KEY `Currency_Pair_sell_currency_id_fkey`;

-- DropForeignKey
ALTER TABLE `Currency_Storage` DROP FOREIGN KEY `Currency_Storage_currency_id_fkey`;

-- DropForeignKey
ALTER TABLE `Currency_Storage` DROP FOREIGN KEY `Currency_Storage_wallet_id_fkey`;

-- DropForeignKey
ALTER TABLE `External_Transaction` DROP FOREIGN KEY `External_Transaction_currency_id_fkey`;

-- DropForeignKey
ALTER TABLE `External_Transaction` DROP FOREIGN KEY `External_Transaction_wallet_id_fkey`;

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
ALTER TABLE `User` DROP FOREIGN KEY `User_forex_wallet_id_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_wallet_id_fkey`;

-- DropForeignKey
ALTER TABLE `User_to_User_Transaction` DROP FOREIGN KEY `User_to_User_Transaction_currency_pair_id_fkey`;

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

-- AlterTable
ALTER TABLE `Currency` DROP PRIMARY KEY,
    DROP COLUMN `currency_id`,
    DROP COLUMN `currency_name`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Currency_Pair` DROP PRIMARY KEY,
    DROP COLUMN `currency_pair_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Currency_Storage` DROP PRIMARY KEY,
    DROP COLUMN `currency_amount`,
    DROP COLUMN `currency_storage_id`,
    ADD COLUMN `amount` DOUBLE NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `External_Transaction` DROP PRIMARY KEY,
    DROP COLUMN `external_transaction_id`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Forex_Currency_Storage` DROP PRIMARY KEY,
    DROP COLUMN `forex_currency_storage_id`,
    ADD COLUMN `id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Forex_Wallet` DROP PRIMARY KEY,
    DROP COLUMN `forex_wallet_created_on`,
    DROP COLUMN `forex_wallet_id`,
    ADD COLUMN `created_on` DATETIME(3) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Inner_Transaction` DROP PRIMARY KEY,
    DROP COLUMN `inner_transaction_id`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Post` DROP COLUMN `post_content`,
    DROP COLUMN `post_title`,
    ADD COLUMN `content` TEXT NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Role` DROP PRIMARY KEY,
    DROP COLUMN `role_id`,
    DROP COLUMN `role_name`,
    ADD COLUMN `id` INTEGER NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Speculative_Transaction` DROP PRIMARY KEY,
    DROP COLUMN `speculative_transaction_id`,
    ADD COLUMN `id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User_to_User_Transaction` DROP PRIMARY KEY,
    DROP COLUMN `transaction_id`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Wallet` DROP PRIMARY KEY,
    DROP COLUMN `wallet_created_on`,
    DROP COLUMN `wallet_id`,
    ADD COLUMN `created_on` DATETIME(3) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Wallet_Forex_Wallet_Transaction` DROP PRIMARY KEY,
    DROP COLUMN `wallet_forex_wallet_transaction_id`,
    ADD COLUMN `id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `Wallet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_forex_wallet_id_fkey` FOREIGN KEY (`forex_wallet_id`) REFERENCES `Forex_Wallet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Currency_Storage` ADD CONSTRAINT `Currency_Storage_currency_id_fkey` FOREIGN KEY (`currency_id`) REFERENCES `Currency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Currency_Storage` ADD CONSTRAINT `Currency_Storage_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Forex_Currency_Storage` ADD CONSTRAINT `Forex_Currency_Storage_forex_currency_id_fkey` FOREIGN KEY (`forex_currency_id`) REFERENCES `Currency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Forex_Currency_Storage` ADD CONSTRAINT `Forex_Currency_Storage_forex_wallet_id_fkey` FOREIGN KEY (`forex_wallet_id`) REFERENCES `Forex_Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Currency_Pair` ADD CONSTRAINT `Currency_Pair_sell_currency_id_fkey` FOREIGN KEY (`sell_currency_id`) REFERENCES `Currency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Currency_Pair` ADD CONSTRAINT `Currency_Pair_buy_currency_id_fkey` FOREIGN KEY (`buy_currency_id`) REFERENCES `Currency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_to_User_Transaction` ADD CONSTRAINT `User_to_User_Transaction_wallet_sender_id_fkey` FOREIGN KEY (`wallet_sender_id`) REFERENCES `Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_to_User_Transaction` ADD CONSTRAINT `User_to_User_Transaction_wallet_recipient_id_fkey` FOREIGN KEY (`wallet_recipient_id`) REFERENCES `Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_to_User_Transaction` ADD CONSTRAINT `User_to_User_Transaction_currency_pair_id_fkey` FOREIGN KEY (`currency_pair_id`) REFERENCES `Currency_Pair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inner_Transaction` ADD CONSTRAINT `Inner_Transaction_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inner_Transaction` ADD CONSTRAINT `Inner_Transaction_currency_pair_id_fkey` FOREIGN KEY (`currency_pair_id`) REFERENCES `Currency_Pair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `External_Transaction` ADD CONSTRAINT `External_Transaction_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `External_Transaction` ADD CONSTRAINT `External_Transaction_currency_id_fkey` FOREIGN KEY (`currency_id`) REFERENCES `Currency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wallet_Forex_Wallet_Transaction` ADD CONSTRAINT `Wallet_Forex_Wallet_Transaction_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wallet_Forex_Wallet_Transaction` ADD CONSTRAINT `Wallet_Forex_Wallet_Transaction_forex_wallet_id_fkey` FOREIGN KEY (`forex_wallet_id`) REFERENCES `Forex_Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wallet_Forex_Wallet_Transaction` ADD CONSTRAINT `Wallet_Forex_Wallet_Transaction_currency_id_fkey` FOREIGN KEY (`currency_id`) REFERENCES `Currency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Speculative_Transaction` ADD CONSTRAINT `Speculative_Transaction_currency_pair_id_fkey` FOREIGN KEY (`currency_pair_id`) REFERENCES `Currency_Pair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
