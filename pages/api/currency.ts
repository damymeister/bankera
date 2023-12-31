import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
        const currencies = await prisma.currency.findMany();
        return res.status(200).json(currencies);
      }
     catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
}
  else {
    return res.status(500).json({ message: "This HTTP method is not supported." });
  }
}
