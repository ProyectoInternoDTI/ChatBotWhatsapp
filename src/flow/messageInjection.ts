import 'dotenv/config'
import { createBot, MemoryDB, createProvider } from '@builderbot/bot'
import { BaileysProvider } from '@builderbot/provider-baileys'
import flow from './flow';

const PORT = process.env.PORT ?? 3001

const main = async () => {
    const provider = createProvider(BaileysProvider)

    const { handleCtx, httpServer } = await createBot({
        database: new MemoryDB(),
        provider,
        flow,
    })

    httpServer(+PORT)

    provider.server.post('/v1/messages', handleCtx(async (bot, req, res) => {
        const { number, message, media } = req.body
        await bot.sendMessage(number, message, { media }) // https://i.imgur.com/0HpzsEm.png
        return res.end('send')
    }))
}

main()
