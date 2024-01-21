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
  const forex_wallet_id = user.forex_wallet_id
  if (wallet_id === null) return res.status(404).json({ error: 'Wallet not found!' })
  if (forex_wallet_id === null) return res.status(404).json({ error: 'Forex Wallet not found!' })
  if (req.method === 'POST') {
    try {
      const {currency_id, amount, wallet_id, operation_type, forex_wallet_id} = req.body;
      if(wallet_id !== user.wallet_id) return res.status(400).json({ error: `Wallet does not match.`});
      if(forex_wallet_id !== user.forex_wallet_id) return res.status(400).json({ error: `Forex Wallet does not match.`});
      const checkCurrencyExistence = await prisma.currency.findUnique({where: {id: currency_id}})
      if (checkCurrencyExistence === null) return res.status(404).json({ error: 'Currency does not exist.' })

      const findCurrencyStorage = await prisma.currency_Storage.findFirst({
        where:{
          wallet_id: wallet_id,
          currency_id: currency_id
        }
      })

      const findForexWalletStorage = await prisma.forex_Currency_Storage.findFirst({
        where:{
          forex_wallet_id: forex_wallet_id,
          forex_currency_id: currency_id
        }
      })  

      if(operation_type === 'walletForexWallet') {
       if (findCurrencyStorage === null) return res.status(404).json({ error: 'You don not have this currency in your wallet.' });
       if (findCurrencyStorage.amount < amount) return res.status(400).json({ error: 'You do not have enough currency to exchange.' });

        await prisma.$transaction(async (prisma) => {

        if (findCurrencyStorage.amount - amount === 0) {
          await prisma.currency_Storage.delete({where: {id: findCurrencyStorage.id}})
        } else {
          await prisma.currency_Storage.update({
            where: {
              id: findCurrencyStorage.id}, 
              data: {amount: findCurrencyStorage.amount - amount}
            })
        }

        await prisma.forex_Currency_Storage.upsert({
          where: {
           id: findForexWalletStorage?.id || 0
          },
          create: {
            forex_wallet_id: forex_wallet_id,
            forex_currency_id: currency_id,
            forex_currency_amount: amount
          },
          update: {
            forex_currency_amount: {
              increment: amount
            }
          }
        })

      })
      } else if(operation_type === 'forexWalletWallet') {
          if (findForexWalletStorage === null) return res.status(404).json({ error: 'You don not have this currency in your Forex wallet.' });
          if (findForexWalletStorage.forex_currency_amount < amount) return res.status(400).json({ error: 'You do not have enough currency to exchange.' });

          
          await prisma.$transaction(async (prisma) => {

          if (findForexWalletStorage.forex_currency_amount - amount === 0) {
            await prisma.forex_Currency_Storage.delete({where: {id: findForexWalletStorage.id}})
          } else {
            await prisma.forex_Currency_Storage.update({
              where: {
                id: findForexWalletStorage.id}, 
                data: {forex_currency_amount: findForexWalletStorage.forex_currency_amount - amount}
              })
          }
         await prisma.currency_Storage.upsert({
            where: {
             id: findCurrencyStorage?.id || 0
            },
            create: {
              wallet_id: wallet_id,
              currency_id: currency_id,
              amount: amount
            },
            update: {
              amount: {
                increment: amount
              }
            }
          })
      })
      await prisma.wallet_Forex_Wallet_Transaction.create({data: {
        wallet_id: wallet_id,
        forex_wallet_id: forex_wallet_id,
        amount: amount,
        currency_id: currency_id,
        transaction_date: req.body.transaction_date
      }})
      return res.status(201).json({ message: "Transfer sent successfully." })
      }
    } catch (error) {
      console.error('Error while managing request', error);
      return res.status(500).json({ error: 'Server error occured.' });
    }
  }
  return res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}

