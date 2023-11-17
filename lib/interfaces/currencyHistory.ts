export interface ICurrencyHistory {
    sell_currency_id: number,
    buy_currency_id: number,
    diffTotal?: number,
    invertedDiffTotal?: number,
    history: {
        conversion_value: number,
        invertedConversion?: number,
        date: Date,
        diffFuture?: number,
        diffPast?: number,
        invertedDiffFuture?: number,
        invertedDiffPast?: number
    }[]
}