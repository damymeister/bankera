export interface IForexCurrencyStorage{
    id?:number,
    forex_currency_id: number,
    forex_currency_amount: number,
    forex_wallet_id: number,
}
export interface IEditForexCurrencyStorage {
    id: number,
    amount: number,
}