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

        const userWallet = await prisma.user.findUnique({
          where: {
            id: user_id,
          },
        });

        if (!userWallet) {
          return res.status(404).json({ error: 'User not found.' });
        }

        if (!userWallet.wallet_id) {
          return res.status(404).json({ error: 'User does not have specified ID.' });
        }
        
         return res.status(200).json({wallet_id: userWallet.wallet_id, first_name: userWallet.first_name, last_name: userWallet.last_name });
      
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

        if(findUser?.wallet_id){
          return res.status(404).json({ error: 'User can only have one wallet.' });
        }

        const createdWallet = await prisma.wallet.create({ data: { created_on: new Date()} });
        if(!createdWallet){
            return res.status(404).json({ error: 'Error while creating wallet.' });
        }
        const walletId = createdWallet.id;
        const updatedUser = await prisma.user.update({
            where: {
              id: user_id, 
            },
            data: {
              wallet_id: walletId, 
            }});
            
        if(!updatedUser){
            return res.status(404).json({ error: 'Error while assigning User to Wallet.' });
        }
        return res.status(200).json({ message: "Wallet Created Successfully", wallet_id : walletId });
      }
      return res.status(500).json({ message: "Error while creating Wallet" });
    } catch (error) {
      console.error('Error while managing POST method', error);
      return res.status(500).json({ error: 'Error while creating wallet.' });
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
            wallet_id: null
          }
        });
        
        await prisma.wallet.delete({
          where: {id: parseInt(req.query.id as string)}, 
        });

        return res.status(200).json({ message: "Wallet has been deleted" });
      } catch (error) {
        console.error('Error while deleting wallet', error);
        return res.status(500).json({ error: 'Server error occurred.' });
      }
    } else {
      return res.status(401).json({ error: 'Permission denied. User is not authenticated.' });
    }
  }
}