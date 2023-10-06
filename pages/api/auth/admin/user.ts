import parseJwt from '@/lib/parse_jwt'
import prisma from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from 'cookies-next'

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
    ) {
    if (req.method === 'GET') {
        let users = await prisma.user.findMany()
        return res.status(200).json(users)
    }
    res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}