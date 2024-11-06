import { createBot } from '@builderbot/bot'
import { adapterProvider } from './provider'
import { adapterDB } from './database'
import { adapterFlow } from './flow'
import dotenv from 'dotenv';
import * as process from "process";
dotenv.config();
const PORT =  3008


const main = async () => {
    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    httpServer(+PORT)
}

main()
