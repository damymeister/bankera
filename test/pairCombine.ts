import ICurrencyPair from "@/lib/interfaces/currencyPair"

export const searchByCurrency = (currencyPairs: ICurrencyPair[], buy_currency_id: number, sell_currency_id: number) => {
    for (let i = 0; i < currencyPairs.length; i++) {
        if (currencyPairs[i].buy_currency_id === buy_currency_id && currencyPairs[i].sell_currency_id === sell_currency_id) {
            return i
        }
    }
    return -1
}

export const combine = (pairs1: ICurrencyPair[] | never[], pairs2: ICurrencyPair[] | never[]) => {
    if (pairs1.length === 0) return pairs2
    if (pairs2.length === 0) return pairs1
    let combined: ICurrencyPair[] = pairs1
    for (let i = 0; i < pairs2.length; i++) {
        let idx = searchByCurrency(combined, pairs2[i].buy_currency_id, pairs2[i].sell_currency_id)
        if (idx === -1) combined.push(pairs2[i])
        else combined[idx].conversion_value = (combined[idx].conversion_value + pairs2[i].conversion_value) / 2.0
    }
    return combined
}

