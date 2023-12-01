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
  const forex_wallet_id = user.forex_wallet_id
  if (req.method === 'GET') {
    try {
      return res.status(200).json({
        forex_wallet_id: user.forex_wallet_id,
        first_name: user.first_name,
        last_name: user.last_name
      });
    } catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
  } 
  if (req.method === 'POST') {
    try {
      if (forex_wallet_id) {
        return res.status(404).json({ error: 'User can only have one wallet.' });
      }
      const createdForexWallet = await prisma.forex_Wallet.create({ data: { created_on: new Date()} });
      if (!createdForexWallet) {
        return res.status(404).json({ error: 'Error while creating Forex wallet.' });
      }
      const updatedUser = await prisma.user.update({
        where: {
          id: user_id, 
        },
        data: {
          forex_wallet_id: forex_wallet_id, 
        }
      });
      if (!updatedUser) {
        return res.status(404).json({ error: 'Error while assigning User to Forex Wallet.' });
      }
      return res.status(200).json({ message: "Forex Wallet Created Successfully", forex_wallet_id : forex_wallet_id })
    } catch (error) {
      console.error('Error while managing POST method', error);
      return res.status(500).json({ error: 'Error while creating Forex Wallet.' });
    }
  } 
  if (req.method === 'DELETE') {
    try {
      await prisma.user.update({
        where: {
          id: user_id
        },
        data: {
          forex_wallet_id: null
        }
      });
      if (forex_wallet_id) {
        await prisma.forex_Wallet.delete({
          where: {id: forex_wallet_id}, 
        });
      }
      return res.status(200).json({ message: "Forex wallet has been deleted" });
    } catch (error) {
      console.error('Error while deleting Forex Wallet', error);
      return res.status(500).json({error});
    }
  }
}