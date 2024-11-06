import BotWhatsapp from "@bot-whatsapp/bot";
import initFlow from "./initFlow";
import { messageExit} from "./messages";
import {addKeyword, EVENTS} from "@builderbot/bot";

export default addKeyword(EVENTS.ACTION)
    .addAnswer('El ciclo ha sido reiniciado y la entrevista está lista para comenzar de nuevo.',{capture:false}, async (ctx, { gotoFlow ,flowDynamic}) => {
        await flowDynamic(messageExit(ctx.pushName));
        return gotoFlow(initFlow)
    })