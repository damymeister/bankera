import { EXTERNAL_API_KEY } from "@/lib/secrets"
import { NextApiRequest, NextApiResponse } from "next"

const API_KEY = 'cdffc4bb82c480856ac4b8cb2fd53dc6'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.headers['x-api-key'] !== EXTERNAL_API_KEY) return res.status(403).json({error: "Not authorized"})
    // Get currency data
    if (req.method === 'GET') {
        const url = 'http://api.exchangerate.host/live?access_key=' + API_KEY
        let data = await fetch(url, {
            method: 'GET',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        }).then(response => response.json())
        .then((data) => {
            let rates: {[key: string]: number} = {}
            for (const [key, val] of Object.entries(data.quotes as {[key: string]: number})) {
                rates[key.slice(3)] = val
            }
            rates["USD"] = 1
            return {base: "USD", rates: rates}
        })
        .catch(error => {
            console.log(error)
            return null
        })
        if (data === null) return res.status(500).json({message: "External API did not respond!"})
        return res.status(200).json(data)
    }
    res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}