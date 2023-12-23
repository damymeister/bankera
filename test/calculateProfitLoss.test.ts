import { SpeculativeTransactionProfitLossTest } from '@/lib/interfaces/speculative_Transaction';
import { calculateProfitLoss } from './calculateProfitLoss';
import {describe, expect, test} from '@jest/globals';

const firstTestObject : SpeculativeTransactionProfitLossTest = {
    transaction_type: 1,
    entry_course_value: 1.07,
    exit_course_value: 1.12,
    transaction_balance: 30000,
}

const secondTestObject : SpeculativeTransactionProfitLossTest = {
    transaction_type: 1,
    entry_course_value: 4.30,
    exit_course_value: 4.28,
    transaction_balance: 52000,
}

const thirdTestObject : SpeculativeTransactionProfitLossTest = {
    transaction_type: 2,
    entry_course_value: 2.30,
    exit_course_value: 2.35,
    transaction_balance: 100000,
}

const fourthTestObject : SpeculativeTransactionProfitLossTest = {
    transaction_type: 2,
    entry_course_value: 3.31,
    exit_course_value: 3.15,
    transaction_balance: 32100
}

describe('Profit loss Forex testing module', () => {
    test('Test Buying transaction', () => {
        expect(calculateProfitLoss(firstTestObject)).toBe(1500)
        expect(calculateProfitLoss(secondTestObject)).toBe(-1040)
    })
    test('Test Selling Transaction', () => {
        expect(calculateProfitLoss(thirdTestObject)).toBe(-5000)
        expect(calculateProfitLoss(fourthTestObject)).toBe(5136)
    })
});