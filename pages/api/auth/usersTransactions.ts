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
  if (wallet_id === null) return res.status(404).json({ error: 'Wallet not found!' })
  if (req.method === 'POST') {
    try {
      const targetWallet = await prisma.wallet.findUnique({
        where: {
          id: req.body.userToUserTransaction.wallet_recipient_id,
        },
      });
      if (targetWallet === null) return res.status(404).json({ error: 'Target wallet does not exist.' })
      const { userToUserTransaction, withDrawData, dataUserToSend } = req.body; 
      
      const findSenderCurrencyStorage = await prisma.currency_Storage.findFirst({
        where: {
          id: withDrawData.id,
        },
      });
      if (findSenderCurrencyStorage === null) return res.status(404).json({ error: 'Currency storage does not exist.' })
      if (findSenderCurrencyStorage.amount < withDrawData.amount) return res.status(400).json({ error: 'Insufficient funds.' })
      if (findSenderCurrencyStorage.currency_id !== dataUserToSend.currency_id) return res.status(400).json({ error: 'Currency does not match.' })
      if (findSenderCurrencyStorage.wallet_id !== userToUserTransaction.wallet_sender_id) return res.status(400).json({ error: 'Wallet does not match.' })
      if (findSenderCurrencyStorage.wallet_id === dataUserToSend.wallet_id) return res.status(400).json({ error: 'You cannot send money to yourself.' })

      if ((findSenderCurrencyStorage.amount - withDrawData.amount) == 0){
        await prisma.currency_Storage.delete({
          where: {
            id: withDrawData.id,
          },
        });
      }else{
        await prisma.currency_Storage.update({
          where: {
            id: withDrawData.id,
          },
          data: {
            amount: (findSenderCurrencyStorage.amount - withDrawData.amount),
          },
      });
      }

      const findRecipientCurrencyStorage = await prisma.currency_Storage.findFirst({
        where: {
          wallet_id: dataUserToSend.wallet_id,
          currency_id: dataUserToSend.currency_id,
        },
      });

      if (findRecipientCurrencyStorage === null){
        await prisma.currency_Storage.create({
          data: {
            wallet_id: dataUserToSend.wallet_id,
            currency_id: dataUserToSend.currency_id,
            amount: dataUserToSend.amount,
          },
        });
      }else{
        await prisma.currency_Storage.update({
          where: {
            id: findRecipientCurrencyStorage.id,
          },
          data: {
            amount:findRecipientCurrencyStorage.amount + dataUserToSend.amount,
          },
        });
      }
      await prisma.user_to_User_Transaction.create({
        data: {
          wallet_sender_id: userToUserTransaction.wallet_sender_id,
          wallet_recipient_id: userToUserTransaction.wallet_recipient_id,
          transaction_date: new Date(userToUserTransaction.transaction_date),
          amount: userToUserTransaction.amount,
          currency_id: userToUserTransaction.currency_id,
        }
      })
      return res.status(201).json({ message: "Transfer sent successfully." })
    } catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ message: error });
    }
  }
  return res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}


  