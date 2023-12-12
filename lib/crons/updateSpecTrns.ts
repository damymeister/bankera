import { Speculative_Transaction } from "@prisma/client"
import prisma from "../prisma"
import { CHeaders, Color } from "../console"

const CNAME = '&dUST &f:&r'
const TRNS_BUY = 1
const TRNS_SELL = 2

export const name = 'Update Speculative Transactions'
export const schedule = '0 15,45 * * * *'
export const run = async () => {
    const openTransactions = await prisma.speculative_Transaction.findMany({where: {exit_date: null, exit_course_value: null}})
    console.log(Color.formatted(`${CHeaders.Cron}${CHeaders.TASKCALL} ${CNAME} &6Updating open transactions...`))
    for (let i = 0; i < openTransactions.length; i++) {
        const currTrns = openTransactions[i]
        const currency_pair = await prisma.currency_Pair.findUnique({where: {id: openTransactions[i].currency_pair_id}})
        const date = new Date()
        if (currency_pair !== null) {
            const profit_loss = calculateProfitLoss(currTrns, currency_pair.conversion_value)
            if (stopLoss(currTrns, currency_pair.conversion_value) ||
                takeProfit(currTrns, currency_pair.conversion_value)) {
                console.log(Color.formatted(`${CHeaders.Cron}${CHeaders.TASKCALL} ${CNAME} &6Closing transaction with id ${currTrns.id}...`))
                // Close Speculative Transaction
                await prisma.speculative_Transaction.update({
                    where: {id: currTrns.id},
                    data: {
                        exit_date: date,
                        exit_course_value: currency_pair.conversion_value,
                        profit_loss: profit_loss
                    }
                })
                // Update Forex Currency Storage or create if it does not exist
                const forexStorage = await prisma.forex_Currency_Storage.findFirst({where: {
                    forex_wallet_id: currTrns.forex_wallet_id, forex_currency_id: currTrns.base_currency_id
                }})
                if (forexStorage === null) {
                    await prisma.forex_Currency_Storage.create({
                        data: {
                            forex_wallet_id: currTrns.forex_wallet_id,
                            forex_currency_id: currTrns.base_currency_id,
                            forex_currency_amount: currTrns.deposit_amount + profit_loss,
                        }
                    })
                }
                else {
                    await prisma.forex_Currency_Storage.update({
                        where: {id: forexStorage.id},
                        data: {
                            forex_currency_amount: forexStorage.forex_currency_amount + currTrns.deposit_amount + profit_loss
                        }
                    })
                }
                console.log(Color.formatted(`${CHeaders.Cron}${CHeaders.TASKACK} ${CNAME} &2Done.`))
            }
            else {
                // Continue - Update profit/loss
                await prisma.speculative_Transaction.update({
                    where: {id: currTrns.id},
                    data: {
                        profit_loss: profit_loss
                    }
                })
            }
        }
    }
    console.log(Color.formatted(`${CHeaders.Cron}${CHeaders.TASKACK} ${CNAME} &2Done.`))
}

const calculateProfitLoss = (transaction: Speculative_Transaction, course_value: number) => {
    if (transaction.transaction_type === TRNS_BUY) {
        return ((course_value - transaction.entry_course_value) * transaction.transaction_balance)
    }
    return ((transaction.entry_course_value - course_value) * transaction.transaction_balance)
}

const stopLoss = (transaction: Speculative_Transaction, course_value: number) => {
    if (transaction.stop_loss || transaction.stop_loss === -1) {
        if (transaction.transaction_type === TRNS_BUY) {
            return (transaction.stop_loss <= course_value)
        }
        if (transaction.transaction_type === TRNS_SELL) {
            return (transaction.stop_loss >= course_value)
        }
    }
    return false
}

const takeProfit = (transaction: Speculative_Transaction, course_value: number) => {
    if (transaction.take_profit || transaction.take_profit === -1) {
        if (transaction.transaction_type === TRNS_BUY) {
            return (transaction.take_profit >= course_value)
        }
        if (transaction.transaction_type === TRNS_SELL) {
            return (transaction.take_profit <= course_value)
        }
    }
    return false
}