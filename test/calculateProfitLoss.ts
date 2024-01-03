import { SpeculativeTransactionProfitLossTest } from '@/lib/interfaces/speculative_Transaction';

export const calculateProfitLoss = (transaction: SpeculativeTransactionProfitLossTest) => {
    if(transaction.transaction_type > 2 && transaction.transaction_type < 1){
      return
    }
    if(transaction.exit_course_value == null){
      return
    }

    if(transaction.transaction_type == 1){
      return Math.round(((transaction.exit_course_value - transaction.entry_course_value)*transaction.transaction_balance))
    }

    return Math.round(((transaction.entry_course_value - transaction.exit_course_value )*transaction.transaction_balance))
  }
