import { SpeculativeTransactionTakeProfitStopLossTest } from '@/lib/interfaces/speculative_Transaction';
import { correctStopLossAndTakeProfit } from './checkStopLossTakeProfit';
import {describe, expect, test} from '@jest/globals';

const firstTestObject : SpeculativeTransactionTakeProfitStopLossTest = {
    transaction_type: 1,
    entry_course_value: 1.07,
    stop_loss: 1.09,
    take_profit: 1.08,
}

const secondTestObject : SpeculativeTransactionTakeProfitStopLossTest = {
    transaction_type: 1,
    entry_course_value: 4.33,
    stop_loss: 4.31,
    take_profit: 4.35,
}

const thirdTestObject : SpeculativeTransactionTakeProfitStopLossTest = {
    transaction_type: 2,
    entry_course_value: 3.35,
    stop_loss: 3.50,
    take_profit: 3.38,
}

const fourthTestObject : SpeculativeTransactionTakeProfitStopLossTest = {
    transaction_type: 2,
    entry_course_value: 2.21,
    stop_loss: 2.23,
    take_profit: 2.19,
}

describe('Stop loss and Take Profit data test', () => {
    test('Test Buying transaction', () => {
        expect(correctStopLossAndTakeProfit(firstTestObject)).toBe(false)
        expect(correctStopLossAndTakeProfit(secondTestObject)).toBe(true)
    })
    test('Test Selling Transaction', () => {
        expect(correctStopLossAndTakeProfit(thirdTestObject)).toBe(false)
        expect(correctStopLossAndTakeProfit(fourthTestObject)).toBe(true)
    })
});