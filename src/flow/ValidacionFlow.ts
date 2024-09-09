import { getuser, getVacanteMessage } from "./setData";
import { changeStatusVacante, updateStatus } from "./changeData";
import initFlow from "./initFlow";
import requiscionesFlow from "./requiscionesFlow";
import {addKeyword, EVENTS} from "@builderbot/bot";

export default addKeyword(EVENTS.ACTION)
    .addAnswer('👋', { capture: false }, async (ctx, { flowDynamic }) => {
        const userdata = await getuser()[0];
        await flowDynamic('*' + userdata['NOMBRE_CANDIDATO'] + '*! \nTienes un registro activo. ¿Qué te gustaría hacer? \n\n1️⃣ Validar el estado de tu solicitud \n2️⃣ Continuar con una nueva postulación 📝');
    })
    .addAnswer('*Por favor, selecciona una opción válida*', { capture: true}, async (ctx, { flowDynamic, gotoFlow, fallBack, state }) => {
        if (state.get('propuesta')){
            const userInput = parseInt(ctx.body.trim());
            if (isNaN(userInput) || (userInput !== 1 && userInput !== 2)) {
                return  fallBack('⚠️ *Por favor, ingresa una opción válida:* 1️⃣ para Sí o 2️⃣ para No.');
            } else if (userInput === 1) {
                await updateStatus(state.get('ID_PROPUESTA'), 'propuestas');
                await state.update({propuesta:false});
                await flowDynamic('🎉 *¡Excelente!*\n\nPor favor, sigue las indicaciones de la propuesta laboral. Agradecemos tu tiempo y dedicación. 🕒 Tu postulación finaliza aquí.');
                return gotoFlow(initFlow);
            } else if (userInput === 2) {
                await flowDynamic('💼 *Entendemos tu decisión.* Agradecemos tu interés en la propuesta.\n\n ¡Te deseamos mucho éxito en tus futuras oportunidades! 🌟');
                await state.update({propuesta:false});
                return gotoFlow(initFlow);
            }
        }else {
            await flowDynamic('👍 *Opción seleccionada:* ' + ctx.body + '. ¡Excelente, sigamos adelante! 🚀');
            const userdata = await getuser()[0];
            if (!isNaN(parseInt(ctx.body)) && parseInt(ctx.body) == 1) {
                await changeStatusVacante(userdata['FK_ID_ORGANIZACION'], userdata['FK_ID_CAMPANIA'], userdata['FK_ID_REQUISICION'], userdata['ID_CANDIDATO']);
                const mess = await getVacanteMessage()[0]['MESSAGE'];
                const status = await getVacanteMessage()[0]['STATUS'];
                await state.update({ID_PROPUESTA: await getVacanteMessage()[0]['ID_PROPUESTA']});
                if (mess && status != '1') {
                    const vacanteMessage = getVacanteMessage();
                    if (vacanteMessage && Array.isArray(vacanteMessage) && vacanteMessage.length > 0) {
                        const url = vacanteMessage[0]['ADJUNTO'];
                        await flowDynamic('⏳ *Cargando tu información...* 📄');
                        await flowDynamic('💼 *Esta es tu propuesta laboral:* \n\n' + vacanteMessage[0]['MESSAGE']);
                        await flowDynamic([
                            {
                                body: '💼💼💼💼',
                                media: 'https://hirbo.arvispace.com/services/Back/Propuestas/' + url
                            }
                        ]);
                        await flowDynamic('🎉 Espero habert                                                           e ayudado, gracias por su preferencia. 🙌 ¡Que tengas un excelente día! ☀️');
                        await state.update({propuesta:true});
                        return fallBack('🤝 *¿Aceptas la propuesta laboral?*\n\n1️⃣ Sí\n2️⃣ No');
                    } else {
                        await  flowDynamic('⏳ *Por favor, ten un poco de paciencia.* 🙏 La organización está revisando tu solicitud... 🕐');
                        return gotoFlow(initFlow);
                    }
                }else if(status == '1'){
                    await flowDynamic('⚠️ *La información de este candidato ya no está disponible en este portal.* \n\n📝 *Motivo:* El candidato ya ha respondido a la propuesta. ¡Gracias por su comprensión! 🙏');
                    return gotoFlow(initFlow);
                }
                else {
                    await  flowDynamic('⏳ *Por favor, ten un poco de paciencia.* 🙏 La organización está revisando tu solicitud... 🕐');
                    return gotoFlow(initFlow);}
            } else if (!isNaN(parseInt(ctx.body)) && parseInt(ctx.body) == 2) {
                await updateStatus(userdata['ID_ADJUNTO'], 'adjuntosCandidatos');
                await state.update({ jumper: true });
                return  gotoFlow(requiscionesFlow);
            } else {
                return  fallBack('❌ *Por favor, ingresa una opción válida.*');
            }
        }


        if (state.get('jumper')) {
            return;
        }
    });


