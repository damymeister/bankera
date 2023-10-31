/*
  Warnings:

  - A unique constraint covering the columns `[sell_currency_id,buy_currency_id]` on the table `Currency_Pair` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Currency_Pair_sell_currency_id_buy_currency_id_key` ON `Currency_Pair`(`sell_currency_id`, `buy_currency_id`);
