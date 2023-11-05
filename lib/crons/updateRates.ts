import getCurrencyPairs from "../currency_rates"

export const name = 'Update Currency Rates'
export const schedule = '0 0 * * * *'
export const run = async () => {
    await getCurrencyPairs()
}