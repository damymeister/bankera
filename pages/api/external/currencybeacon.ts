import { CHeaders, Color } from "@/lib/console"
import { EXTERNAL_API_KEY } from "@/lib/secrets"
import { NextApiRequest, NextApiResponse } from "next"

const API_KEY = 'GdeCxtCWgMqO1bnLhJn7PqSlW1djUXvd'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.headers['x-api-key'] !== EXTERNAL_API_KEY) return res.status(403).json({error: "Not authorized"})
    console.log(Color.formatted(`${CHeaders.API}${CHeaders.CALL} &6Getting data from CurrencyBeacon...`))
    // Get currency data
    if (req.method === 'GET') {
        const url = 'https://api.currencybeacon.com/v1/latest?api_key=' + API_KEY
        let data = await fetch(url, {
            method: 'GET',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        }).then(response => response.json())
        .then((data) => {
            return {base: data.base, rates: data.rates}
        })
        .catch(error => {
            console.log(error)
            return null
        })
        if (data === null) return res.status(500).json({message: "External API did not respond!"})
        console.log(Color.formatted(`${CHeaders.API}${CHeaders.ACK} &aDone.`))
        return res.status(200).json(data)
    }
    res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}