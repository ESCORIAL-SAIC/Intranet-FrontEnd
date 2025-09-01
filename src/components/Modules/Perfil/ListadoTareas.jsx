import { useEffect, useState } from "react";
import Tarea from "./Tarea";
import Cuestionario from "./Cuestionario";
import './ListadoTareas.css';


function ListadoTareas(){

    const [tareas, setTareas] = useState([])
    const [cuestionarios, setCuestionarios] = useState([])

    const getTareas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+"/tareas",{
                headers: {
                    Authorization: token,
                }
            })
            const jsonData = await response.json();
            setTareas(jsonData);
        } catch (err) {
            console.log(err.message)
        }
    }

    const getCuestionarios = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+"/evaluacion-desempenio-pend",{
                headers: {
                    Authorization: token,
                }
            })
            const jsonData = await response.json();
            setCuestionarios(jsonData); 
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getTareas();
        getCuestionarios();
    }, [])


    return(
        <div className="listado-tareas-pendientes">
            <p className="titulo-tareas-pendientes">Tareas Pendientes</p>
            <div className="tareas">
            {cuestionarios.map(cue => (
                <Cuestionario value={cue}/>
            ))}
            {tareas.map(cap => (
                <Tarea value={cap}/>
            ))}
            </div>
        </div>
    );
}

export default ListadoTareas;