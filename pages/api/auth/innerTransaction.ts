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
      const response = await prisma.inner_Transaction.findMany({ where: {wallet_id: wallet_id}});
      return res.status(200).json(response); 
    } catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
  }
  if (req.method === 'POST') {
    try {
      const {currency_pair_id, initial_amount, converted_amount, wallet_id } = req.body;
      if(wallet_id !== user.wallet_id) return res.status(400).json({ error: `Wallet does not match.`});
      const findCurrencyPair = await prisma.currency_Pair.findUnique({where: {id: currency_pair_id}});
      if (findCurrencyPair === null) return res.status(404).json({ error: 'Currency pair does not exist.' })
      if(findCurrencyPair.buy_currency_id === null || findCurrencyPair.sell_currency_id === null) return res.status(404).json({ error: 'Currency pair does not exist.' })

      const findCurrencyWithDraw = await prisma.currency_Storage.findFirst({
        where:{
          wallet_id: wallet_id,
          currency_id: findCurrencyPair.buy_currency_id
        }
      })
      if (findCurrencyWithDraw === null) return res.status(404).json({ error: 'You don not have this currency in your wallet.' })
      if (findCurrencyWithDraw.amount < initial_amount) return res.status(400).json({ error: 'You do not have enough currency to exchange.' })

      if(findCurrencyWithDraw.amount - initial_amount === 0) {
        await prisma.currency_Storage.delete({where: {id: findCurrencyWithDraw.id}})
      } else{
        await prisma.currency_Storage.update({
          where: {
            id: findCurrencyWithDraw.id}, 
            data: {amount: findCurrencyWithDraw.amount - initial_amount}
          })
      }

      const findCurrencyDeposit = await prisma.currency_Storage.findFirst({
        where:{
          wallet_id: wallet_id,
          currency_id: findCurrencyPair.sell_currency_id
        }
      })

      if (findCurrencyDeposit === null) {
        await prisma.currency_Storage.create({
          data: {
            wallet_id: wallet_id,
            currency_id: findCurrencyPair.sell_currency_id,
            amount: converted_amount
          }
        })
      } else {
        await prisma.currency_Storage.update({
          where: {
            id: findCurrencyDeposit.id}, 
            data: {amount: findCurrencyDeposit.amount + converted_amount}
          })
      }
      
      await prisma.inner_Transaction.create({data: {
        wallet_id: wallet_id,
        currency_pair_id: currency_pair_id,
        inital_amount: initial_amount,
        converted_amount: converted_amount,
        transaction_date: new Date(req.body.transaction_date)
      }})
      return res.status(201).json({ message: "Currency exchange completed successfully." })
    } catch(error) {
      return res.status(500).json({ message: 'Error while trying to exchange currencies.' });
    }
  }
  return res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}  