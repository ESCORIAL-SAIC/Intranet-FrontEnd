import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import './Encuesta.css';

function Encuesta() {

    let navigate = useNavigate();
    let { id } = useParams();
    const [encuesta, setEncuesta] = useState({})

    const getEncuestas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+'/empleado-cuestionarios-detalle',{
                headers: {
                    Authorization: token,
                    cuestionario_id: id
                }
            })
            const jsonData = await response.json();
            setEncuesta(jsonData[0]); 
            console.log(jsonData)
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
        getEncuestas();
      }, []);

    return (
        <div className="container">
            <div className="seccion">
                <i className="material-symbols-outlined seccion-icon">edit_note</i>
                <p className="seccion-titulo">RESPUESTAS DE FORMULARIO</p>
            </div>
            <div className="encuesta-empleado">
                {
                    Object.entries(encuesta).filter(([key]) => key !== "empleado_id" && key !== "id").map(([pregunta, respuesta]) =>
                        <div className="encuesta-empleado-row">
                            <div className="encuesta-empleado-pregunta">{pregunta}</div>
                            <div className="encuesta-empleado-respuesta">{String(respuesta)}</div>
                        </div>
                    )    
                }
            </div>
        </div>
    );
}

export default Encuesta;