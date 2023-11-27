import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
      try {
        const currencyStorageExist = await prisma.currency_Storage.findFirst({
          where: {
            currency_id: req.body.currency_id,
            wallet_id: req.body.wallet_id
          }
        });
      
        if (!currencyStorageExist && req.body.accountOperation == "deposit") {
          await prisma.currency_Storage.create({
            data: {
              wallet_id: req.body.wallet_id,
              currency_id: req.body.currency_id,
              amount: req.body.amount,
            }
          });
          return res.status(200).json({ message: 'Forex Currency storage updated.' });
        }
        if(currencyStorageExist){

          const subtractedBalance = currencyStorageExist.amount - req.body.amount;
          const addedBalance = req.body.amount + currencyStorageExist.amount;

          await prisma.currency_Storage.update({
            where: {
              id: currencyStorageExist.id
            },
            data: {
              amount: req.body.accountOperation == "withdraw" ? subtractedBalance : addedBalance
            }
          });

          if(req.body.accountOperation == "withdraw" && subtractedBalance == 0){
            await prisma.currency_Storage.delete({
              where:{
                id: currencyStorageExist.id
              }
            })
          }
      }
        return res.status(200).json('Currency storage updated.');
      } catch (error) {
        console.error('Error while updating currency storage', error);
        return res.status(500).json({ error: 'Server error occurred.' });
      }
    }
}