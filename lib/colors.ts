export function breakpointColor (breakpoints: {r: number, g: number, b: number, v: number}[], value: number) {
    let r = 0, g = 0, b = 0
    for (let i = 0; i < breakpoints.length - 1; i++) {
        if (value >= breakpoints[i].v && value <= breakpoints[i+1].v) {
            let ar = ((breakpoints[i].r - breakpoints[i+1].r) / (breakpoints[i].v - breakpoints[i+1].v))
            let ag = ((breakpoints[i].g - breakpoints[i+1].g) / (breakpoints[i].v - breakpoints[i+1].v))
            let ab = ((breakpoints[i].b - breakpoints[i+1].b) / (breakpoints[i].v - breakpoints[i+1].v))
            r = ar * value + breakpoints[i].r - breakpoints[i].v * ar
            g = ag * value + breakpoints[i].g - breakpoints[i].v * ag
            b = ab * value + breakpoints[i].b - breakpoints[i].v * ab
            return {r: r, g: g, b: b};
        }
    }
    return {r: r, g: g, b: b};
}