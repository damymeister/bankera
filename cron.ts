import { Cron } from "cron-async";
import * as updateRates from './lib/crons/updateRates'
import * as updateHistory from './lib/crons/updateHistory'

export const startCron = () => {
    const cron = new Cron()
    let crons = [updateRates, updateHistory]
    for (let i = 0; i < crons.length; i++) {
        cron.createJob(crons[i].name, {
            cron: crons[i].schedule,
            onTick: async () => {
                await crons[i].run()
            }
        })
    }
    console.info('[Server][CRON] Cron Started.')
}