import parseJwt from '@/lib/parse_jwt'
import prisma from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from 'cookies-next'

export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse
    ) {
    if (req.method === 'GET') {
      try {
        const id = req.query.id
        const innerTransactions = await prisma.inner_Transaction.findMany({
          where: { wallet_id : parseInt(id as string) } 
        });
        const userToUserTransactions = await prisma.user_to_User_Transaction.findMany({
          where: { wallet_sender_id  : parseInt(id as string) } 
        });
  
        const Transactions = {
          innerTransactions,
          userToUserTransactions
          
        };
        return res.status(200).json(Transactions);
      } catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
      }
    }
  
    res.status(500).json({ message: 'This HTTP method is not supported on this endpoint' });
  }