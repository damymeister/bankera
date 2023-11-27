import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
      try{
        await prisma.wallet_Forex_Wallet_Transaction.create({data: {
            wallet_id: req.body.wallet_id,
            forex_wallet_id: req.body.forex_wallet_id,
            amount: req.body.amount,
            currency_id: req.body.currency_id,
            transaction_date: req.body.transaction_date
        }})
      return res.status(201).json({ message: "Transfer sent successfully." })
    }catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
  }
}

