import getCurrencyPairs from "@/lib/currency_rates";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const data = await getCurrencyPairs()
        return res.status(200).json(data)
    }
    res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}