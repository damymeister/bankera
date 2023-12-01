import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      let token = getCookie('token', { req, res });
      if (token !== undefined) {

      const response = await prisma.currency_Pair.findFirst({
        where: {
          sell_currency_id: parseInt(req.query.sell_currency_id as string),
          buy_currency_id: parseInt(req.query.buy_currency_id as string),
        },
      });
        
        return res.status(200).json(response);
      } else {
        return res.status(401).json({ error: 'Permission denied. User is not authenticated.' });
      }
    } catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error });
    }
  }
}