import {describe, expect, test} from '@jest/globals';
import { setConvertedAmount } from "./setConvertedAmount";

describe('setConvertedAmount module', () => {
    test('Check conversion', () => {
        expect(setConvertedAmount(1.0, 4.5)).toBe(4.5)
        expect(setConvertedAmount(5.0, 4.75)).toBe(23.75)
    });
});
