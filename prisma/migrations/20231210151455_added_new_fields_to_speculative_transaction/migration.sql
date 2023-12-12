/*
  Warnings:

  - You are about to alter the column `financial_leverage` on the `Speculative_Transaction` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - Added the required column `base_currency_id` to the `Speculative_Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deposit_amount` to the `Speculative_Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Speculative_Transaction` ADD COLUMN `base_currency_id` INTEGER NOT NULL,
    ADD COLUMN `deposit_amount` DOUBLE NOT NULL,
    ADD COLUMN `profit_loss` DOUBLE NULL,
    MODIFY `financial_leverage` DOUBLE NOT NULL;
