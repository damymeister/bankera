import { pageStartIndex, pageEndIndex } from "../lib/pages"
import {describe, expect, test} from '@jest/globals';

describe('Pagination testing module', () => {
    test('Test pageStartIndex', () => {
        expect(pageStartIndex(10, 4)).toBe(30)
    })
    test('Test pageEndIndex', () => {
        expect(pageEndIndex(10, 4, 5, 47)).toBe(40)
        expect(pageEndIndex(10, 5, 5, 47)).toBe(47)
    })
});