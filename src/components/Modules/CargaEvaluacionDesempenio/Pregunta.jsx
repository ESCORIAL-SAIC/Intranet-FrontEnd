import { useState } from 'react';


function Pregunta({value, onSeleccionarPregunta, autoEval}){

    const [completa, setCompleta] = useState(false)


    const handleRespuesta = (event) =>{
        let resp = {
            "niveles": value.respuestas
        };
        //console.log(value)
        resp["pregunta"] = value.pregunta;
        resp["detalle"] = value.detalle;
        onSeleccionarPregunta(resp);
    }

    const updateProgressBar = () => {
        const progress = document.getElementById('progress')
        const preguntas = document.getElementsByClassName("pregunta")
        let cantPreguntas = preguntas.length
        let cantRespuestas = 0
        let porcentajeProgreso = 0

        setCompleta(true)

        for(let pregunta of preguntas){
            if(pregunta.children[1].children[0].value != 'true'){
                cantRespuestas += 1
            }
        }
        porcentajeProgreso = (cantRespuestas / cantPreguntas) * 100
        progress.style.width = porcentajeProgreso + "%"

    }    

    return(
        <div className="pregunta" id={value.id}>
            <div className='pregunta-container'>
                <div className='pregunta-completa'><i className={
                    completa 
                    ? "material-symbols-outlined pregunta-check show"
                    : "material-symbols-outlined pregunta-check hide"
                }>check</i></div>
                <p className='pregunta-texto'>{value.pregunta}</p>
            </div>
            <div className="seleccionador">
                <select id='select-res' onClick={(e) => {handleRespuesta(e);}} onChange={() => {updateProgressBar();}}>
                <option disabled selected value id='null-option'>SELECCIONE UNA RESPUESTA</option>
                {
                    value.respuestas.map(res => (
                        <option value={res.id}>{res.respuesta}</option>
                    ))
                }
                </select>
            </div>      
            <div className='feedback-pregunta'>
                <div className="feedback-pregunta-titulo">Observaciones: </div>
                <textarea className="feedback-pregunta-texto" id="feedback-pregunta-texto"/>
            </div>            
        </div>
    );
}

export default Pregunta;