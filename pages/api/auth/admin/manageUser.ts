import parseJwt from '@/lib/parse_jwt'
import prisma from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from 'cookies-next'

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
    ) {
        if (req.method === 'GET') {
            try {
              const user_id: number | undefined = req.query.id ? Number(req.query.id) : undefined;
              
              if (user_id === undefined) {
                return res.status(400).json({ message: 'Invalid user ID' });
              }
          
              const user = await prisma.user.findUnique({
                where: {
                  id: user_id,
                },
                select: {
                  first_name: true,
                  last_name: true,
                  email: true,
                  password: true,
                  phone_number: true,
                },
              });
          
              return res.status(200).json(user);
            } catch (error) {
              return res.status(500).json({ message: 'An error occurred' });
            }
          }
          if (req.method === 'DELETE') {
            if (req.body.id !== undefined && !Array.isArray(req.body.id)) {
                await prisma.user.delete({where: {id: parseInt(req.body.id)}})
                return res.status(200).json({message: "User deleted"})
            }
            return res.status(500).json({message: "Failed to delete user"})
        }
          
        res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
       
    } 
   
