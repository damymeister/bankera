import {describe, expect, test} from '@jest/globals';
import { Point } from "@/lib/interfaces/regression"
import pointsMean from './pointsMean';

const testSet1 : Point[] = [
    {x: 0.0, y: 4.20},
    {x: 0.5, y: 4.21},
    {x: 1.0, y: 4.22},
]

const testSet2 : Point[] = [
    {x: 2.0, y: 4.35},
]

const testSet3 : Point[] = []

describe('Points Mean calculation test', () => {
    test('Test Points mean', () => {
        const pMean : Point = pointsMean(testSet1)
        expect(pMean.x).toBeCloseTo(0.5)
        expect(pMean.y).toBeCloseTo(4.21)
        const pMean2 : Point = pointsMean(testSet2)
        expect(pMean2.x).toBeCloseTo(2.0)
        expect(pMean2.y).toBeCloseTo(4.35)
    })
    test('Test Edge case', () => {
        const pMean : Point = pointsMean(testSet3)
        expect(pMean.x).toBe(0)
        expect(pMean.y).toBe(0)
    })
});