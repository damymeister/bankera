import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
      try{
      await prisma.user_to_User_Transaction.create({data: {
          wallet_sender_id: req.body.wallet_sender_id,
          wallet_recipient_id: req.body.wallet_recipient_id,
          transaction_date: req.body.transaction_date,
          amount: req.body.amount,
          currency_id: req.body.currency_id,
      }})
      return res.status(201).json({ message: "Transfer sent successfully." })
    }catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
  }
}

