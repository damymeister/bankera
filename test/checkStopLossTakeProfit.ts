import { SpeculativeTransactionTakeProfitStopLossTest } from '@/lib/interfaces/speculative_Transaction';

export const correctStopLossAndTakeProfit = (SpeculativeTransaction: SpeculativeTransactionTakeProfitStopLossTest) =>{
        if(SpeculativeTransaction.transaction_type === 1 && SpeculativeTransaction.stop_loss > SpeculativeTransaction.entry_course_value) return false
        if(SpeculativeTransaction.transaction_type === 2 && SpeculativeTransaction.stop_loss < SpeculativeTransaction.entry_course_value) return false
        if(SpeculativeTransaction.transaction_type === 1  && SpeculativeTransaction.take_profit < SpeculativeTransaction.entry_course_value) return false
        if(SpeculativeTransaction.transaction_type === 2  && SpeculativeTransaction.take_profit > SpeculativeTransaction.entry_course_value) return false
        
    return true
}