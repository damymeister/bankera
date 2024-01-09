import { Point } from "@/lib/interfaces/regression"

export function varianceX (points: Point[], pMean: Point) {
    let sx2 = 0
    for (let i = 0; i < points.length; i++) {
        sx2 += Math.pow(points[i].x - pMean.x, 2.0)
    }
    return sx2 / (points.length - 1.0)
}

export function varianceY (points: Point[], pMean: Point) {
    let sy2 = 0
    for (let i = 0; i < points.length; i++) {
        sy2 += Math.pow(points[i].y - pMean.y, 2.0)
    }
    return sy2 / (points.length - 1.0)
}

export function covariance (points: Point[], pMean: Point) {
    let sxy = 0
    for (let i = 0; i < points.length; i++) {
        sxy += ((points[i].x - pMean.x) * (points[i].y - pMean.y))
    }
    return sxy / (points.length - 1.0)
}