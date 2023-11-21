import ICurrencyHistory from "@/lib/interfaces/currencyHistory";
import prisma from "@/lib/prisma";
import { linearRegression } from "@/lib/regression";
import { getPastTimestamp } from "@/lib/time";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Specific -> Sell and buy currency provided
 * NonSpecific -> Only sell currency provided
 * All -> Returns all currency pairs
 */
enum requestType {
    Specific,
    NonSpecific,
    All,
}

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
}[], includeDiff: boolean, invert: boolean, predict: boolean) {
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
                        invertedConversion: (invert ? (1.0 / data[i].conversion_value) : undefined)
                    }
                ]
            })
        }
        else {
            transformed[bsIndex].history.push({
                conversion_value: data[i].conversion_value,
                date: data[i].date,
                invertedConversion: (invert ? (1.0 / data[i].conversion_value) : undefined)
            })
        }
    }
    // Add differences if requested
    if (includeDiff) {
        for (let i = 0; i < transformed.length; i++) {
            const historyLen = transformed[i].history.length
            if (historyLen > 0) {
                transformed[i].diffTotal = transformed[i].history[0].conversion_value - transformed[i].history[historyLen-1].conversion_value
                let invertedC1 = transformed[i].history[0].invertedConversion
                let invertedC2 = transformed[i].history[historyLen-1].invertedConversion
                if (invert && invertedC1 && invertedC2) {
                    transformed[i].invertedDiffTotal = invertedC1 - invertedC2
                }
            }
            for (let j = 0; j < historyLen; j++) {
                let invertedC1 = transformed[i].history[j].invertedConversion
                if (j > 0) {
                    let invertedC2 = transformed[i].history[j-1].invertedConversion
                    transformed[i].history[j].diffFuture = transformed[i].history[j].conversion_value - transformed[i].history[j-1].conversion_value
                    if (invert && invertedC1 && invertedC2) {
                        transformed[i].history[j].invertedDiffFuture = invertedC1 - invertedC2
                    }
                }
                if (j < historyLen - 1) {
                    let invertedC2 = transformed[i].history[j+1].invertedConversion
                    transformed[i].history[j].diffPast = transformed[i].history[j].conversion_value - transformed[i].history[j+1].conversion_value
                    if (invert && invertedC1 && invertedC2) {
                        transformed[i].history[j].invertedDiffPast = invertedC1 - invertedC2
                    }
                }
            }
        }
    }
    // Add prediction if requested
    if (predict) {
        for (let i = 0; i < transformed.length; i++) {
            transformed[i].future = linearRegression(transformed[i])
        }
    }
    return transformed
}

/**
 * auth/currencyHistory endpoint
 * Query parameters:
 * sell_currency_id: Selling currency (if not provided selects all)
 * buy_currency_id: Buying currency (if not provided selects all)
 * timestamp: History timespan. Format #h for hours and #d for days. Default to 1h
 * includeDiff: If set to true, will calculate differences between each conversion value
 * invert: If set to true, will calculate inversions of conversion values
 *        (If both includeDiff and invert are true, it will aswell calculate differences for inversions)
 * predict: If set to true, will calculate linear model prediction for conversion value
 * @returns history response
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        let sell_currency_id = 0, buy_currency_id = 0, timestamp = '1h'
        let reqType : requestType = requestType.All
        let includeDiff: boolean = false, invert: boolean = false, predict: boolean = false
        if (req.query.includeDiff && !Array.isArray(req.query.includeDiff) && req.query.includeDiff === 'true') includeDiff = true
        if (req.query.invert && !Array.isArray(req.query.invert) && req.query.invert === 'true') invert = true
        if (req.query.predict && !Array.isArray(req.query.predict) && req.query.predict === 'true') predict = true
        if (req.query.timestamp && !Array.isArray(req.query.timestamp)) timestamp = req.query.timestamp
        if (req.query.sell_currency_id && !Array.isArray(req.query.sell_currency_id)) {
            reqType = requestType.NonSpecific
            sell_currency_id = parseInt(req.query.sell_currency_id)
            if (req.query.buy_currency_id && !Array.isArray(req.query.buy_currency_id)) {
                reqType = requestType.Specific
                buy_currency_id = parseInt(req.query.buy_currency_id)
            }
        }
        let historical_date = new Date()
        historical_date.setTime(getPastTimestamp(timestamp))
        if (reqType === requestType.Specific) {
            const data = await prisma.currency_History.findMany({
                where: {
                    sell_currency_id: sell_currency_id,
                    buy_currency_id: buy_currency_id,
                    date: {gt: historical_date}
                },
                orderBy: {date: 'desc'}
            });
            const response : ICurrencyHistory[] = transform(data, includeDiff, invert, predict)
            return res.status(200).json(response)
        }
        if (reqType === requestType.NonSpecific) {
            const data = await prisma.currency_History.findMany({
                where: {
                    sell_currency_id: sell_currency_id,
                    date: {gt: historical_date}
                },
                orderBy: {date: 'desc'}
            });
            const response : ICurrencyHistory[] = transform(data, includeDiff, invert, predict)
            return res.status(200).json(response)
        }
        const data = await prisma.currency_History.findMany({
            where: {
                date: {gt: historical_date}
            },
            orderBy: {date: 'desc'}
        });
        const response : ICurrencyHistory[] = transform(data, includeDiff, invert, predict)
        return res.status(200).json(response)
    }
    return res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}