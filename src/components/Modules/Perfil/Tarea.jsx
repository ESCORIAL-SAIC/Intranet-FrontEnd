import { useEffect, useState } from 'react';
import './Tarea.css';
import axios from 'axios';

function Tarea(props){

    const [aprobar,setAprobar] = useState(false)

    const getAprobar = async () => {
        const token = localStorage.getItem('token');
        axios.get(process.env.REACT_APP_BASE_URL+"/perteneceagrupo", {
        headers: {
            Authorization: token,
            GrupoUsuario: "'administradores','Direccion','rol_gerente_industrial','rol_gerente_comercial','Rol_Gerencia_Cadena_de_Suministros','rol_jefe_servicio_tecnico'"
        }
        }).then(res => {
            setAprobar(true)
        }).catch(err => {
            setAprobar(false)
        })
    }

    let aprobacion = false
    let link = ''
    
    if(props.value.tipotransaccion_id == '8f958bfc-fd49-41d0-85b6-e3095ea48d9a'){
        aprobacion = true
        link = `http://192.168.1.116:22112/?FhXUFxvp=${props.value.id_empleado}&ztzalq=${props.value.id_transaccion}&efhFh=${props.value.tipotransaccion_id}`
    }

    useEffect(() => {
        getAprobar()
    }, [])

    return(
        <div className="tarea">
            <div className="semaforo-circulo s-csc"></div>
            <div className="tarea-info">
                <p className="tarea-tipo">{props.value.nombretarea}</p>
                {/* <p className="tarea-numero">{props.value.numero}</p> */}
            </div>
            <p className="tarea-descripcion">{props.value.descripcion.substring(0, 70)}</p>
            <p className="tarea-flag">{props.value.flag}</p>
            {
                aprobacion && aprobar
                ? <a target="_blank" className="aprobar-boton" href={link}>APROBAR</a>
                : <></>
            }
        </div>
    );
}

export default Tarea;