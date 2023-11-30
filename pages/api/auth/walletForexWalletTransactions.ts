import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
import parseJwt from '@/lib/parse_jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
      try{
        let token = getCookie('token', { req, res });
        if (token !== undefined) {
          let token_json = parseJwt(token);
          let user_id = parseInt(token_json._id);
  
          const userWallet = await prisma.user.findUnique({
            where: {
              id: user_id,
            },
          });

          if(!userWallet?.wallet_id || !userWallet?.forex_wallet_id){
            return res.status(404).json({ error: 'User does not have required wallets.' });
          }

          if(req.body.wallet_id !== userWallet.wallet_id || req.body.forex_wallet_id !== userWallet.forex_wallet_id){
            return res.status(404).json({ error: 'User wallet does not match.' });
          }

          await prisma.wallet_Forex_Wallet_Transaction.create({data: {
              wallet_id: req.body.wallet_id,
              forex_wallet_id: req.body.forex_wallet_id,
              amount: req.body.amount,
              currency_id: req.body.currency_id,
              transaction_date: req.body.transaction_date
          }})
          return res.status(201).json({ message: "Transfer sent successfully." })
        }
        return res.status(404).json({ message: "User not authenticated." })
    }catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
  }
}

