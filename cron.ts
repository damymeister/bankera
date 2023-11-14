import { Cron } from "cron-async";
import * as updateRates from './lib/crons/updateRates'
import * as updateHistory from './lib/crons/updateHistory'
import { CHeaders, Color } from "./lib/console";

export const startCron = () => {
    const cron = new Cron()
    let crons = [updateRates, updateHistory]
    for (let i = 0; i < crons.length; i++) {
        cron.createJob(crons[i].name, {
            cron: crons[i].schedule,
            onTick: async () => {
                console.log(Color.formatted(`${CHeaders.Cron}${CHeaders.CALL} Running ${crons[i].name}...`))
                await crons[i].run()
                console.log(Color.formatted(`${CHeaders.Cron}${CHeaders.ACK} Done.`))
            },
        })
    }
    console.log(Color.formatted(`${CHeaders.Cron}${CHeaders.Info} Cron started.`))
}