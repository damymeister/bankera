import { Cron } from "cron-async";
import * as updateRates from './lib/crons/updateRates'

export const startCron = () => {
    const cron = new Cron()
    let crons = [updateRates]
    for (let i = 0; i < crons.length; i++) {
        cron.createJob(crons[i].name, {
            cron: crons[i].schedule,
            onTick: async () => {
                await updateRates.run()
            }
        })
    }
    console.info('[Server][CRON] Cron Started.')
}