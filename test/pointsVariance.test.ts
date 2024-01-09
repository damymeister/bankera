import {describe, expect, test} from '@jest/globals';
import { varianceX, varianceY, covariance } from "./pointsVariance"
import { Point } from "@/lib/interfaces/regression"

const testSet : Point[] = [
    {x: 0.0, y: 4.20},
    {x: 0.5, y: 4.21},
    {x: 1.0, y: 4.22},
    {x: 2.0, y: 4.25},
]

const testSetMean : Point = {x: 0.875, y: 4.22}

describe('Points Mean calculation test', () => {
    test('Test X Variance', () => {
        expect(varianceX(testSet, testSetMean)).toBeCloseTo(0.729, 3)
    })
    test('Test Y Variance', () => {
        expect(varianceY(testSet, testSetMean)).toBeCloseTo(0.000467, 6)
    })
    test('Test XY CoVariance', () => {
        expect(covariance(testSet, testSetMean)).toBeCloseTo(0.0183, 4)
    })
});