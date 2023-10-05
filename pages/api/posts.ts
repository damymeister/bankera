import prisma from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
    ) {
    if (req.method === 'GET') {
        if (req.query.id !== undefined && !Array.isArray(req.query.id)) {
            let post = await prisma.post.findUnique({where: {id: parseInt(req.query.id)}})
            return res.status(200).json(post)
        }
        let posts = await prisma.post.findMany({include: {user: true}})
        return res.status(200).json(posts)
    }
    res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}