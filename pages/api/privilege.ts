import parseJwt from '@/lib/parse_jwt'
import prisma from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from 'cookies-next'

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
    ) {
    // Return 0 - guest, 1 - user, 2 - redaktor, 3 - admin
    if (req.method === 'GET') {
        // New way using token in a cookie
        let token = getCookie('token', {req, res})
        if (token !== undefined) {
            let token_json = parseJwt(token)
            let user_id = token_json._id
            let user = await prisma.user.findUnique({where: {user_id: parseInt(user_id)}})
            if (user === null) return res.status(200).json({privilege: 0})
            return res.status(200).json({privilege: user.role_id})
        }
        // Old way using query parameter ?token=***
        // It is needed when using fetch that doesn't pass cookies through
        let token_old = req.query.token
        if (token_old !== undefined && !Array.isArray(token_old)) {
            let token_json = parseJwt(token_old)
            let user_id = token_json._id
            let user = await prisma.user.findUnique({where: {user_id: parseInt(user_id)}})
            if (user === null) return res.status(200).json({privilege: 0})
            return res.status(200).json({privilege: user.role_id})
        }
        return res.status(200).json({privilege: 0})
    }
    res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}