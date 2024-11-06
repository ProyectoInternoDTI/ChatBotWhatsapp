import { getCampanias, getidcode, getRequisiciones, savestate } from "./setData";
import { messageContinue, messageEmptyArray, messageOptions } from "./messages";
import capitalizeFirstWord from "./leetersUpper";
import { getRequisicionesChange, validCode } from "./changeData";
import returnToInitFlow from "./returnToInit.Flow";
import { gestionaRespuestas } from "./returnToAnwers.Flow";
import { addKeyword, EVENTS } from "@builderbot/bot";

export default addKeyword(EVENTS.ACTION)
    .addAnswer('¡🌟 Estas son las campañas disponibles! \n🚀 *Continuaremos con tu nueva postulación.*\n\n⚠️ *Recuerda*: la postulación anterior se reiniciará con la nueva vacante.\n\n¡Buena suerte! 🍀', { capture: false }, async (ctx, { flowDynamic, state, fallBack, gotoFlow }) => {
        try {
            await state.update({ propuesta: false });
            await state.update({ Requisicion: 0 });
            await state.update({ answers: [] });
            await state.update({ correctas: 0 });
            await state.update({ prioritarias: 0 });
            await state.update({ ides: [] });
            const jmp = await state.get('jumper') !== undefined ? await state.get('jumper') : false;
            await state.update({ jumper: jmp });
            const cons = await state.get('consulting') !== undefined ? parseInt(await state.get('consulting')) : 0;
            await state.update({ consulting: cons });
            await state.update({ user: ctx.pushName });
            const campanias = await Promise.all(await getCampanias().Campanias.map(async (x, index) => {
                return `${index + 1}. ${await capitalizeFirstWord(x.Campania)}`;
            }));
            await state.update({ exit: campanias.length + 1 });
            await state.update({ type: 'number' });
            await state.update({ current: null });
            campanias.push((campanias.length + 1) + '. Salir');
            await state.update({ currentmessage: campanias.join('\n') });
            await flowDynamic(messageOptions() + '\n' + campanias.join('\n'));
        } catch (error) {
            console.error('Error en el flujo de bienvenida:', error);
            return fallBack('⚠️ **Error:** Ocurrió un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde. 🙁');
        }
    })
    .addAnswer(messageContinue(), { delay: 100, capture: true }, async (ctx, { flowDynamic, state, fallBack, gotoFlow }) => {
        try {
            const globalData = await getCampanias();
            const selectedOption = parseInt(ctx.body);
            if (isNaN(selectedOption)) {
                return fallBack('⚠️ **Error:** Se solicita una opción de tipo numérico. Por favor, elige una opción válida. ❌');
            } else if (selectedOption > await state.get('exit')) {
                return fallBack('⚠️ **Error:** Selecciona una opción válida dentro del rango. 📏');
            }

            const dataCampain = globalData.Campanias[selectedOption - 1];
            await state.update({ IDOrg: dataCampain['IDOrg'] });
            if (await state.get('type') === 'number') {
                if (isNaN(selectedOption) || selectedOption < 1 || selectedOption > await state.get('exit')) {
                    return fallBack('⚠️ **Error:** Por favor, ingresa una opción válida dentro del rango. 🔢');
                } else {
                    await state.update({ Campania: dataCampain['ID'] });
                    await flowDynamic('👍 *Opción seleccionada:* ' + selectedOption + '. Procedamos... 🚀');
                    // @ts-ignore
                    const Data = globalData.Campanias;
                    const arreglo = Data[selectedOption - 1]['ID'];
                    await getRequisicionesChange(await state.get('IDOrg'), arreglo);
                    const requisicion = await getRequisiciones();
                    if (requisicion) {
                        let x: any;
                        x = await Promise.all(requisicion['Requisiciones'].map(async (x, index) => {
                            if (x.NOMBRE_REQUISICION != '')
                                return `${index + 1}. ` + await capitalizeFirstWord(`${x.NOMBRE_REQUISICION}`);
                            else
                                return '';
                        }));
                        if (x[0] != '') {
                            await state.update({ exit: x.length + 1 });
                            x.push((x.length + 1) + '. Salir');
                            x = x.join('\n');
                            await flowDynamic(x);
                        } else {
                            await state.update({ error: 1 });
                            await flowDynamic(messageEmptyArray());
                            return gotoFlow(returnToInitFlow);
                        }
                    } else {
                        await flowDynamic('❌ **Error:** No se pudo obtener las requisiciones.');
                    }
                }
            } else {
                return fallBack('⚠️ **Error:** Se solicita una opción de tipo numérico. Por favor, elige una opción válida. ❌');
            }
        } catch (error) {
            console.error('Error en la selección de opciones:', error);
            await flowDynamic('⚠️ **Error:** Ocurrió un problema al procesar tu selección. Por favor, inténtalo de nuevo. 🙁');
            return gotoFlow(returnToInitFlow);
        }
    })
    .addAnswer(messageContinue(), { capture: true }, async (ctx, { flowDynamic, state, fallBack, gotoFlow }) => {
        try {
            const exitCommand = await state.get('exit');
            const userResponse = ctx.body;
            if (exitCommand === userResponse) {
                return gotoFlow(returnToInitFlow);
            }
            const selectedOption = parseInt(userResponse);
            if (!isNaN(selectedOption)) {
                const requisicion = await getRequisiciones();
                if (await state.get('Requisicion') === 0) {
                    await state.update({ total: 0 });
                    await state.update({ Requisicion: requisicion['Requisiciones'][selectedOption - 1]['ID_REQUISICION'] });
                }
            }
            const currentStep = parseInt(await state.get('current')) || 0;
            const answers = await state.get('answers') || [];
            const response: any = await gestionaRespuestas(userResponse, ctx.from, ctx.pushName, currentStep, parseInt(await state.get('Campania')), parseInt(await state.get('Requisicion')), await state.get('type'), answers, await state.get('IDOrg'), await state.get('correctas'), await state.get('prioritarias'), await state.get('ides'));
            if (await state.get('type') === 'number') {
                if (isNaN(selectedOption) || selectedOption < 1 || selectedOption > parseInt(exitCommand)) {
                    return fallBack('⚠️ **Error:** Por favor, ingresa una opción válida dentro del rango. 🔢');
                } else {
                    await flowDynamic(`👍 *Opción seleccionada:* ${selectedOption}. Procedamos... 🚀`);
                    if (typeof response !== "string") {
                        state = await savestate(await state, response, answers);
                        if (currentStep <= parseInt(await state.get('total')) && await state.get('culminated') === 0) {
                            return fallBack(response.message);
                        } else if (await state.get('culminated') === 1) {
                            await flowDynamic(response.message);
                            await flowDynamic('😊 Esperamos que la interacción haya sido agradable. 😊');
                        }
                    }
                }
            } else if (['abierta', 'multimedia'].includes(await state.get('type'))) {
                if (typeof response !== "string") {
                    state = await savestate(await state, response, answers);
                    if (currentStep <= parseInt(await state.get('total')) && await state.get('culminated') === 0) {
                        return fallBack(response.message);
                    } else if (await state.get('culminated') === 1) {
                        await flowDynamic(response.message);
                        await flowDynamic('😊 Esperamos que la interacción haya sido agradable. 😊');
                    }
                }
                if (await state.get('type') === 'multimedia') {
                    await validCode(await state.get('IDOrg'), ctx.from, userResponse);
                    const confirm = await getidcode();
                    if (confirm && parseInt(confirm) > 0) {
                        state = await savestate(await state, response, answers);
                        if (currentStep <= parseInt(await state.get('total')) && await state.get('culminated') === 0) {
                            return fallBack(response.message);
                        } else if (await state.get('culminated') === 1) {
                            await flowDynamic(response.message);
                            await flowDynamic('😊 Esperamos que la interacción haya sido agradable. 😊');
                        }
                    } else {
                        return fallBack('⚠️ Por favor, ingresa nuevamente el código. 🔄');
                    }
                }
            }
        } catch (error) {
            console.error('Error en la selección de opciones:', error);
            await flowDynamic('⚠️ **Error:** Ocurrió un problema al procesar tu selección. Por favor, inténtalo de nuevo. 🙁');
        }
    });