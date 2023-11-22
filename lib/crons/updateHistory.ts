import { CHeaders, Color } from "../console"
import prisma from "../prisma"
import { getPastTimestamp } from "../time"

export const name = 'Update Currency History'
export const schedule = '0 0,30 * * * *'
export const run = async () => {
    // Set date of history expiration
    let date_threshold = new Date()
    date_threshold.setTime(getPastTimestamp('7d'))
    console.log(Color.formatted(`${CHeaders.Cron}${CHeaders.TASKCALL} &6Removing old history...`))
    await prisma.currency_History.deleteMany({where: {
        date: {lt: date_threshold}
    }})
    console.log(Color.formatted(`${CHeaders.Cron}${CHeaders.TASKACK} &2Done.`))
}