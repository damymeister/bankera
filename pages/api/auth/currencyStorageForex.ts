import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
      try {
        const { wallet_id, currency_id, amount, accountOperation } = req.body;

        const doesCurrencyNameExist = await prisma.currency.findFirst({
          where: {
            id: currency_id
          }
        });

        const doesWalletExist = await prisma.wallet.findFirst({
          where: {
            id: wallet_id
          }
        }); 

        if (!doesCurrencyNameExist || !doesWalletExist) {
          return res.status(404).json({ error: 'Currency or Wallet does not exist.' });
        }

        const currencyStorageExist = await prisma.currency_Storage.findFirst({
          where: {
            currency_id: currency_id,
            wallet_id: wallet_id
          }
        });
      
        if (!currencyStorageExist && req.body.accountOperation == "deposit") {
          await prisma.currency_Storage.create({
            data: {
              wallet_id: wallet_id,
              currency_id: currency_id,
              amount: amount,
            }
          });
          return res.status(200).json({ message: 'Forex Currency storage updated.' });
        }
        if(currencyStorageExist){

          const subtractedBalance = currencyStorageExist.amount - amount;
          const addedBalance = amount + currencyStorageExist.amount;

          await prisma.currency_Storage.update({
            where: {
              id: currencyStorageExist.id
            },
            data: {
              amount: accountOperation == "withdraw" ? subtractedBalance : addedBalance
            }
          });

          if(accountOperation == "withdraw" && subtractedBalance == 0){
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