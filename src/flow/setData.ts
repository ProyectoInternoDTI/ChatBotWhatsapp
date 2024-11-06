import BotWhatsapp from "@bot-whatsapp/bot";
import {toNumber} from "@whiskeysockets/baileys";
let globalData: any = null;
let user: any = null;
let dateAsign: any = null;
let Campanias: any = null;
let Requisiciones: any = null;
let idcode: any = null;
let VacanteMessage: any ;
let Answers: any = null;

export function setGlobalData(data: any) {
      globalData = data.response;
}

export function userexist(data: any) {
      user = data.response;
}
export function changeidcode(data: any) {
      idcode = data.response;
}
export function dateASS(data: any) {
    dateAsign = data.response.Date;
}
export function changeCampanias(data: any) {
    Campanias = data.response;
}
export function changeMessageVacante(data: any) {
    VacanteMessage = data.response;
}
export function changeRequisiciones(data: any) {
    Requisiciones = data.response;
}

export function changeAnswers(data: any) {
    Answers = data.response;
}

export function getGlobalData() {
    return globalData;
}
export function getidcode() {
    return idcode[0].ID;
}
export function getCampanias() {
    return Campanias;
}
export function getRequisiciones() {
    return Requisiciones;
}
export function getAnswers() {
    return Answers;
}
export function getVacanteMessage() {
    return VacanteMessage;
}
export function getuser() {
    return user;
}
export function getDate() {
    return dateAsign;
}
export function savestate(state:any,x:any,ans:any){
    if(x.answers != '')
        ans.push(x.answers);

    state.update({total:x.total});
    state.update({current:x.current});
    state.update({type:x.type});
    state.update({answers:ans});
    state.update({exit:x.exit});
    state.update({correctas:x.correctas});
    state.update({prioritarias:x.prioritarias});
    state.update({ides:x.ids});
    state.update({culminated:x.culminated});

    return state;
}
export function clearState(stateglobal){
    stateglobal.step = 'Key';
    stateglobal.strickes = 0;
    stateglobal.campania = null;
    stateglobal.requesicion = null;
    stateglobal.preguntas.current = null;
    stateglobal.preguntas.total = null;
    stateglobal.exit = 0;
    stateglobal.error = 0;
    stateglobal.preguntas.complete = 0;
    stateglobal.preguntas.correctas = 0;
    stateglobal.respuestas.idPregunta = [];
    stateglobal.respuestas.respuestas = [];
    return stateglobal;
}
export function initializeState(state) {
    const defaults = {
        consulting: 0,
        Requisicion: 0,
        answers: [],
        correctas: 0,
        prioritarias: 0,
        ides: [],
        user: 'Usuario'
    };

    Object.keys(defaults).forEach(key => {
        if (state.get(key) === undefined) {
            state.update({ [key]: defaults[key] });
        }
    });
    return state;
}