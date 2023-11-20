export interface ICurrencyNameBalance {
    balance: number,
    currency: string,
}
export interface IUserTransactionValueTypes{
    amountToChange:number,
    currencyToSend:number,
}

export interface IUserTransaction{
    id?: number,
    wallet_sender_id: number,
    wallet_recipient_id: number,
    currency_id: number,
    amount: number,
    transaction_date: Date,
}
