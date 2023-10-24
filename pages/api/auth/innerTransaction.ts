import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      let token = getCookie('token', { req, res });
      if (token !== undefined) {
      const response =  await prisma.inner_Transaction.findMany();
        return res.status(200).json(response);
      } else {
        return res.status(401).json({ error: 'Permission denied. User is not authenticated.' });
      }
    } catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
  }
  if (req.method === 'POST') {
    try{
    let token = getCookie('token', { req, res });

    if (token !== undefined) {
    await prisma.inner_Transaction.create({data: {
        wallet_id: req.body.wallet_id,
        currency_pair_id: req.body.currency_pair_id,
        inital_amount: req.body.initial_amount,
        converted_amount: req.body.converted_amount,
        transaction_date: req.body.transaction_date
    }})
    return res.status(201).json({ message: "Currency exchange completed successfully." })
  }
    } catch(error){
      return res.status(500).json({ message: 'Error while trying to exchange currencies.' });
    }
  }
}  