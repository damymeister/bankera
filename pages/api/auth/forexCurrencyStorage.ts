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
  if (req.method === 'GET' && (req.query.forex_wallet_id === undefined || req.query.forex_wallet_id === null || req.query.forex_currency_id === undefined || req.query.forex_currency_id === null)) {
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
  if(req.method === 'GET' && req.query.forex_currency_id !== undefined && req.query.forex_currency_id !== null && req.query.forex_wallet_id !== undefined && req.query.forex_wallet_id !== null){
    if(parseInt(req.query.forex_wallet_id as string) !== forex_wallet_id) return res.status(400).json({ error: `Wallet does not match.`});
    try {
      const response =  await prisma.forex_Currency_Storage.findFirst({
        where: {forex_currency_id: parseInt(req.query.forex_currency_id as string), forex_wallet_id: forex_wallet_id},
      });
      return res.status(200).json(response);
    }
    catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
  }
}


