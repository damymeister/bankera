/*
  Warnings:

  - You are about to drop the column `transaction_type` on the `Speculative_Transaction` table. All the data in the column will be lost.
  - Added the required column `pip_price` to the `Speculative_Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Speculative_Transaction` DROP COLUMN `transaction_type`,
    ADD COLUMN `pip_price` DOUBLE NOT NULL,
    ADD COLUMN `stop_loss` DOUBLE NULL,
    ADD COLUMN `take_profit` DOUBLE NULL;
