import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
import parseJwt from '@/lib/parse_jwt';

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
  if (req.method === 'POST') {
    
    let token = getCookie('token', { req, res });

    if (token !== undefined) {
      let token_json = parseJwt(token);
      let user_id = parseInt(token_json._id);

    const forex_wallet_currency_duplicate = await prisma.forex_Currency_Storage.count({
        where: {
            forex_wallet_id: req.body.forex_wallet_id,
            forex_currency_id : req.body.forex_currency_id,
        }
    })

    const forex_user_wallet = await prisma.user.findUnique({
        where:{
            forex_wallet_id: req.body.forex_wallet_id,
            id: user_id,
        }
    })

    if (forex_user_wallet && forex_wallet_currency_duplicate) {
        return res.status(409).json({ message: "You can not add same currency twice!" })
    }
    await prisma.forex_Currency_Storage.create({data: {
        forex_wallet_id: req.body.forex_wallet_id,
        forex_currency_amount: req.body.forex_currency_amount,
        forex_currency_id: req.body.forex_currency_id,
    }})
    return res.status(201).json({ message: "Forex Currency Storage added." })
}
  }
  if (req.method === "PUT") {
      try {
        const { forex_wallet_id, forex_currency_id } = req.body;
        const parsedForexWalletId = parseInt(forex_wallet_id as string);
        const parsedForexCurrencyId = parseInt(forex_currency_id as string);
  
        const currencyStorageExist = await prisma.forex_Currency_Storage.findFirst({
          where: {
            forex_wallet_id: parsedForexWalletId,
            forex_currency_id: parsedForexCurrencyId
          }
        });
        if (currencyStorageExist) {
          await prisma.forex_Currency_Storage.update({
            where: {
              id: currencyStorageExist.id
            },
            data: {
              forex_currency_amount: parseFloat(req.body.amount + currencyStorageExist.forex_currency_amount)
            }
          });
        } else {
          await prisma.forex_Currency_Storage.create({
            data: {
              forex_wallet_id: parsedForexWalletId,
              forex_currency_id: parsedForexCurrencyId,
              forex_currency_amount: parseFloat(req.body.amount) 
            }
          });
        }

        const amountLeft = await prisma.forex_Currency_Storage.update({
          where: {
            id: req.body.id, 
          },
          data: {
            forex_currency_amount: req.body.forex_currency_amount,
          }
        });
        if(amountLeft.forex_currency_amount == 0){
          await prisma.forex_Currency_Storage.delete({
            where: {id: amountLeft.id}, 
          });
        }

        return res.status(200).json({ message: 'Currency storage updated.' });
      } catch (error) {
        console.error('Error while updating Forex currency storage', error);
        return res.status(500).json({ error: 'Server error occurred.' });
      }
    }
  if (req.method === 'DELETE') {
      try {
        await prisma.forex_Currency_Storage.delete({
          where: {id: parseInt(req.query.id as string)}, 
        });
        return res.status(200).json({ message: "Forex Currency Storage deleted." });
      } catch (error) {
        console.error('Error while deleting forex currency storage', error);
        return res.status(500).json({ error: 'Server error occurred.' });
      }
    } 
  }


