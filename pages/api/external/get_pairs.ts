import getCurrencyPairs from "@/lib/currency_rates";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const data = await getCurrencyPairs()
    return res.status(200).json(data)
}