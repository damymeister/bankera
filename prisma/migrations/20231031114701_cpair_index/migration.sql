-- CreateIndex
CREATE INDEX `Currency_Pair_sell_currency_id_buy_currency_id_idx` ON `Currency_Pair`(`sell_currency_id`, `buy_currency_id`);
