import prisma from "@/lib/prisma";
import { getPastTimestamp } from "@/lib/time";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse)  {
    if (req.method === 'GET') {
        let sell_currency_id = 0, buy_currency_id = 0, timestamp = '1h'
        if (req.query.timestamp && !Array.isArray(req.query.timestamp)) timestamp = req.query.timestamp
        if (req.query.sell_currency_id && !Array.isArray(req.query.sell_currency_id)) sell_currency_id = parseInt(req.query.sell_currency_id)
        if (req.query.buy_currency_id && !Array.isArray(req.query.buy_currency_id)) buy_currency_id = parseInt(req.query.buy_currency_id)
        let historical_date = new Date()
        historical_date.setTime(getPastTimestamp(timestamp))
        const response = await prisma.currency_History.findMany({
            where: {
                sell_currency_id: sell_currency_id,
                buy_currency_id: buy_currency_id,
                date: {gt: historical_date}
            },
            orderBy: {date: 'desc'}
        });
        return res.status(200).json(response)
    }
    res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}