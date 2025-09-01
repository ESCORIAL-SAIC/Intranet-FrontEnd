import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import PreguntasE from './PreguntasE';

function RespuestasEvaluacion(){

    let { id } = useParams();
    let navigate = useNavigate()
    const [preguntas, setPreguntas] = useState([])
    const [empleado, setEmpleado] = useState('')
    const [empleadoEval, setEmpleadoEval] = useState('')
    const [fecha, setFecha] = useState('')
    const [tipo, setTipo] = useState('')
    const [feedback, setFeedback] = useState('')
    const [fechaFeed, setFechaFeed] = useState('')
    const [autoEval, setAutoEval] = useState(false)

    const enviarFeedback = async () => {
        let json = {
            'feedback': '',
        }
        let respuesta = document.getElementById('feedback-texto');

        if(respuesta.value == ''){return false}

        json.feedback = respuesta.value;

        const token = localStorage.getItem('token');
        await fetch(process.env.REACT_APP_BASE_URL+'/agregar-puntos-feedback',
            {
                method: 'POST',
                headers: { 
                    Authorization: token,
                    Cuestionario: id,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(json)
            }
        ); 


        window.location.reload();
    }

    const getRepuestas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+"/evaluacion-desempenio-completas-res",{
                headers: {
                    Authorization: token,
                    Cuestionario: id
                }
            })
            const jsonData = await response.json();
            console.log(jsonData)
            setPreguntas(jsonData[0].preguntas); 
            setEmpleado(jsonData[0].usuario);
            setEmpleadoEval(jsonData[0].empleado_evaluar);
            setFecha(jsonData[0].fecha)
            setTipo(jsonData[0].tipo)
            setFeedback(jsonData[0].feedback)
            setFechaFeed(jsonData[0].fechaFeedback)
            setAutoEval(jsonData[0].autoEvaluacion)
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(process.env.REACT_APP_BASE_URL+"/main", {
            headers: {
                Authorization: token,
            }
        }).then(res => {}).catch(err => {
            navigate('/login')
        })

        getRepuestas();
    }, [true]);

    return(
        <div className="container">
            <div className="seccion">
                <i className="material-symbols-outlined seccion-icon">edit_note</i>
                <p className="seccion-titulo">RESPUESTAS DE EVALUACIONES</p>
            </div>
            <div className='listado-evaluaciones-completas-c'>
                <div className='listado-evaluaciones-completas-resp'>
                {
                    
                    preguntas.map(pregunta => (
                            <PreguntasE value={pregunta}/>
                        ))
                    
                }
                </div>
                <div className='ev-container-data'>             
                    <div className='ev-data'>
                        <div className='ev-data-header'>Datos Evaluacion</div>
                        <div className='ev-data-cont'>
                            <p className='ev-titulo'>Fecha: </p>
                            <p className='ev-fecha-n'>{new Date(fecha.substring(0, 10)).toLocaleDateString('es-ES', {timeZone: 'UTC'})}</p>
                            <p className='ev-titulo'>Evaluado: </p>
                            <p className='ev-empleado-n'>{empleadoEval}</p>
                            <p className='ev-titulo'>Reunion Feedback puntos: </p>
                            <p className='ev-feedback'>{feedback}</p>
                            <p className='ev-titulo'>Reunion Feedback fecha: </p>
                            <p className='ev-fecha-feedback'>{(fechaFeed != null) ?new Date(fechaFeed.substring(0, 10)).toLocaleDateString('es-ES', {timeZone: 'UTC'}) + " " + fechaFeed.substring(11, 16) :null}</p>
                            <p className='ev-tipo'>{tipo}</p>
                            {
                                !autoEval
                                ?<a href='http://intranet.escorialsa.com.ar:4444/SGC/03- RRHH/FORMULARIOS/Editables/FR-RHS-01 Rev.00 CL de feedback, observables y recomendaciones.docx' className='ev-descargable-formulario'>
                                    <i class="material-symbols-outlined ev-descargable-formulario-icono">file_open</i>
                                    <p className='ev-descargable-formulario-texto'>Formulario feedback</p>
                                </a>
                                :<></>
                            }
                        </div>
                    </div>
                    {
                        !autoEval
                        ?<div className="ev-data-feedback">
                            <div className="ev-data-feedback-titulo">Puntos de la reunion de feedback: </div>
                            <textarea className="ev-data-feedback-texto" id="feedback-texto" placeholder={feedback}/>
                            <button className="boton-enviar-feedback" onClick={enviarFeedback}>ENVIAR</button>
                        </div>
                        :<></>
                    }                   
                </div>
            </div>
        </div>
    );
}

export default RespuestasEvaluacion;