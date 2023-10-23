/*
  Warnings:

  - You are about to drop the `External_Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `External_Transaction` DROP FOREIGN KEY `External_Transaction_currency_id_fkey`;

-- DropForeignKey
ALTER TABLE `External_Transaction` DROP FOREIGN KEY `External_Transaction_wallet_id_fkey`;

-- DropTable
DROP TABLE `External_Transaction`;
