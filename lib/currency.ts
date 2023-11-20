import ICurrency from "./interfaces/currency"

export function getCurrencyNameById (currencies: ICurrency[], id: number): string {
    for (let i = 0; i < currencies.length; i++) {
        if (currencies[i].id === id) return currencies[i].name
    }
    return ''
}
export function getCurrencyIdByName (currencies: ICurrency[], name: string): number {
    for (let i = 0; i < currencies.length; i++) {
        if (currencies[i].name === name) return currencies[i].id
    }
    return -1
}
export function significantDigits (value: number): number {
    if (value > -0.0000001 && value < 0.0000001) return 2
    if (value > 0) {
        if (value < 0.000001) return 7
        if (value < 0.000010) return 6
        if (value < 0.000100) return 5
        if (value < 1.000000) return 4
        if (value < 10.00000) return 3
        return 2
    }
    if (value > -0.000001) return 7
    if (value > -0.000010) return 6
    if (value > -0.000100) return 5
    if (value > -1.000000) return 4
    if (value > -10.00000) return 3
    return 2
}
export function inZeroRange (value: number): boolean {
    let sd = significantDigits(value)
    if (sd >= 7) return (value > -0.0000001 && value < 0.0000001)
    if (sd === 6) return (value > -0.0000010 && value < 0.0000010)
    if (sd === 5) return (value > -0.0000100 && value < 0.0000100)
    if (sd === 4) return (value > -0.0001000 && value < 0.0001000)
    if (sd === 3) return (value > -0.0010000 && value < 0.0010000)
    return (value > -0.0100000 && value < 0.0100000)
}