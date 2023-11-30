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
        const user = await prisma.user.findUnique({where:{id: user_id}})
        
        if (user !== null && user.wallet_id) {
          const response =  await prisma.currency_Storage.findMany({
            where: {wallet_id: user.wallet_id}, 
          });
          return res.status(200).json(response);
        }
        return res.status(401).json({ error: 'Permission denied. User is not authenticated.' });
      }
      return res.status(401).json({ error: 'Permission denied. User is not authenticated.' });
    } catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
  }
  if (req.method === 'POST') {
    
    let token = getCookie('token', { req, res });

    if (token !== undefined) {
      let token_json = parseJwt(token);
      let user_id = parseInt(token_json._id);

    const doesCurrencyNameExist = await prisma.currency.findFirst({ 
      where: {
        id: req.body.currency_id
      }
    });

    const doesWalletExist = await prisma.wallet.findFirst({ 
      where: {
        id: req.body.wallet_id
      }
    });

    if(!doesCurrencyNameExist || !doesWalletExist){
      return res.status(404).json({ error: 'Currency or Wallet does not exist.' });
    }

    const wallet_currency_duplicate = await prisma.currency_Storage.findFirst({
        where: {
            wallet_id: req.body.wallet_id,
            currency_id : req.body.currency_id,
        }
    })

    const user_wallet = await prisma.user.findUnique({
        where:{
            wallet_id: req.body.wallet_id,
            id: user_id,
        }
    })

    if (wallet_currency_duplicate !== null && user_wallet !== null) {
        return res.status(409).json({ message: "You can not add same currency twice!" })
    }
    await prisma.currency_Storage.create({data: {
        wallet_id: req.body.wallet_id,
        amount: req.body.amount,
        currency_id: req.body.currency_id,
    }})
    return res.status(201).json({ message: "Currency Storage for Wallet added." })
}
  }
  if (req.method === "PUT") {
      try {


        const doesCurrencyStorageExist = await prisma.currency_Storage.findFirst({
          where: {
            id: req.body.id
          }
        });

        if(!doesCurrencyStorageExist){
          return res.status(404).json({ error: 'Currency storage does not exist.' });
        }

        const amountLeft = await prisma.currency_Storage.update({
          where: {
            id: req.body.id, 
          },
          data: {
            amount: req.body.amount,
          }
        });
        if(amountLeft.amount == 0){
          await prisma.currency_Storage.delete({
            where: {id: amountLeft.id}, 
          });
        }
        return res.status(200).json('Currency storage updated.');
      } catch (error) {
        console.error('Error while updating currency storage', error);
        return res.status(500).json({ error: 'Server error occurred.' });
      }
    }
}