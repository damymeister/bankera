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
    if (req.method === 'PUT') {
        try {
          const user_id: number | undefined = req.query.id ? Number(req.query.id) : undefined;
          if (user_id === undefined) {
            return res.status(400).json({ message: 'Invalid user ID' });
          }
          const { role_id } = req.body;
    
          const user = await prisma.user.update({
            where: {id: user_id,},
            data: {role_id: role_id,},
            select: {role_id: true,},
          });
    
          return res.status(200).json(user);
        } catch (error) {
          return res.status(500).json({ message: 'An error occurred' });
        }
      }
    res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}