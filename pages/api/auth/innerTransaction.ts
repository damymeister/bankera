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
      await prisma.inner_Transaction.create({data: {
        wallet_id: wallet_id,
        currency_pair_id: parseInt(req.body.currency_pair_id),
        inital_amount: parseFloat(req.body.initial_amount),
        converted_amount: parseFloat(req.body.converted_amount),
        transaction_date: new Date(req.body.transaction_date)
      }})
      return res.status(201).json({ message: "Currency exchange completed successfully." })
    } catch(error) {
      return res.status(500).json({ message: 'Error while trying to exchange currencies.' });
    }
  }
  return res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}  