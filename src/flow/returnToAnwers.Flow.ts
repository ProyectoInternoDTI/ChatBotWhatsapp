import {getAnswers, getDate, getuser} from "./setData";
import {messageConclude, messageEmptyArray, messageReloadAnswer} from "./messages";
import {changeCandidato, getAnswersChange} from "./changeData";
import capitalizeFirstWord from "./leetersUpper";

export async function gestionaRespuestas(indice: any, numero: any, nombre: string,current:number,campania:number,Requisicion:number,oldtype:any,ans:any,org:any,correctasperm:any,oldpriori:any,idscurrent:any) {
    try {
        await getAnswersChange(org,campania,Requisicion);
        let message:any = '';
        let correctas = correctasperm>0?correctasperm:0, prioritarias = oldpriori>0 ? oldpriori:0;
        let exit:any = 0; let type:any = 'number'; const ids = idscurrent.length>0 ? idscurrent:[];
        let answers:any = '';
        let culminated = 0;
        const Data = await getAnswers()
        const arreglo = Data;
        const totalitems = Data['Respuestas'].length;
        if (current == totalitems  && current != null) {
            ids.push(arreglo['Respuestas'][current-1]['ID_PREGUNTA']);
            if (isNaN(parseInt(indice)) && oldtype == 'abierta')
                ans.push(indice);
            else{
                if (parseInt(arreglo['Respuestas'][current-1]['PRIORIDAD']) == 1 || parseInt(arreglo['Respuestas'][current-1]['CORRECTA']) >0) {
                    prioritarias++;
                    correctas += (arreglo['Respuestas'][current-1]['CORRECTA'] == parseInt(indice)) ? 1 : 0;
                }
                ans.push(arreglo['Respuestas'][current-1]['RESPUESTAS'][indice-1]);
            }

            let iduser = 0;
            if (await  getuser()[0]['ID_CANDIDATO'] !=  undefined)
                iduser = parseInt(getuser()[0]['ID_CANDIDATO']);
            await changeCandidato({'ID_CANDIDATO':iduser,'FK_ID_ORGANIZACION':org,'PREGUNTAS':ids.join(','),'NUMERO_CANDIDATO':numero,'FK_ID_REQUISICION':Requisicion,'FK_ID_CAMPANIA':campania,'NOMBRE_CANDIDATO':nombre,'RESPUESTAS':ans.join('|'),'CORRECTAS':(correctas+'/'+prioritarias)});
            exit = 2;
            if(getDate()[0]==  'No hay automatizacion'){
                message = messageConclude(nombre);
            }else {
                message ='¡La entrevista ha concluido satisfactoriamente! Apreciamos mucho tu interés en el puesto. 💼💬 \n'+ getDate()[0]  ;
            }
            culminated = 1;
        }else {
            if (current>0 && current < totalitems){
                ids.push(arreglo['Respuestas'][current-1]['ID_PREGUNTA']);

                if ((isNaN(parseInt(indice)) && oldtype == 'abierta') || oldtype == 'multimedia'){
                    answers = indice;
                }
                else{
                    answers = arreglo['Respuestas'][current]['RESPUESTAS'][indice-1];
                    if (parseInt(arreglo['Respuestas'][current-1]['PRIORIDAD']) == 1 || parseInt(arreglo['Respuestas'][current-1]['CORRECTA']) >0) {
                        prioritarias++;
                        correctas += (arreglo['Respuestas'][current-1]['CORRECTA'] == parseInt(indice)) ? 1 : 0;
                    }
                }
            }

            message = arreglo['Respuestas'][current]['PREGUNTA'];
            let ans: any;
            const Respuestas = arreglo['Respuestas'][current]['RESPUESTAS'];
            if (Respuestas[0] !=  '') {
                if (current < totalitems)
                    ans = await Promise.all(Respuestas.map(async (x, index) => {
                        if (x.toLowerCase() == 'abierta') {
                            exit = 1;
                            type = 'abierta';
                            return '1.Salir';
                        }else if (x.toLowerCase() == 'multimedia') {
                            const x = 'https://hirbo.mx/#/anexo/'+org+'/'+arreglo['Respuestas'][current]['ID_PREGUNTA']+'/'+numero;
                            exit = 1;
                            type = 'multimedia';
                            message = '🔗 Por favor, ingresa a la siguiente liga \n'+x+' \npara cargar los archivos solicitados ('+message+').\n\n📝 Después de subir los documentos, ingresa el código que se te mostrará para poder continuar. ¡Gracias!';
                            return ' ';
                        } else
                            return `${index + 1}. ` + await capitalizeFirstWord(x) + '\n';
                    }));
                if (exit == 0) {
                    exit = Respuestas.length + 1;
                    ans += (Respuestas.length + 1) + '. Salir';
                }
                message += '\n' + ans;
                    current++;
            } else {
                message =  messageEmptyArray();
            }
        }
                    return {message,exit,total:totalitems,current,type,answers,correctas,prioritarias,ids,culminated};
    } catch (error) {
        console.log('Error en las pruebas retrunToAnswers');
        return messageReloadAnswer();
    }
}
