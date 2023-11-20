import ICurrencyHistory from "./interfaces/currencyHistory";
import { LinearModel, Point } from "./interfaces/regression";

function transofrmHistory (currencyHistory: ICurrencyHistory) {
    let points: Point[] = []
    for (let i = 0; i < currencyHistory.history.length; i++) {
        points.push({x: -i, y: currencyHistory.history[i].conversion_value})
    }
    return points
}

function pointsMean (points: Point[]): Point {
    if (points.length < 1) return {x: 0.0, y: 0.0}
    let sum_x = 0.0, sum_y = 0.0
    for (let i = 0; i < points.length; i++) {
        sum_x += points[i].x
        sum_y += points[i].y
    }
    return {x: sum_x / points.length, y: sum_y / points.length}
}

function varianceX (points: Point[], pMean: Point) {
    let sx2 = 0
    for (let i = 0; i < points.length; i++) {
        sx2 += Math.pow(points[i].x - pMean.x, 2.0)
    }
    return sx2 / (points.length - 1.0)
}

function varianceY (points: Point[], pMean: Point) {
    let sy2 = 0
    for (let i = 0; i < points.length; i++) {
        sy2 += Math.pow(points[i].y - pMean.y, 2.0)
    }
    return sy2 / (points.length - 1.0)
}

function covariance (points: Point[], pMean: Point) {
    let sxy = 0
    for (let i = 0; i < points.length; i++) {
        sxy += ((points[i].x - pMean.x) * (points[i].y - pMean.y))
    }
    return sxy / (points.length - 1.0)
}

export function linearRegression (currencyHistory: ICurrencyHistory): LinearModel | undefined {
    const points = transofrmHistory(currencyHistory)
    if (points.length < 2) return undefined
    const pMean = pointsMean(points)
    const corr = covariance(points, pMean) / Math.sqrt(varianceX(points, pMean) * varianceY(points, pMean))
    const byx = covariance(points, pMean) / varianceX(points, pMean)
    const alfa = pMean.y - byx * pMean.x
    return {byx: byx, alfa: alfa, correlation: corr}
}