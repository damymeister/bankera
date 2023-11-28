import {describe, expect, test} from '@jest/globals';
import { combine, searchByCurrency } from './pairCombine';
import ICurrencyPair from '@/lib/interfaces/currencyPair';

const currencyPairs: ICurrencyPair[] = [
    {buy_currency_id: 118, sell_currency_id: 47, conversion_value: 4.25},
    {buy_currency_id: 118, sell_currency_id: 50, conversion_value: 5.01},
    {buy_currency_id: 118, sell_currency_id: 150, conversion_value: 3.98},
    {buy_currency_id: 47, sell_currency_id: 118, conversion_value: 0.25},
    {buy_currency_id: 50, sell_currency_id: 118, conversion_value: 0.22},
    {buy_currency_id: 150, sell_currency_id: 118, conversion_value: 0.25},
]

const testSet1: ICurrencyPair[] = [
    {buy_currency_id: 118, sell_currency_id: 47, conversion_value: 4.25},
    {buy_currency_id: 118, sell_currency_id: 50, conversion_value: 5.01},
    {buy_currency_id: 118, sell_currency_id: 150, conversion_value: 3.97},
    {buy_currency_id: 47, sell_currency_id: 118, conversion_value: 0.24},
]

const testSet2: ICurrencyPair[] = [
    {buy_currency_id: 118, sell_currency_id: 150, conversion_value: 3.99},
    {buy_currency_id: 47, sell_currency_id: 118, conversion_value: 0.26},
    {buy_currency_id: 50, sell_currency_id: 118, conversion_value: 0.22},
    {buy_currency_id: 150, sell_currency_id: 118, conversion_value: 0.25},
]

describe('Combining pairs module', () => {
    test('Testing searching currency pairs', () => {
        expect(searchByCurrency(currencyPairs, 118, 150)).toBe(2)
        expect(searchByCurrency(currencyPairs, 0, 1)).toBe(-1)
    })
    test('Testing combining currency pairs with average', () => {
        let expected = currencyPairs
        let actual = combine(testSet1, testSet2)
        for (let i = 0; i < actual.length; i++) {
            expect(actual[i].conversion_value).toBeCloseTo(expected[i].conversion_value)
        }
    })
});