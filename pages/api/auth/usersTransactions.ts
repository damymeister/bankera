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
  if (req.method === 'POST') {
    try {
      const targetWallet = await prisma.wallet.findUnique({
        where: {
          id: req.body.wallet_recipient_id,
        },
      });
      if (targetWallet === null) return res.status(404).json({ error: 'Target wallet does not exist.' })
      await prisma.user_to_User_Transaction.create({data: {
        wallet_sender_id: wallet_id,
        wallet_recipient_id: req.body.wallet_recipient_id,
        transaction_date: req.body.transaction_date,
        amount: req.body.amount,
        currency_id: req.body.currency_id,
      }})
      return res.status(201).json({ message: "Transfer sent successfully." })
    } catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
  }
  return res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}

