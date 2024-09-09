import initFlow from "./initFlow";
import {messageExit} from "./messages";
import { addKeyword, EVENTS } from "@builderbot/bot";

export default addKeyword(EVENTS.ACTION)
    .addAnswer('Estas validando tu estado de tu solicitud',{capture:false}, async (ctx, { gotoFlow ,flowDynamic}) => {
        await flowDynamic(messageExit(ctx.pushName));
        return gotoFlow(initFlow)
    })