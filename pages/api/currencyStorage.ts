import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
import parseJwt from '@/lib/parse_jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    
    let token = getCookie('token', { req, res });

    if (token !== undefined) {
      let token_json = parseJwt(token);
      let user_id = parseInt(token_json._id);

    const wallet_currency_duplicate = await prisma.currency_Storage.count({
        where: {
            wallet_id: req.body.wallet_id,
            currency_id : req.body.currency_id,
        }
    })

    const user_wallet = await prisma.user.findUnique({
        where:{
            wallet_id: req.body.wallet_id,
            id: user_id,
        }
    })

    if (wallet_currency_duplicate && user_wallet) {
        return res.status(409).json({ message: "You can not add same currency twice!" })
    }
    await prisma.currency_Storage.create({data: {
        wallet_id: req.body.wallet_id,
        amount: req.body.amount,
        currency_id: req.body.currency_id,
    }})
    return res.status(201).json({ message: "Currency Storage for Wallet added." })
}
  }}
