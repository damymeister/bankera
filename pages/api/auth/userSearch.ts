import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { searchPhrase } = req.query;
      if (!searchPhrase) {
        return res.status(404).json({ error: 'You need to change searching phrase!' });
      }
      var searchWords : string [] = [];

      if (searchPhrase.includes(' ')) {
        searchWords = (searchPhrase.toString()).split(' ');
      } else {
        searchWords.push(searchPhrase.toString());
      }
      const userProfiles = await prisma.user.findMany({
        where: {
          AND: [
            {
              OR: searchWords.map((word: string) => ({
                OR: [
                  { first_name: { contains: word } },
                  { last_name: { contains: word } },
                  { email: { contains: word } }
                ]
              }))
            },
            {
              NOT: [
                { wallet_id: 0 }, 
                { wallet_id: null } ,
                { wallet_id: undefined}
              ]
            }
          ]
        },
        select: {
          first_name: true,
          last_name: true,
          email: true,
          id: true,
          wallet_id: true,
        }
      });
      if (!userProfiles) return res.status(404).json({ error: 'Change searching phrase.' });
      return res.status(200).json({ userProfiles });
    }
    catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
  }
}
    