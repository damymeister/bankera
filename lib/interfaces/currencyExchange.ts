export default interface ICurrencyExchange {
    id: number,
    amount: number,
    currency_id: number,
    wallet_id: number,
    quoteCurrency: number,
    value: number,
    rate: number,
    converted_amount: number,
    currency_pair_id:number
}