import BotWhatsapp from "@bot-whatsapp/bot";
import { getGlobalData } from "../flowold/setData";

export default BotWhatsapp.addKeyword(BotWhatsapp.EVENTS.ACTION)
    .addAnswer('📢 A continuación se enlistan las vacantes:',  { capture: true }, async (ctx, { gotoFlow, flowDynamic,state }) => {

        console.log('Next Education')
        return
    },)
    .addAnswer('Continue change next', { capture: false }, async (ctx, { flowDynamic, state, fallBack, gotoFlow }) => {
        try {
            const globalData = await getGlobalData();
            const data = globalData['Campanias'];
            console.log('Sacando el valor de la campaña ',ctx.body);
            console.log('Campania en estado:', state.get('Campania'));
            console.log('Datos de Campanias:', data);

            if (!data || data.length === 0) {
                await flowDynamic('No hay vacantes disponibles en este momento. 😔');
                return;
            }
            const formattedVacancies = data.map((vacancy, index) => `${index + 1}. ${vacancy}`).join('\n');
            await flowDynamic(`Estas son las vacantes disponibles:\n${formattedVacancies}`);
        } catch (error) {
            console.error('Error al obtener y mostrar vacantes:', error);
            await flowDynamic('Hubo un problema al obtener las vacantes. Por favor, inténtalo de nuevo más tarde. ⚠️');
        }
    });
