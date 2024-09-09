
import fetch from 'node-fetch';
import {
    changeAnswers,
    changeCampanias,
    changeidcode, changeMessageVacante,
    changeRequisiciones,
    dateASS,
    userexist
} from "./setData";

export async  function changeCandidato(params:any){
    const url = 'https://hirbo.arvispace.com/services/Back/Rutas.php?interviewChatbot';
    try {
        const dta = JSON.stringify({'valores': params,'action':'candidatos',"changeDate":true});
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: dta
        });
        console.log(dta);
        dateASS( await response.json());
    } catch (error) {
        console.error('Error al asignar candidato:', error);
        throw error;
    }
}
export async  function existUser(number:any,id:any){
    const url = 'https://hirbo.arvispace.com/services/Back/Rutas.php?infoCandidato';
    try {
        const dta = JSON.stringify({'numero': number,"org":id});
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: dta
        });
        console.log(dta);
        userexist( await response.json());
    } catch (error) {
        console.error('Error al asignar  fake:', error);
        throw error;
    }
}
export async  function validCode(org:any,num:any,code:any){
    const url = 'https://hirbo.arvispace.com/services/Back/Rutas.php?getInfoValidCode';
    try {
        const dta = JSON.stringify({"id_org":org, "num":num, "code":code});
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: dta
        });
        console.log(dta);
        changeidcode( await response.json());
    } catch (error) {
        console.error('Error al asignar  fake:', error);
        throw error;
    }
}
export async  function getCampaniasChange(key:any){
    const url = 'https://hirbo.arvispace.com/services/Back/Rutas.php?getCampanias';
    try {
        const dta = JSON.stringify({"key":key});
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: dta
        });
        changeCampanias( await response.json());
    }catch (error) {
        console.error('Error al obtener  campañas:', error);
        throw error;
    }
}
export async  function changeStatusVacante(org:any,cam:any,req:any,cand:any,){
    console.log('Apenas va entrando');
    const url = 'https://hirbo.arvispace.com/services/Back/Rutas.php?getInfoVacante';
    try {
        const dta = JSON.stringify({"org":org,"campania":cam,"requisicion":req,"candidato":cand});
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: dta
        });
        console.log(dta);
        changeMessageVacante( await response.json());
    }catch (error) {
        console.error('Error al obtener  message:', error);
        throw error;
    }
}
export async  function getRequisicionesChange(org:any,campain:any){
    const url = 'https://hirbo.arvispace.com/services/Back/Rutas.php?getRequisiciones';
    try {
        const dta = JSON.stringify({"id_org":org,"id_campain":campain});
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: dta
        });
        changeRequisiciones( await response.json());
    }catch (error) {
        console.error('Error al obtener  campañas:', error);
        throw error;
    }
}
export async  function updateStatus(id:any,tbl:any){
    const url = 'https://hirbo.arvispace.com/services/Back/Rutas.php?updateStatus';
    try {
        const dta = JSON.stringify({"action":tbl,"id":id});
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: dta
        });
        console.log(dta);
        changeRequisiciones( await response.json());
    }catch (error) {
        console.error('Error al cambiar estado de status:', error);
        throw error;
    }
}
export async  function getAnswersChange(org:any,campain:any,idreq:any){
    const url = 'https://hirbo.arvispace.com/services/Back/Rutas.php?getQuestions';
    try {
        const dta = JSON.stringify({"id_org":org,"id_campain":campain,"id_requisicion":idreq});
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: dta
        });
        changeAnswers( await response.json());
    }catch (error) {
        console.error('Error al obtener  Answers:', error);
        throw error;
    }
}
