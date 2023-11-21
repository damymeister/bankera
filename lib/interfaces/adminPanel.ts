export interface IInnerTransaction {
    id: number,
    wallet_id: number,
    currency_pair_id: number,
    inital_amount: number,
    converted_amount: number,
    transaction_date: string,
}

export interface IUserToUserTransaction {
    id: number,
    wallet_sender_id: number,
    wallet_recipient_id: number,
    currency_id: number,
    amount: number,
    transaction_date: string,
}

export interface ITransactionData {
    innerTransactions: IInnerTransaction[],
    userToUserTransactions: IUserToUserTransaction[],
}