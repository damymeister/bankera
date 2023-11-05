import next from 'next'
import { parse } from 'url'
import { createServer } from 'http'
import { startCron } from './cron'

const dev = process.env.NODE_ENV !== 'production'
const hostname = (process.env.HOSTNAME !== undefined ? process.env.HOSTNAME : 'localhost')
const port = (process.env.NEXT_PUBLIC_PORT !== undefined ? parseInt(process.env.NEXT_PUBLIC_PORT) : 3000)
const app = next({dev, hostname, port})
const handle = app.getRequestHandler()
app.prepare().then(() => {
    startCron()
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
        console.log(`> Ready on http://${hostname}:${port}`)
    })
})
