import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      let token = getCookie('token', { req, res });
      if (token !== undefined) {
        if (req.query.sell_currency_id && req.query.buy_currency_id) {
          await prisma.currency.findFirst({
            where: {
              id: parseInt(req.query.sell_currency_id as string),
            },
          });
          await prisma.currency.findFirst({
            where: {
              id: parseInt(req.query.buy_currency_id as string),
            },
          });

          if(req.query.sell_currency_id === req.query.buy_currency_id) return res.status(400).json({ error: 'You cannot buy and sell the same currency.' });
          if(req.query.sell_currency_id === undefined || req.query.buy_currency_id === undefined) return res.status(400).json({ error: 'You must specify the sell and buy currencies.' });
          
          const response = await prisma.currency_Pair.findFirst({
            where: {
              sell_currency_id: parseInt(req.query.sell_currency_id as string),
              buy_currency_id: parseInt(req.query.buy_currency_id as string),
            },
          });
          return res.status(200).json(response);
        }
        if (!req.query.id) return res.status(400).json({ error: 'You must specify the id of the currency pair.' });
          const response = await prisma.currency_Pair.findFirst({
            where: {
              id: parseInt(req.query.id as string),
            },
          });
          if(response === null) return res.status(400).json({ error: 'Currency pair not found.' });

          const buyCurrency = await prisma.currency.findFirst({
            where: {
              id: response.buy_currency_id,
            },
          });
          const sellCurrency = await prisma.currency.findFirst({
            where: {
              id: response.sell_currency_id,
            },
          });

          return res.status(200).json({...response, buy_currency: buyCurrency, sell_currency: sellCurrency});
          
      } else {
        return res.status(401).json({ error: 'Permission denied. User is not authenticated.' });
      }
    } catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error });
    }
  }
}