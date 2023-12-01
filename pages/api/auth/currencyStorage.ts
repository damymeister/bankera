import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
import parseJwt from '@/lib/parse_jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getCookie('token', { req, res })
  if (!token) return res.status(401).json({error: 'Not Authorized! User Token does not exist!'})
  const token_json = parseJwt(token)
  const user_id = parseInt(token_json._id)
  const user = await prisma.user.findUnique({where: {id: user_id}})
  if (user === null) return res.status(404).json({ error: 'User not found!' })
  const wallet_id = user.wallet_id
  if (wallet_id === null) return res.status(404).json({ error: 'Wallet not found!' })
  if (req.method === 'GET') {
    try {
      const response =  await prisma.currency_Storage.findMany({
        where: {wallet_id: wallet_id}, 
      });
      return res.status(200).json(response);
    } catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
  }
  if (req.method === 'POST') {
    const doesCurrencyNameExist = await prisma.currency.findFirst({ 
      where: {
        id: req.body.currency_id
      }
    });
    if(!doesCurrencyNameExist) return res.status(404).json({ error: 'Currency does not exist.' });
    const wallet_currency_duplicate = await prisma.currency_Storage.findFirst({
      where: {
        wallet_id: wallet_id,
        currency_id : req.body.currency_id,
      }
    })
    if (wallet_currency_duplicate !== null) {
      return res.status(409).json({ message: "You can not add same currency twice!" })
    }
    await prisma.currency_Storage.create({data: {
      wallet_id: wallet_id,
      amount: req.body.amount,
      currency_id: req.body.currency_id,
    }})
    return res.status(201).json({ message: "Currency Storage for Wallet added." })
  }
  if (req.method === "PUT") {
    try {
      const doesCurrencyStorageExist = await prisma.currency_Storage.findFirst({
        where: {
          wallet_id: wallet_id,
          id: req.body.id
        }
      });
      if(!doesCurrencyStorageExist) return res.status(404).json({ error: 'Currency storage does not exist.' });
      const amountLeft = await prisma.currency_Storage.update({
        where: {
          id: req.body.id, 
        },
        data: {
          amount: req.body.amount,
        }
      });
      if(amountLeft.amount == 0){
        await prisma.currency_Storage.delete({
          where: {id: amountLeft.id}, 
        });
      }
      return res.status(200).json('Currency storage updated.');
    } catch (error) {
      console.error('Error while updating currency storage', error);
      return res.status(500).json({ error: 'Server error occurred.' });
    }
  }
}