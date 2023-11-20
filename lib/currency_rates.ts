import prisma from "./prisma"
import api_url from "./api_url";
import ICurrencyPair from "./interfaces/currencyPair";

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
    let pairs : ICurrencyPair[] = []
    for (const key1 in api_data.rates) {
        for (const key2 in api_data.rates) {
            if (key1 !== key2) {
                let rate = api_data.rates[key2] / api_data.rates[key1];
                let buy_id = c.get(key1) ?? 0
                let sell_id = c.get(key2) ?? 0
                pairs.push({sell_currency_id: sell_id, buy_currency_id: buy_id, conversion_value: rate})
            }
        }
    }
    return pairs
}

async function getFromFixer () {
    let pairs = await fetch(api_url('external/fixer'), {
        method: 'GET',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    }).then(response => response.json())
    .then((data) => {
        return transform(data)
    })
    .catch(error => {
        console.log(error)
        return []
    })
    return pairs
}

async function getFromFreecurrency () {
    let pairs = await fetch(api_url('external/freecurrency'), {
        method: 'GET',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    }).then(response => response.json())
    .then((data) => {
        return transform(data)
    })
    .catch(error => {
        console.log(error)
        return []
    })
    return pairs
}

export default async function getCurrencyPairs () {
    let date = new Date()
    let pairs = (date.getHours() % 2 === 0 ? await getFromFixer() : await getFromFreecurrency())
    for (let i = 0; i < pairs.length; i++) {
        await prisma.currency_Pair.upsert({
            create: pairs[i],
            update: {conversion_value: pairs[i].conversion_value},
            where: {unique_pair: {buy_currency_id: pairs[i].buy_currency_id, sell_currency_id: pairs[i].sell_currency_id}}
        })
    }
    //return pairs
    return {message: 'Rates updated successfully'}
}

