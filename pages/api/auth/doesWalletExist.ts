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
  
          const userWallet= await prisma.user.findUnique({
            where: {
              id: user_id,
            },
          });
  
          if (userWallet && userWallet.wallet_id !== null) {
            return res.status(200).json({ wallet_id: userWallet.wallet_id });
          } else {
            return res.status(404).json({ error: 'Forex wallet ID not found or is null.' });
          }
        } else {
          return res.status(401).json({ error: 'Permission denied. User is not authenticated.' });
        }
      } catch (error) {
        console.error('Error while managing request', error);
        return res.status(500).json({ error: 'Server error occurred.' });
      }
    } 
  }
  