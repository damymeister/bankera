export default interface ICurrencyPair {
    id?: number,
    sell_currency_id: number,
    buy_currency_id: number,
    conversion_value: number,
}
