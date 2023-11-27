export interface walletForexWalletTransactions{
    id?: number,
    wallet_id: number,
    currency_id: number,
    amount: number,
    transaction_date: Date,
    forex_wallet_id:number,
}
export interface userWalletForexWallet{
    wallet_id: number,
    forex_wallet_id: number,
}