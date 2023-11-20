// Define console colored headers here
export enum CHeaders {
    Server = '^0&2[&aServer&2]&r',
    Info = '^0&3[&bInfo&3]&r',
    Error = '^0&4[&cError&4]&r',
    Cron = '^0&5[&dCron&5]&r',
    Mid = '^0&1[&bMid&1]&r',
    ACK = '^0&2[&aACK&2]&r',
    CALL = '^0&8[&7CALL&8]&r'
}
export enum Colors {
    Black = "0",
    DarkBlue = "1",
    DarkGreen = "2",
    Cyan = "3",
    DarkRed = "4",
    Purple = "5",
    Gold = "6",
    Gray = "7",
    DarkGray = "8",
    Blue = "9",
    Green = "a",
    Aqua = "b",
    Red = "c",
    Magenta = "d",
    Yellow = "e",
    White = "f",
}
const fgColorMap = {
    "0": "\x1b[0m\x1b[30m",
    "1": "\x1b[0m\x1b[34m",
    "2": "\x1b[0m\x1b[32m",
    "3": "\x1b[0m\x1b[36m",
    "4": "\x1b[0m\x1b[31m",
    "5": "\x1b[0m\x1b[35m",
    "6": "\x1b[0m\x1b[33m",
    "7": "\x1b[0m\x1b[37m",
    "8": "\x1b[1m\x1b[90m",
    "9": "\x1b[1m\x1b[94m",
    "a": "\x1b[1m\x1b[92m",
    "b": "\x1b[1m\x1b[96m",
    "c": "\x1b[1m\x1b[91m",
    "d": "\x1b[1m\x1b[95m",
    "e": "\x1b[1m\x1b[93m",
    "f": "\x1b[1m\x1b[97m",
    "r": "\x1b[0m",
}
const bgColorMap = {
    "0": "\x1b[0m\x1b[40m",
    "1": "\x1b[0m\x1b[44m",
    "2": "\x1b[0m\x1b[42m",
    "3": "\x1b[0m\x1b[46m",
    "4": "\x1b[0m\x1b[41m",
    "5": "\x1b[0m\x1b[45m",
    "6": "\x1b[0m\x1b[43m",
    "7": "\x1b[0m\x1b[47m",
    "8": "\x1b[1m\x1b[100m",
    "9": "\x1b[1m\x1b[104m",
    "a": "\x1b[1m\x1b[102m",
    "b": "\x1b[1m\x1b[106m",
    "c": "\x1b[1m\x1b[101m",
    "d": "\x1b[1m\x1b[105m",
    "e": "\x1b[1m\x1b[103m",
    "f": "\x1b[1m\x1b[107m",
    "r": "\x1b[0m",
}
const fgFormatter = '&'
const bgFormatter = '^'
export class Color {
    public static formatted (formattedText : string) {
        let t = formattedText
        if (!t.endsWith(fgFormatter + 'r') && !t.endsWith(bgFormatter + 'r')) t += '&r'
        for (const [key, val] of Object.entries(bgColorMap)) {
            let find = bgFormatter + key
            t = t.replaceAll(find, val)
        }
        for (const [key, val] of Object.entries(fgColorMap)) {
            let find = fgFormatter + key
            t = t.replaceAll(find, val)
        }
        return t
    }

    public static formatText (text: string, color: Colors = Colors.White, backgroundColor: Colors = Colors.Black) {
        return bgColorMap[backgroundColor] + fgColorMap[color] + text + fgColorMap["r"]
    }
}