import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const response =  await prisma.forex_Currency_Storage.findMany({
          where: {forex_wallet_id: parseInt(req.query.id as string)}, 
        });
        return res.status(200).json(response);
    } catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
  }
  if (req.method === "PUT") {
      try {
        const currencyStorageExist = await prisma.forex_Currency_Storage.findFirst({
          where: {
            forex_wallet_id: req.body.forex_wallet_id,
            forex_currency_id: req.body.forex_currency_id
          }
        });

        if (!currencyStorageExist && req.body.accountOperation == "deposit") {
          await prisma.forex_Currency_Storage.create({
            data: {
              forex_wallet_id: req.body.forex_wallet_id,
              forex_currency_id: req.body.forex_currency_id,
              forex_currency_amount: req.body.forex_currency_amount
            }
          });
          return res.status(200).json({ message: 'Forex Currency storage updated.' });
        }
        if(currencyStorageExist){
          const subtractedBalance = currencyStorageExist.forex_currency_amount - req.body.forex_currency_amount
          const addedBalance = req.body.forex_currency_amount + currencyStorageExist.forex_currency_amount;
          await prisma.forex_Currency_Storage.update({
            where: {
              id: currencyStorageExist.id
            },
            data: {
              forex_currency_amount: req.body.accountOperation == "withdraw" ? subtractedBalance : addedBalance
            }
          });
          if(req.body.accountOperation == "withdraw" && subtractedBalance == 0 ){
            await prisma.forex_Currency_Storage.delete({
              where:{
                id: currencyStorageExist.id
              }
            })
          }
          return res.status(200).json({ message: 'Forex Currency storage updated.' });
      }
      } catch (error) {
        console.error('Error while updating Forex currency storage', error);
        return res.status(500).json({ error });
      }
    }
  }


