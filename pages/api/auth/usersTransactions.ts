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
  
          const sennderWallet = await prisma.user.findUnique({
            where: {
              id: user_id,
            },
          });

          const recipientUser = await prisma.user.findUnique({
            where: {
              wallet_id: req.body.wallet_recipient_id,
            },
          });

          if(req.body.wallet_sender_id !== sennderWallet?.wallet_id){
            return res.status(404).json({ error: 'User wallet does not match.' });
          }


          if(!sennderWallet?.wallet_id || !recipientUser?.wallet_id){
            return res.status(404).json({ error: 'Users do not have required wallets.' });
          }

          await prisma.user_to_User_Transaction.create({data: {
              wallet_sender_id: req.body.wallet_sender_id,
              wallet_recipient_id: req.body.wallet_recipient_id,
              transaction_date: req.body.transaction_date,
              amount: req.body.amount,
              currency_id: req.body.currency_id,
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

