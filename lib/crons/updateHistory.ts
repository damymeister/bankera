import prisma from "../prisma"

const MILLIS_IN_DAY = 24 * 60 * 60 * 1000

export const name = 'Update Currency History'
export const schedule = '0 10 * * * *'
export const run = async () => {
    console.log('[CRON] Adding new currency history...')
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
    console.log('[CRON] Done.')
    console.log('[CRON] Deleting old history...')
    // Set date of history expiration
    let date_threshold = new Date()
    date_threshold.setTime(date_threshold.getTime() - (MILLIS_IN_DAY * 30))
    await prisma.currency_History.deleteMany({where: {
        date: {lt: date_threshold}
    }})
    console.log('[CRON] Done.')
}