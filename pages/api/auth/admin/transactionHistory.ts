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
        const user_id = req.query.id
        const user = await prisma.user.findFirst({where: {id: parseInt(user_id as string)}})
        const wallet_id = (user === null ? 0 : user.wallet_id === null ? 0 : user.wallet_id)
        const innerTransactions = await prisma.inner_Transaction.findMany({
          where: { wallet_id : wallet_id } 
        });
        const userToUserTransactions = await prisma.user_to_User_Transaction.findMany({
          where: { wallet_sender_id  : wallet_id } 
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