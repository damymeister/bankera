import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
import parseJwt from '@/lib/parse_jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      let token = getCookie('token', { req, res });
      if (token !== undefined) {
        let token_json = parseJwt(token);
        let user_id = parseInt(token_json._id);

        const userForexWallet = await prisma.user.findUnique({
          where: {
            id: user_id,
          },
        });

         return res.status(200).json({forex_wallet_id: userForexWallet?.forex_wallet_id, first_name: userForexWallet?.first_name, last_name: userForexWallet?.last_name });
      
      } else {
        return res.status(401).json({ error: 'Permission denied. User is not authenticated.' });
      }
    } catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
  } 
  if (req.method === 'POST') {
    try {
      let token = getCookie('token', { req, res });
      if (token !== undefined) {
        let token_json = parseJwt(token);
        let user_id = parseInt(token_json._id);
        const findUser = await prisma.user.findUnique({
          where: {
            id: user_id,
          },
        });

        if(findUser?.forex_wallet_id){
          return res.status(404).json({ error: 'User can only have one wallet.' });
        }

        const createdForexWallet = await prisma.forex_Wallet.create({ data: { created_on: new Date()} });
        if(!createdForexWallet){
            return res.status(404).json({ error: 'Error while creating Forex wallet.' });
        }
        const forexWalletId = createdForexWallet.id;
        const updatedUser = await prisma.user.update({
            where: {
              id: user_id, 
            },
            data: {
              forex_wallet_id: forexWalletId, 
            }});
            
        if(!updatedUser){
            return res.status(404).json({ error: 'Error while assigning User to Forex Wallet.' });
        }
        return res.status(200).json({ message: "Forex Wallet Created Successfully", forex_wallet_id : forexWalletId });
      }
      return res.status(500).json({ message: "Error while creating Forex Wallet" });
    } catch (error) {
      console.error('Error while managing POST method', error);
      return res.status(500).json({ error: 'Error while creating Forex Wallet.' });
    }
  } 
  if (req.method === 'DELETE') {
  let token = getCookie('token', { req, res });
    if (token !== undefined) {
      try {
        let token_json = parseJwt(token);
        let user_id = parseInt(token_json._id);
        
        await prisma.user.update({
          where: {
            id: user_id
          },
          data: {
            forex_wallet_id: null
          }
        });

        await prisma.forex_Wallet.delete({
          where: {id: parseInt(req.query.id as string)}, 
        });


        return res.status(200).json({ message: "Forex wallet has been deleted" });
      } catch (error) {
        console.error('Error while deleting Forex Wallet', error);
        return res.status(500).json({error});
      }
    } else {
      return res.status(401).json({ error: 'Permission denied. User is not authenticated.' });
    }
  }
}