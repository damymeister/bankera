interface IinnerTransaction {
    id?:number,
    wallet_id:number,
    currency_pair_id:number;
    initial_amount: number,
    converted_amount: number,
    transaction_date: Date,
  }
