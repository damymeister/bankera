/*
  Warnings:

  - You are about to drop the column `authors_profit` on the `Speculative_Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Post` ADD COLUMN `image_href` TEXT NULL;

-- AlterTable
ALTER TABLE `Speculative_Transaction` DROP COLUMN `authors_profit`;

-- CreateTable
CREATE TABLE `Currency_History` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sell_currency_id` INTEGER NOT NULL,
    `buy_currency_id` INTEGER NOT NULL,
    `conversion_value` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL,

    INDEX `Currency_History_sell_currency_id_buy_currency_id_idx`(`sell_currency_id`, `buy_currency_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Currency_History` ADD CONSTRAINT `Currency_History_sell_currency_id_fkey` FOREIGN KEY (`sell_currency_id`) REFERENCES `Currency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Currency_History` ADD CONSTRAINT `Currency_History_buy_currency_id_fkey` FOREIGN KEY (`buy_currency_id`) REFERENCES `Currency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
