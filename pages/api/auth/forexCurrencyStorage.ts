import parseJwt from '@/lib/parse_jwt';
import prisma from '@/lib/prisma';
import { getCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getCookie('token', { req, res })
  if (!token) return res.status(401).json({error: 'Not Authorized! User Token does not exist!'})
  const token_json = parseJwt(token)
  const user_id = parseInt(token_json._id)
  const user = await prisma.user.findUnique({where: {id: user_id}})
  if (user === null) return res.status(404).json({ error: 'User not found!' })
  const forex_wallet_id = user.forex_wallet_id
  if (forex_wallet_id === null) return res.status(404).json({ error: 'Forex Wallet not found!' })
  if (req.method === 'GET') {
    try {
      const response =  await prisma.forex_Currency_Storage.findMany({
        where: {forex_wallet_id: forex_wallet_id}, 
      });
      return res.status(200).json(response);
    } catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
  }
  if (req.method === "PUT") {
    try {
      const doesCurrencyNameExist = await prisma.currency.findFirst({
        where: {
          id: req.body.forex_currency_id
        }
      });
      if (!doesCurrencyNameExist) {
        return res.status(404).json({ error: 'Currency does not exist.' });
      }
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
        return res.status(200).json({ message: 'Forex Currency storage created.' });
      }
      if (currencyStorageExist) {
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
        if (req.body.accountOperation == "withdraw" && subtractedBalance == 0){
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


