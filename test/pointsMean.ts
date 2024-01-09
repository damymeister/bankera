import { Point } from "@/lib/interfaces/regression"

export default function pointsMean (points: Point[]): Point {
    if (points.length < 1) return {x: 0.0, y: 0.0}
    let sum_x = 0.0, sum_y = 0.0
    for (let i = 0; i < points.length; i++) {
        sum_x += points[i].x
        sum_y += points[i].y
    }
    return {x: sum_x / points.length, y: sum_y / points.length}
}