import prisma from "../prisma"
import { getPastTimestamp } from "../time"

export const name = 'Update Currency History'
export const schedule = '0 10 * * * *'
export const run = async () => {
    let current_date = new Date()
    let pairs = await prisma.currency_Pair.findMany()
    for (let i = 0; i < pairs.length; i++) {
        await prisma.currency_History.create(
            {data: {
                sell_currency_id: pairs[i].sell_currency_id,
                buy_currency_id: pairs[i].buy_currency_id,
                conversion_value: pairs[i].conversion_value,
                date: current_date
            }}
        )
    }
    // Set date of history expiration
    let date_threshold = new Date()
    date_threshold.setTime(getPastTimestamp('7d'))
    await prisma.currency_History.deleteMany({where: {
        date: {lt: date_threshold}
    }})
}