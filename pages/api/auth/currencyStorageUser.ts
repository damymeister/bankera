import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "PUT") {
    try {
      const { wallet_id, currency_id } = req.body;
      const parsedWalletId = parseInt(wallet_id as string);
      const parsedCurrencyId = parseInt(currency_id as string);

      const currencyStorageExist = await prisma.currency_Storage.findFirst({
        where: {
          wallet_id: parsedWalletId,
          currency_id: parsedCurrencyId
        }
      });

      if (currencyStorageExist) {
        await prisma.currency_Storage.update({
          where: {
            id: currencyStorageExist.id
          },
          data: {
            amount: parseFloat(req.body.amount + currencyStorageExist.amount)
          }
        });
      } else {
        await prisma.currency_Storage.create({
          data: {
            wallet_id: parsedWalletId,
            currency_id: parsedCurrencyId,
            amount: parseFloat(req.body.amount) 
          }
        });
      }

      return res.status(200).json({ message: 'Currency storage updated.' });
    } catch (error) {
      console.error('Error while updating currency storage', error);
      return res.status(500).json({ error: 'Server error occurred.' });
    }
  }
}