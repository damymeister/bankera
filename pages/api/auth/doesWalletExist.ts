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
      if (wallet_id === null) return res.status(200).json({ wallet_id: -1 })
      return res.status(200).json({ wallet_id: wallet_id });
    } catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
  } 
}
  