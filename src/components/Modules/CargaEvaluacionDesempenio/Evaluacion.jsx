import { useNavigate } from "react-router-dom";
import Frame from "../../Varios/Frame";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; 
import Pregunta from "./Pregunta";
import './Evaluacion.css';

function Evaluacion(){

    const [cuestionarios, setCuestionarios] = useState([])
    const [info, setInfo] = useState({})
    const [autoEval, setAutoEval] = useState(false)
    let navigate = useNavigate()
    let { id, usuario } = useParams();
 
    const mostrarPregunta = (event) => {
        setInfo(event);
        console.log(event);
    }

    const getCuestionarios = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+"/evaluacion-desempenio-det",{
                headers: {
                    Authorization: token,
                    Cuestionario: id,
                    Usuario: usuario
                }
            })
            const jsonData = await response.json();
            setCuestionarios(jsonData); 
            setAutoEval(jsonData[0].autoevaluacion);
        } catch (err) {
            console.log(err.message)
        }
    }

    const enviarFormulario = async () => {
        let json = {
            'feedbackFecha': '',
            'respuestas': []
        }
        let respuestas = []
        try {
            let preguntas = document.getElementsByClassName("pregunta")
            //let feedback = document.getElementById("feedback-texto")
            let feedbackFecha = document.getElementById("feedback-fecha")
            let preguntaId = ""
            let respuestaId = ""
            let feedbackRes = ""

            if(!autoEval){
                if(feedbackFecha == null || feedbackFecha.value == ''){
                    return false;
                }
            }            

            for(let pregunta of preguntas){
                if(pregunta.children[1].children[0].value == 'true'){
                    return false
                }
                preguntaId = pregunta.id
                respuestaId = pregunta.children[1].children[0].value
                feedbackRes = pregunta.children[2].children[1].value
                respuestas.push({
                    "preguntaId": preguntaId,
                    "respuestaId": respuestaId,
                    "feedback": feedbackRes,
                })
                
                
            }
            
            if(!autoEval && (feedbackFecha != null)){
                //json.feedback = feedback.value
                json.feedbackFecha = feedbackFecha.value
            }
            json.respuestas = respuestas
            const token = localStorage.getItem('token');
            await fetch(process.env.REACT_APP_BASE_URL+'/enviar-evaluacion',
                {
                method: 'POST',
                headers: { 
                    Authorization: token,
                    Cuestionario: id,
                    Usuario: usuario,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(json)
                }
            );
        } catch (err) {
            console.log(err)
        }
        document.getElementById("display-evaluacion").classList.remove('show')
        document.getElementById("display-evaluacion").classList.add('hide')
        document.getElementById("evaluacion-conf").classList.remove('hide')
        document.getElementById("evaluacion-conf").classList.add('show')
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(process.env.REACT_APP_BASE_URL+"/validar-eval", {
        headers: {
            Authorization: token,
            Cuestionario: id,
            Usuario: usuario
        }
        }).then(res => {}).catch(err => {
            navigate('/')
        })
        getCuestionarios();
      }, []);    

    
    return(
    <div className="container">
        <div className="seccion">
            <i className="material-symbols-outlined seccion-icon">edit_square</i>
            <p className="seccion-titulo">EVALUACION, A EVALUAR: {usuario}</p>
        </div>
        <div className="display-evaluacion show" id='display-evaluacion'>
            <div className="formulario">
                <div className="formulario-lateral"></div>
                <div className="formulario-container">
                    <div className="progress-bar">
                        <div className="progress" id='progress'></div>
                    </div>
                    {cuestionarios.map(cue => (
                        <div className="evaluacion">
                            {
                                cue.preguntas.map(pre => (
                                    <Pregunta value={pre} onSeleccionarPregunta={mostrarPregunta} autoEval={autoEval}/>
                                ))
                            }
                            
                        </div>
                    ))}
                    {
                        !autoEval
                        ?<div className="feedback">
                            <div className="feedback-titulo">Definir reunion de feedback</div>
                            {/* <textarea className="feedback-texto" id="feedback-texto"/> */}
                            <input type="datetime-local" className="feedback-fecha" id="feedback-fecha"/>
                        </div>
                        :<></>
                    }
                    <div>
                        <button className="boton-enviar" onClick={enviarFormulario}>ENVIAR</button>
                    </div>
                </div>
            </div>
            <div className="eval-detalle">
                    <div className="eval-detalle-pregunta">
                        <div className="eval-detalle-pregunta-titulo">{info.pregunta}</div>
                        <div className="eval-detalle-pregunta-contenido" dangerouslySetInnerHTML={{
                            __html:info.detalle?info.detalle.replace(/\*(.*?)\*/g, '<strong>$1</strong>') :""
                        }}></div>
                    </div>
                    <div className="eval-detalle-niveles">
                    {
                        (info.niveles || []).map(nivel => (
                        <div className="eval-detalle-nivel">
                            <div className="eval-detalle-nivel-titulo">{nivel.respuesta}</div>
                            <div className="eval-detalle-nivel-contenido" dangerouslySetInnerHTML={{
                                __html:nivel.detalle?nivel.detalle.replace(/\*(.*?)\*/g, '<strong>$1</strong>'):""
                            }}></div>
                        </div>
                        ))
                    }
                    </div>
            </div>
        </div>
        <div className="evaluacion-conf hide" id='evaluacion-conf'>
            <p className="evaluacion-texto">EVALUACION ENVIADA, GRACIAS!</p>
            <div className="check">
                <svg xmlns="http://www.w3.org/2000/svg" className="svg-success" viewBox="0 0 24 24">
                    <g stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10">
                    <circle className="success-circle-outline" cx="12" cy="12" r="11.5"/>
                    <circle className="success-circle-fill" cx="12" cy="12" r="11.5"/>
                    <polyline className="success-tick" points="17,8.5 9.5,15.5 7,13"/>
                    </g>
                </svg>
            </div>
            <a href='/evaluaciones-desempenio' className="boton-inicio">VOLVER A LAS EVALUACIONES</a>   
        </div>
    </div>
    );
}

export default Evaluacion;