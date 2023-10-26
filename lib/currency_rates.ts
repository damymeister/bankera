import { CurrencyPair } from "@/pages/api/interfaces/currencyPair";
import prisma from "./prisma"

const currencies = async () => {
    const data = await prisma.currency.findMany();
    let currency_map : Map<string, number> = new Map()
    for (let i = 0; i < data.length; i++) {
        currency_map.set(data[i].name, data[i].id)
    }
    return currency_map
}

async function transform (api_data: {base: string, rates: {[key: string]: number}}) {
    let c = await currencies()
    let base_id = c.get(api_data.base) ?? 0
    let pairs : CurrencyPair[] = []
    for (const key in api_data.rates) {
        let rate = api_data.rates[key]
        let sell_id = c.get(key) ?? 0
        pairs.push({sell_currency_id: sell_id, buy_currency_id: base_id, conversion_value: rate})
        pairs.push({sell_currency_id: base_id, buy_currency_id: sell_id, conversion_value: (1.0 / rate)})
    }
    return pairs
}

