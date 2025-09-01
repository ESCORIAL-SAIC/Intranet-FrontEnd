import { useState } from "react";
import RespuestaE from "./RespuestaE";
import RespuestaS from "./RespuestaS";

function PreguntasE(props){

    const [mostrar, setMostrar] = useState(false)
    const showDetails = () => {
        setMostrar(!mostrar)
    }

    return(
        <div className="ev-pregunta">
            <a href='#' className={
                mostrar
                ? "ev-pregunta-desplegable open-c"
                : "ev-pregunta-desplegable close-c"
            }
            onClick={showDetails}>
                <p className="ev-pregunta-n">{props.value.pregunta}</p>
                    {
                    props.value.respuestas.map(respuesta => (
                        <RespuestaS value={respuesta}/>
                    ))
                    }
                <i className={
                    mostrar
                    ? "material-symbols-outlined arrow-down-icon rotate0"
                    : "material-symbols-outlined arrow-down-icon rotate90"
                }>expand_more</i>
            </a>
            <div className={
                mostrar
                ? "ev-respuestas-container show-c"
                : "ev-respuestas-container hide-c"
            }>
                {
                props.value.respuestas.map(respuesta => (
                    <RespuestaE value={respuesta}/>
                ))
                }
            </div>
        </div>
    );
}

export default PreguntasE;