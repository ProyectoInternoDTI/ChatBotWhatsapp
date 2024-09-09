import {
    mensajeinit,
    messageContinue,
    messageEmptyArray,
    messageInfo,
    messageOptions,
} from "./messages";
import {
    existUser,
    getCampaniasChange,
    getRequisicionesChange,
    validCode
} from "./changeData";
import {getCampanias, getidcode, getRequisiciones, getuser, savestate} from "./setData";
import capitalizeFirstWord from "./leetersUpper";
import returnToInitFlow from "./returnToInit.Flow";
import {gestionaRespuestas} from "./returnToAnwers.Flow";
import ValidacionFlow from "./ValidacionFlow";
import {addKeyword, EVENTS} from "@builderbot/bot";
export default addKeyword(EVENTS.WELCOME)
    .addAnswer('🌟 ¡Hola ' + (await mensajeinit()), { capture: true}, async (ctx, { flowDynamic, state, fallBack, gotoFlow }) => {
        try {
            await state.update({propuesta: false});
            await state.update({Requisicion: 0});
            await state.update({answers: []});
            await state.update({correctas: 0});
            await state.update({prioritarias: 0});
            await state.update({ides: []});
            const jmp = state.get('jumper') !== undefined ? state.get('jumper') : false;
            await state.update({jumper: jmp});
            const cons = state.get('consulting') !== undefined ? parseInt(state.get('consulting')) : 0;
            await state.update({consulting: cons});
            await state.update({user: ctx.pushName});
            if(await getCampanias() != null && await getCampanias() != 'Error al ejecutar la acción'){
                const campanias = await Promise.all(await getCampanias().Campanias.map(async (x, index) => {
                    return `${index + 1}. ${await capitalizeFirstWord(x.Campania)}`;
                }));
                await state.update({exit: campanias.length + 1});
                await state.update({type: 'number'});
                await state.update({current: null});
                campanias.push((campanias.length + 1) + '. Salir');
                await state.update({currentmessage: campanias.join('\n')});
                await flowDynamic(messageOptions() + '\n' + campanias.join('\n'));
            }else if (ctx.body.includes('#')) {
                await getCampaniasChange(ctx.body.slice(1));
                const globalData = await getCampanias();

                if (globalData != 'Error al ejecutar la acción') {
                    await flowDynamic(globalData.MESSAGE);
                    await existUser(ctx.from,globalData['Campanias'][0].IDOrg).catch(error => {
                        console.error('Error en existUser:', error);
                        throw error;
                    });
                    const userdata = await getuser()[0];
                    if (globalData['Campanias'][0].IDOrg == userdata.FK_ID_ORGANIZACION && !state.get('jumper')) {
                        return gotoFlow(ValidacionFlow);
                    }else if(globalData['Campanias'][0].IDOrg == userdata.FK_ID_ORGANIZACION && state.get('jumper')){
                        await flowDynamic('🚀 *Continuaremos con tu nueva postulación.*\n\n⚠️ *Recuerda*: La postulación anterior se reiniciará con la nueva vacante.\n\n¡Buena suerte! 🍀');
                    }
                    if (globalData.Campanias) {
                        const campanias = await Promise.all(globalData.Campanias.map(async (x, index) => {
                            return `${index + 1}. ${await capitalizeFirstWord(x.Campania)}`;
                        }));
                        await state.update({exit: campanias.length + 1});
                        await state.update({type: 'number'});
                        await state.update({current: null});
                        campanias.push((campanias.length + 1) + '. Salir');
                        await state.update({currentmessage: campanias.join('\n')});
                        await flowDynamic(messageOptions() + '\n' + campanias.join('\n'));
                    } else {
                        await flowDynamic(messageInfo());
                        return gotoFlow(returnToInitFlow);
                    }
                } else {
                    return  fallBack('❌ **Error:** No se pudo obtener la información global. \n Intenta nuevamente');
                }
            } else {
                await flowDynamic('Ingresa la palabra clave para continuar...');
                return gotoFlow(returnToInitFlow);
            }
        } catch (error) {
            console.error('Error en el flujo de bienvenida:', error);
            return fallBack('⚠️ **Error:** Ocurrió un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.');
        }
    }
)
    .addAnswer(messageContinue(), { delay: 100, capture: true }, async (ctx, { flowDynamic, state, fallBack, gotoFlow }) => {
        try {
            const globalData = await getCampanias();
            const selectedOption = parseInt(ctx.body);
            if (isNaN(selectedOption)){
                return  fallBack('⚠️ **Error:** Se solicita una opción de tipo numérico. Por favor, elige una opción válida.');
            }else if(selectedOption > state.get('exit'))
                return  fallBack('⚠️ **Error:** Selecciona una opcion valida dentro del rango.');

            const dataCampain = globalData.Campanias[selectedOption-1];
            await state.update({IDOrg: dataCampain['IDOrg']});
            if (state.get('type') === 'number') {
                if (isNaN(selectedOption) || selectedOption < 1 || selectedOption > state.get('exit')) {
                    return fallBack('⚠️ **Error:** Por favor, ingresa una opción válida dentro del rango.');
                } else {
                    await state.update({ Campania: dataCampain['ID'] });
                    await flowDynamic('👍 *Opción seleccionada:* ' + selectedOption + '. Procedamos...');
                    // @ts-ignore
                    const Data = globalData.Campanias;
                    const arreglo =  Data[selectedOption-1]['ID'];
                    await getRequisicionesChange(state.get('IDOrg'),arreglo);
                    const requisicion = await getRequisiciones();
                    if (requisicion){
                        let x :any;
                        x = await Promise.all(requisicion['Requisiciones'].map(async (x, index) => {
                            if (x.NOMBRE_REQUISICION != '')
                                return `${index + 1}. `+ await capitalizeFirstWord(`${x.NOMBRE_REQUISICION}`);
                            else
                                return '';
                        }));
                        if (x[0] !=''){
                            await state.update({exit: x.length+1});
                            x.push( (x.length+1)+'. Salir');
                            x = x.join('\n');
                            await flowDynamic(x);
                        }
                        else{
                            await state.update({error: 1});
                            await flowDynamic (messageEmptyArray());
                            return  gotoFlow(returnToInitFlow);
                        }
                    }else {
                        await flowDynamic('❌ **Error:** No se pudo obtener las requisiciones.');
                    }
                }
            } else {
                return fallBack('⚠️ **Error:** Se solicita una opción de tipo numérico. Por favor, elige una opción válida.');
            }
        } catch (error) {
            console.error('Error en la selección de opciones:', error);
            await flowDynamic('⚠️ **Error:** Ocurrió un problema al procesar tu selección. Por favor, inténtalo de nuevo.');
            return gotoFlow(returnToInitFlow);
        }
    })
    .addAnswer(messageContinue(), {capture: true}, async (ctx, {flowDynamic, state, fallBack, gotoFlow}) => {
        try {
            const exitCommand = state.get('exit');
            const userResponse = ctx.body;

            if (exitCommand === userResponse) {
                return gotoFlow(returnToInitFlow);
            }

            const selectedOption = parseInt(userResponse);

            if (!isNaN(selectedOption)) {
                const requisicion = await getRequisiciones();

                if (state.get('Requisicion') === 0) {
                    await state.update({total: 0});
                    await state.update({Requisicion: requisicion['Requisiciones'][selectedOption - 1]['ID_REQUISICION']});
                }
            }

            const currentStep = parseInt(state.get('current')) || 0;
            const answers = state.get('answers') || [];
            const response:any = await gestionaRespuestas(userResponse, ctx.from, ctx.pushName, currentStep, parseInt(state.get('Campania')), parseInt(state.get('Requisicion')), state.get('type'), answers, state.get('IDOrg'), state.get('correctas'), state.get('prioritarias'), state.get('ides'));

            if (state.get('type') === 'number') {
                if (isNaN(selectedOption) || selectedOption < 1 || selectedOption > parseInt(exitCommand)) {
                    return fallBack('⚠️ **Error:** Por favor, ingresa una opción válida dentro del rango.');
                } else {
                    await flowDynamic(`👍 *Opción seleccionada:* ${selectedOption}. Procedamos...`);
                    if (typeof response !== "string") {
                        state = await savestate(state, response, answers);
                        if (currentStep <= parseInt(state.get('total')) && state.get('culminated') === 0) {
                            return fallBack(response.message);
                        }else if (state.get('culminated') === 1) {
                            await flowDynamic(response.message);
                            await flowDynamic('Esperamos que la interacción haya sido agradable.');
                        }
                    }
                }
            } else if (['abierta', 'multimedia'].includes(state.get('type'))) {
                if (typeof response !== "string") {
                    state = await savestate(state, response, answers);
                    if (currentStep <= parseInt(state.get('total')) && state.get('culminated') === 0) {
                        return fallBack(response.message);
                    }else if (state.get('culminated') === 1) {
                        await flowDynamic(response.message);
                        await flowDynamic('Esperamos que la interacción haya sido agradable.');
                    }
                }
                if (state.get('type') === 'multimedia') {
                    await validCode(state.get('IDOrg'), ctx.from, userResponse);
                    const confirm = await getidcode();
                    if (confirm && parseInt(confirm) > 0) {
                        state = await savestate(state, response, answers);
                        if (currentStep <= parseInt(state.get('total')) && state.get('culminated') === 0) {
                            return fallBack(response.message);
                        } else if (state.get('culminated') === 1) {
                            await flowDynamic(response.message);
                            await flowDynamic('Esperamos que la interacción haya sido agradable.');
                        }
                    } else {
                        return fallBack('⚠️ Por favor, ingresa nuevamente el código. 🔄');
                    }
                }
            }

        } catch (error) {
            console.error('Error en la selección de opciones:', error);
            await flowDynamic('⚠️ **Error:** Ocurrió un problema al procesar tu selección. Por favor, inténtalo de nuevo.');
        }
    });