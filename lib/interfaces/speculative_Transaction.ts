export interface SpeculativeTransaction {
    id?: number;
    forex_wallet_id: number;
    transaction_type: number;
    currency_pair_id: number;
    financial_leverage: number;
    lots: number;
    pip_price: number;
    entry_course_value: number;
    exit_course_value?: number;
    transaction_balance: number;
    entry_date: Date;
    exit_date?: Date;
    stop_loss?: number;
    take_profit?: number;
}

export interface SpeculativeTransactionEdit{
    id: number;
    forex_wallet_id: number;
    exit_course_value: number;
    exit_date: Date;
}
