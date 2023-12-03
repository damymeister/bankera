import { breakpointColor } from "./colors";
import ICurrencyHistory from "./interfaces/currencyHistory";
import { LinearModel, Point } from "./interfaces/regression";

function transofrmHistory (currencyHistory: ICurrencyHistory) {
    let points: Point[] = []
    const len = currencyHistory.history.length
    let curr_x = 0
    for (let i = len - 1; i >= 0; i--) {
        points.push({x: curr_x, y: currencyHistory.history[i].conversion_value})
        curr_x += 0.5
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
    return {byx: byx, alfa: alfa, correlation: corr, nextX: (currencyHistory.history.length / 2.0)}
}

export function regressionColor (byx: number) {
    if (byx >= -1.0E-6 && byx <= 1.0E-6) return 'rgb(170, 170, 170)'
    let color: {r: number, g: number, b: number} = {r: 0, g: 0, b: 0}
    let ln_byx = Math.log(Math.abs(byx))
    if (byx < 0) {
        if (ln_byx > 6) color.r = 255.0
        else color = breakpointColor([{r: 170, g: 170, b: 170, v: -17}, {r: 255, g: 0, b: 0, v: 6}], ln_byx)
    }
    else {
        if (ln_byx > 6) color.g = 255.0
        else color = breakpointColor([{r: 170, g: 170, b: 170, v: -17}, {r: 0, g: 255, b: 0, v: 6}], ln_byx)
    }
    return `rgb(${color.r.toFixed(0)}, ${color.g.toFixed(0)}, ${color.b.toFixed(0)})`
}