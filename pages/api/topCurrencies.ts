import ICurrencyHistory from "@/lib/interfaces/currencyHistory"
import prisma from "@/lib/prisma"
import { getPastTimestamp } from "@/lib/time"
import { NextApiRequest, NextApiResponse } from "next"

function buySellIndex (sell_currency_id: number, buy_currency_id: number, transformed: ICurrencyHistory[]) {
    for (let i = 0; i < transformed.length; i++) {
        if (transformed[i].sell_currency_id === sell_currency_id && transformed[i].buy_currency_id === buy_currency_id) return i
    }
    return -1
}

function transform (data: {
    id: number;
    sell_currency_id: number;
    buy_currency_id: number;
    conversion_value: number;
    date: Date;
}[]) {
    let transformed: ICurrencyHistory[] = []
    // Transform DB Data to Interface Data to reduce complexity
    for (let i = 0; i < data.length; i++) {
        let bsIndex = buySellIndex(data[i].sell_currency_id, data[i].buy_currency_id, transformed)
        if (bsIndex === -1) {
            transformed.push({
                buy_currency_id: data[i].buy_currency_id,
                sell_currency_id: data[i].sell_currency_id,
                history: [
                    {
                        conversion_value: data[i].conversion_value,
                        date: data[i].date,
                        invertedConversion: (1.0 / data[i].conversion_value)
                    }
                ]
            })
        }
        else {
            transformed[bsIndex].history.push({
                conversion_value: data[i].conversion_value,
                date: data[i].date,
                invertedConversion: (1.0 / data[i].conversion_value)
            })
        }
    }
    for (let i = 0; i < transformed.length; i++) {
        const historyLen = transformed[i].history.length
        if (historyLen > 0) {
            transformed[i].diffTotal = transformed[i].history[0].conversion_value - transformed[i].history[historyLen-1].conversion_value
            let invertedC1 = transformed[i].history[0].invertedConversion
            let invertedC2 = transformed[i].history[historyLen-1].invertedConversion
            if (invertedC1 && invertedC2) {
                transformed[i].invertedDiffTotal = invertedC1 - invertedC2
            }
        }
        for (let j = 0; j < historyLen; j++) {
            let invertedC1 = transformed[i].history[j].invertedConversion
            if (j > 0) {
                let invertedC2 = transformed[i].history[j-1].invertedConversion
                transformed[i].history[j].diffFuture = transformed[i].history[j].conversion_value - transformed[i].history[j-1].conversion_value
                if (invertedC1 && invertedC2) {
                    transformed[i].history[j].invertedDiffFuture = invertedC1 - invertedC2
                }
            }
            if (j < historyLen - 1) {
                let invertedC2 = transformed[i].history[j+1].invertedConversion
                transformed[i].history[j].diffPast = transformed[i].history[j].conversion_value - transformed[i].history[j+1].conversion_value
                if (invertedC1 && invertedC2) {
                    transformed[i].history[j].invertedDiffPast = invertedC1 - invertedC2
                }
            }
        }
    }
    return transformed
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // PLN -> EUR, GBP, USD
        let sell_currency_id = 118, buy_currency_id = [47, 50, 150], timestamp = '2h'
        let historical_date = new Date()
        historical_date.setTime(getPastTimestamp(timestamp))
        const data = await prisma.currency_History.findMany({
            where: {
                sell_currency_id: sell_currency_id,
                buy_currency_id: {in: buy_currency_id},
                date: {gt: historical_date}
            },
            orderBy: {date: 'desc'}
        })
        const response : ICurrencyHistory[] = transform(data)
        return res.status(200).json(response)
    }
}