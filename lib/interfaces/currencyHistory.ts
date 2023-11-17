export interface ICurrencyHistory {
    sell_currency_id: number,
    buy_currency_id: number,
    diffTotal?: number,
    history: {
        conversion_value: number,
        date: Date,
        diffFuture?: number,
        diffPast?: number
    }[]
}