import prisma from "./prisma"
import api_url from "./api_url";
import ICurrencyPair from "./interfaces/currencyPair";
import { CHeaders, Color } from "./console";
import { EXTERNAL_API_KEY } from "./secrets";

const CNAME = '&dUCR &f:&r'

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
                let buy_id = c.get(key1)
                let sell_id = c.get(key2)
                if (buy_id && sell_id) pairs.push({sell_currency_id: sell_id, buy_currency_id: buy_id, conversion_value: rate})
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
            'x-api-key': EXTERNAL_API_KEY
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
            'x-api-key': EXTERNAL_API_KEY
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

async function getFromExchangeRate () {
    let pairs = await fetch(api_url('external/exchangerate'), {
        method: 'GET',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            'x-api-key': EXTERNAL_API_KEY
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

async function getFromCurrencyBeacon () {
    let pairs = await fetch(api_url('external/currencybeacon'), {
        method: 'GET',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            'x-api-key': EXTERNAL_API_KEY
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

const sequencer = [
    [0, 1],
    [2, 3],
    [0, 2],
    [1, 3],
    [0, 3],
    [1, 2],
]

const getPair = async (apiIndex: number) => {
    switch (apiIndex) {
        case 0: return await getFromFixer()
        case 1: return await getFromFreecurrency()
        case 2: return await getFromExchangeRate()
        default: return await getFromCurrencyBeacon()
    }
}

const searchByCurrency = (currencyPairs: ICurrencyPair[], buy_currency_id: number, sell_currency_id: number) => {
    for (let i = 0; i < currencyPairs.length; i++) {
        if (currencyPairs[i].buy_currency_id === buy_currency_id && currencyPairs[i].sell_currency_id === sell_currency_id) {
            return i
        }
    }
    return -1
}

const combine = (pairs1: ICurrencyPair[] | never[], pairs2: ICurrencyPair[] | never[]) => {
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

export default async function getCurrencyPairs () {
    let date = new Date()
    let hours = date.getHours(), minutes = date.getMinutes()
    let seqNo = (hours % 3) * 2 + (minutes < 10 ? 0 : 1)
    console.log(Color.formatted(`${CHeaders.Cron}${CHeaders.TASKCALL} ${CNAME} &6Getting currency rates...`))
    let pairs1 = await getPair(sequencer[seqNo][0])
    let pairs2 = await getPair(sequencer[seqNo][1])
    let pairs = combine(pairs1, pairs2)
    console.log(Color.formatted(`${CHeaders.Cron}${CHeaders.TASKACK} ${CNAME} &2Done.`))
    console.log(Color.formatted(`${CHeaders.Cron}${CHeaders.TASKCALL} ${CNAME} &6Saving currency rates...`))
    for (let i = 0; i < pairs.length; i++) {
        await prisma.currency_Pair.upsert({
            create: pairs[i],
            update: {conversion_value: pairs[i].conversion_value},
            where: {unique_pair: {buy_currency_id: pairs[i].buy_currency_id, sell_currency_id: pairs[i].sell_currency_id}}
        })
    }
    console.log(Color.formatted(`${CHeaders.Cron}${CHeaders.TASKACK} ${CNAME} &2Done.`))
    console.log(Color.formatted(`${CHeaders.Cron}${CHeaders.TASKCALL} ${CNAME} &6Adding to currency history...`))
    for (let i = 0; i < pairs.length; i++) {
        await prisma.currency_History.create({
            data: {
                buy_currency_id: pairs[i].buy_currency_id,
                sell_currency_id: pairs[i].sell_currency_id,
                conversion_value: pairs[i].conversion_value,
                date: date
            }
        })
    }
    console.log(Color.formatted(`${CHeaders.Cron}${CHeaders.TASKACK} ${CNAME} &2Done.`))
    //return pairs
    return {message: 'Rates updated successfully'}
}

