import prisma from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
    ) {
    if (req.method === 'GET') {
        let roles = await prisma.role.findMany()
        return res.status(200).json(roles)
    }
    res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}