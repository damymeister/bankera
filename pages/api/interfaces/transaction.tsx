interface InnerTransaction {
  id: number;
  wallet_id: number;
  currency_pair_id: number;
  inital_amount: number;
  converted_amount: number;
  transaction_date: string;
}

interface UserToUserTransaction {
  id: number;
  wallet_sender_id: number;
  wallet_recipient_id: number;
  currency_pair_id: number;
  inital_amount: number;
  converted_amount: number;
  transaction_date: string;
}

interface Data {
  innerTransactions: InnerTransaction[];
  userToUserTransactions: UserToUserTransaction[];
}