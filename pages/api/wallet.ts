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

        const wallet_id = userWallet.wallet_id;
        const walletStorage = await prisma.currency_Storage.findMany({
          where: {
            wallet_id: wallet_id,
          },
        });
        if (walletStorage) {
          return res.status(200).json({walletStorage, first_name: userWallet.first_name, last_name: userWallet.last_name});
        } else {
          return res.status(404).json({ error: 'Data of User wallet not found.' });
        }
      } else {
        return res.status(401).json({ error: 'Permission denied. User is not authenticated.' });
      }
    } catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
  } /*else if (req.method === 'POST') {
    try {
      let token = getCookie('token', { req, res });
      if (token !== undefined) {
        let token_json = parseJwt(token);
        let user_id = parseInt(token_json._id);
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
        const currencyStorage =  await prisma.currency_Storage.create({ data: {currency_id: , wallet_id: , amount:}});
        if(!currencyStorage){
            return res.status(404).json({ error: 'Error while assigning creating Curreny Storage.' });
        }
        return res.status(200).json({ message: "Wallet Created Successfully" });
      }
      return res.status(500).json({ message: "Error while creating Wallet" });
    } catch (error) {
      console.error('Error while managing POST method', error);
      return res.status(500).json({ error: 'Error while creating wallet.' });
    }
  } else if (req.method === 'PUT') {
    try {
      let token = getCookie('token', { req, res });
      if (token !== undefined) {
        if (req.body.id !== undefined && !Array.isArray(req.body.id)) {
          await prisma.wallet.update({ where: { id: parseInt(req.body.id) }, data: { title: req.body.title, content: req.body.content } });
          return res.status(200).json({ message: "Portfel został pomyślnie edytowany!" });
        }
      }
      return res.status(500).json({ message: "Nie udało się edytować portfela" });
    } catch (error) {
      console.error('Błąd podczas obsługi zapytania PUT:', error);
      return res.status(500).json({ error: 'Wystąpił błąd serwera podczas edycji portfela.' });
    }
  } */else if (req.method === 'DELETE') {
    try {
      if (req.body.id !== undefined && !Array.isArray(req.body.id)) {
        await prisma.wallet.delete({ where: { id: parseInt(req.body.id) } });
        await prisma.user.update({
            where: {
              wallet_id: parseInt(req.body.id)
            },
            data: {
              wallet_id: null 
            }
          });
          await prisma.currency_Storage.deleteMany({
            where: {
              wallet_id: parseInt(req.body.id)
            }
          });
          
        return res.status(200).json({ message: "Portfel has been deleted" });
      }
      return res.status(500).json({ message: "Error while deleting wallet" });
    } catch (error) {
      console.error('Error while managing DELETE:', error);
      return res.status(500).json({ error: 'Error while deleting wallet occured.' });
    }
  } else {
    return res.status(500).json({ message: "This HTTP method is not supported." });
  }
}
