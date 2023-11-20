/*
  Warnings:

  - You are about to drop the column `converted_amount` on the `User_to_User_Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `currency_pair_id` on the `User_to_User_Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `inital_amount` on the `User_to_User_Transaction` table. All the data in the column will be lost.
  - Added the required column `amount` to the `User_to_User_Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency_id` to the `User_to_User_Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `User_to_User_Transaction` DROP FOREIGN KEY `User_to_User_Transaction_currency_pair_id_fkey`;

-- AlterTable
ALTER TABLE `User_to_User_Transaction` DROP COLUMN `converted_amount`,
    DROP COLUMN `currency_pair_id`,
    DROP COLUMN `inital_amount`,
    ADD COLUMN `amount` DOUBLE NOT NULL,
    ADD COLUMN `currency_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `User_to_User_Transaction` ADD CONSTRAINT `User_to_User_Transaction_currency_id_fkey` FOREIGN KEY (`currency_id`) REFERENCES `Currency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
