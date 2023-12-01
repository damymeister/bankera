export interface IUserTransaction{
    userToUserTransaction: {
        id?: number,
        wallet_sender_id: number,
        wallet_recipient_id: number,
        currency_id: number,
        amount: number,
        transaction_date: Date,
    },
    withDrawData: IWithDrawData,
    dataUserToSend: IDataUserToSend
}
export interface IWithDrawData {
    id: number,
    amount: number,
}

export interface IDataUserToSend {
    wallet_id: number,
    currency_id: number,
    amount: number,
}

export interface ICurrencyNameBalance {
    balance: number,
    currency: string,
}

export interface IUserTransactionValueTypes{
    amountToChange:number,
    currencyToSend:number,
}
