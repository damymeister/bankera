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
  if (req.method === 'GET') {
    try {
      if (!wallet_id) return res.status(404).json({error: 'User does not have a wallet!'})
      const wallet = await prisma.wallet.findUnique({
        where: { id: wallet_id }
      })
      if (!wallet) return res.status(404).json({error: 'Wallet not found'})
      return res.status(200).json({wallet_id: user.wallet_id, first_name: user.first_name, last_name: user.last_name });
    } catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
  } 
  if (req.method === 'POST') {
    try {
      if (user.wallet_id) {
        return res.status(404).json({ error: 'User can only have one wallet.' });
      }
      const createdWallet = await prisma.wallet.create({ data: { created_on: new Date()} });
      if (!createdWallet) {
        return res.status(404).json({ error: 'Error while creating wallet.' });
      }
      const new_wallet_id = createdWallet.id;
      const updatedUser = await prisma.user.update({
        where: {
          id: user_id, 
        },
        data: {
          wallet_id: new_wallet_id, 
        }
      });
      if (!updatedUser) {
        return res.status(404).json({ error: 'Error while assigning User to Wallet.' });
      }
      return res.status(200).json({ message: "Wallet Created Successfully", wallet_id: new_wallet_id });
    } catch (error) {
      console.error('Error while managing POST method', error);
      return res.status(500).json({ error: 'Error while creating wallet.' });
    }
  } 
  if (req.method === 'DELETE') {
    try {
      await prisma.user.update({
        where: {
          id: user_id
        },
        data: {
          wallet_id: null
        }
      });
      if (wallet_id !== null) {
        await prisma.wallet.delete({
          where: {id: wallet_id}, 
        });
      }
      return res.status(200).json({ message: "Wallet has been deleted" });
    } catch (error) {
      console.error('Error while deleting wallet', error);
      return res.status(500).json({ error: 'Server error occurred.' });
    }
  }
  return res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}