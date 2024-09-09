import {getCampanias} from "./setData";
export  function messageNewVacant(name:any){
    return `🌟 ¡Hola `+ name +`! 🎯\n` +
        '\n' +
        'Estamos observando tu interés en seguir postulando para una nueva vacante. ¿Deseas continuar con el proceso o prefieres concluir por ahora?\n' +
        '\n' +
        'Por favor, responde con uno de las siguientes opciones:\n' +
        '\n' +
        '1. Para continuar.\n' +
        '2. Para concluir.';
}
export async function messageWelcome(name?: any): Promise<string> {
    try {
        const valor = name !== undefined ? name : ' ';
        const campanias = await getCampanias();
        const mensaje = `¡Estamos listos para ayudarte. Por favor, indica qué acción necesitas realizar y te guiaremos con todo lo que necesitas saber. 📝💬\n` +
            '\n' +
            'NOTA: recuerda que cada palabra clave comienza con #️⃣.';

        if (campanias != null) {
            return Promise.reject('Estas son las campañas disponibles');
        } else {
            return valor + mensaje;
        }
    } catch (error) {
        return Promise.reject(error);
    }
}
export async function mensajeinit(): Promise<string> {
    try {
        const msj = await messageWelcome();
        return msj;
    } catch (error) {
        return 'Hubo un error al obtener el mensaje.';
    }
}
export  function  messageInfo(){
   return  "Actualmente la información que deseas consultar no contiene información. 🤔 Si piensas que estamos equivocados, revisa el mensaje escrito. 📝";
}
export function messagecloseFlujo(){
    return 'Lo siento, el flujo se cerró debido a múltiples errores. Por favor, 🔄 escribe nuevamente la palabra clave para continuar. 🚀✨\n';
}

export function messagewriteInfo(){
    return '¡Tu participación es crucial para nosotros! Te pedimos que dediques un momento para responder con sinceridad las preguntas que se presentarán a continuación. 🤔✍️✨\n' +
        '\n' +
        'Tu voz y opinión son fundamentales para ayudarnos a mejorar y ofrecerte la mejor experiencia posible. ¡Estamos ansiosos por escucharte! 💬🌟';
}
export function messageReloadAnswer(){
    return 'Elige una opción válida del menú. 📌';
}

export function  messageOptions(){
    return 'Por favor, elige una opción de las siguientes para continuar:';
}
export function  messageExit(name:any){
    return '🌟'+ name+' Agradecemos el tiempo invertido. Si deseas volver a disfrutar de nuestros servicios, estamos aquí para atenderte con gusto. 🤗\n' +
        '\n' +
        '¡Esperamos verte pronto de nuevo! 🌼';
}
export  function  messageConclude(nombre:any){
    return `🌟 ¡Gracias por tu tiempo , `+nombre+`! 🎉\n\n` +
        `¡La entrevista ha concluido satisfactoriamente! Apreciamos mucho tu interés en el puesto. 💼💬\n\n` +
        `Nos pondremos en contacto contigo pronto para cualquier actualización adicional. ¡Ten un excelente día! 🌞👋`;
}
export function messageExitNull(nombre:any){
    return '¡Hola '+nombre +'! 😊\n' +
        '\n' +
        'Gracias por tu interés en la vacante. Lamentablemente, no cumples con los requisitos mínimos para el puesto en esta ocasión. 🚫\n' +
        '\n' +
        'Te deseamos mucho éxito en tu búsqueda de empleo y agradecemos tu comprensión. 🌟';
}
export function messageEmptyArray(){
    return '🛠️ ¡Ups! La información que buscas no está disponible en este momento o puede haber un problema con la configuración. Agradecemos tu paciencia y te invitamos a intentarlo más tarde. 🌟 ¡Gracias por entender!';
}
export function messageReloadCandidato(vacante:any,usuario:any){
    return '🔍 ¡Hola '+usuario+'! Hemos encontrado tu postulación para la vacante '+vacante+'. Si quieres explorar nuevas oportunidades, elige una de las siguientes opciones para postularte a una nueva vacante: 🚀💼\n' +
        '¡Estamos emocionados de ayudarte a encontrar la mejor oportunidad para ti! 😃📈\n 1. Continuar\n 2.Salir';
}
export function messageContinue(){
    return '🌟 Para poder ayudarte mejor, por favor selecciona la opción que más te favorezca 🌟';
}