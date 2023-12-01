const MILLIS_IN_HOUR = 1000 * 60 * 60
const MILLIS_IN_DAY = MILLIS_IN_HOUR * 24

export const getTimestamp = (f_time: string) => {
    if (f_time.endsWith('h')) return parseInt(f_time.slice(0, f_time.length - 1)) * MILLIS_IN_HOUR
    if (f_time.endsWith('d')) return parseInt(f_time.slice(0, f_time.length - 1)) * MILLIS_IN_DAY
    return 0
}
export const getHours = (f_time: string) => {
    if (f_time.endsWith('h')) return parseInt(f_time.slice(0, f_time.length - 1))
    if (f_time.endsWith('d')) return parseInt(f_time.slice(0, f_time.length - 1)) * 24
    return 0
}
export const getCurrentTimestamp = () => {
    let d = new Date()
    return d.getTime()
}
export const getFutureTimestamp = (future_f_time_diff: string) => {
    return getCurrentTimestamp() + getTimestamp(future_f_time_diff)
}
export const getPastTimestamp = (past_f_time_diff: string) => {
    return getCurrentTimestamp() - getTimestamp(past_f_time_diff)
}