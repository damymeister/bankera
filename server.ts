import next from 'next'
import { parse } from 'url'
import { createServer } from 'http'
import { startCron } from './cron'
import { CHeaders, Color } from './lib/console'

const hostnameSelector = () => {
    if (process.env.NEXT_PUBLIC_NET_TYPE) {
        if (process.env.NEXT_PUBLIC_NET_TYPE === 'LOCAL' && process.env.LOCAL_HOSTNAME) {
            return process.env.LOCAL_HOSTNAME
        }
        if (process.env.NEXT_PUBLIC_NET_TYPE === 'REMOTE' && process.env.REMOTE_HOSTNAME) {
            return process.env.REMOTE_HOSTNAME
        }
        return 'dingomc.net'
    }
    return 'localhost'
}

const dev = process.env.NODE_ENV !== 'production'
const hostname = hostnameSelector()
const port = (process.env.NEXT_PUBLIC_PORT !== undefined ? parseInt(process.env.NEXT_PUBLIC_PORT) : 3000)
const app = next({dev, hostname, port})
const handle = app.getRequestHandler()
app.prepare().then(() => {
    console.log(Color.formatted(`${CHeaders.Server}${CHeaders.Info} Starting server...`))
    if (!dev) startCron()
    else console.log(Color.formatted(`${CHeaders.Server}${CHeaders.Info} CRON is disabled in dev mode.`))
    const server = createServer(async (req: any, res: any) => {
        try {
            // Be sure to pass `true` as the second argument to `url.parse`.
            // This tells it to parse the query portion of the URL.
            const parsedUrl = parse(req.url, true)
            await handle(req, res, parsedUrl)
        } catch (err) {
            console.error('Error occurred handling', req.url, err)
            res.statusCode = 500
            res.end('Internal server error')
        }
    })
    .once('error', (err: any) => {
        console.error(err)
        process.exit(1)
    })
    .listen(port, () => {
        console.log(Color.formatted(`${CHeaders.Server}${CHeaders.Info} Ready on http://${hostname}:${port}`))
    })
})
