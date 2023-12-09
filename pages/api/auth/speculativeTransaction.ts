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
  const forex_wallet_id = user.forex_wallet_id;
  if (forex_wallet_id === null) return res.status(404).json({ error: 'Forex Wallet not found!' })
  if (req.method === 'GET') {
    try {
      const response = await prisma.speculative_Transaction.findMany({ where: {forex_wallet_id: forex_wallet_id}});
      return res.status(200).json(response);
    } catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
  }
  if (req.method === 'POST') {
    try {
      const { forex_wallet_id, transaction_type, currency_pair_id, financial_leverage, lots, entry_course_value, transaction_balance, entry_date, stop_loss, take_profit, pip_price } = req.body;
      if(forex_wallet_id !== user.forex_wallet_id) return res.status(400).json({ error: `Wallet does not match.`});
      const findCurrencyPair = await prisma.currency_Pair.findUnique({where: {id: currency_pair_id}});
      if (findCurrencyPair === null) return res.status(404).json({ error: 'Currency pair does not exist.' })
      if(findCurrencyPair.buy_currency_id === null || findCurrencyPair.sell_currency_id === null) return res.status(404).json({ error: 'Currency pair does not exist.' })
      if (stop_loss !== undefined && stop_loss !== null) {
        var stopLoss = stop_loss;
      }
  
      if (take_profit !== undefined && take_profit !== null) {
        var takeProfit = take_profit;
      }

      await prisma.speculative_Transaction.create({
        data: {
          forex_wallet_id: forex_wallet_id,
          transaction_type: transaction_type,
          currency_pair_id: currency_pair_id,
          financial_leverage: financial_leverage,
          lots: lots,
          entry_course_value: entry_course_value,
          transaction_balance: transaction_balance,
          entry_date: entry_date,
          pip_price: pip_price,
          stop_loss: stopLoss,
          take_profit: takeProfit,
        }
      })

      return res.status(201).json({ message: "Speculative transaction created successfully." })
    } catch(error) {
      return res.status(500).json({ message: error});
    }
  }
  if(req.method === 'PUT') {
    try{
      const { id, forex_wallet_id, exit_course_value, exit_date } = req.body;
      if(forex_wallet_id !== user.forex_wallet_id) return res.status(400).json({ error: `Wallet does not match.`});
      const findSpeculativeTransaction = await prisma.speculative_Transaction.findUnique({where: {id: id}});
      if (findSpeculativeTransaction === null) return res.status(404).json({ error: 'Speculative transaction does not exist.' })
      await prisma.speculative_Transaction.update({
        where: { 
          id: id,
          forex_wallet_id: forex_wallet_id },
        data: {
          exit_course_value: exit_course_value,
          exit_date: exit_date
        }
      })
      return res.status(200).json({ message: "Speculative transaction updated successfully." })
    } catch(error) {
      return res.status(500).json({ message: 'Error while trying to update speculative transaction.' });
    }
  }
  return res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}  