import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Empleado(){

    let navigate = useNavigate();
    let { id } = useParams();
    const [empleado, setEmpleado] = useState({});
    const [loading, setLoading] = useState(false);

    const cargarPlan = async () => {
        try {
            
            if(id == ''){return false}

            setLoading(true);

            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+'/obtener-plan-capacitacion',
            {
                method: 'GET',
                headers: { 
                    Authorization: token,
                    'Content-Type': 'application/json',
                    'Empleado_id': id
                },
            }
            );
            const jsonData = await response.json();
            setEmpleado(jsonData);
        } catch (err) {
            console.log(err.message)
        } finally {
            setLoading(false);
        }
    }

    const obtenerPlan = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+"/plan-capacitacion",{
                headers: {
                    Authorization: token,
                    Empleado_id: id
                }
            })
            const jsonData = await response.json();
            setEmpleado(jsonData);
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
        obtenerPlan();
      }, []);    

    return(
    <div className="container">
        <div className="seccion">
            <i className="material-symbols-outlined seccion-icon">dashboard</i>
            <p className="seccion-titulo">EMPLEADO</p>
        </div>
        <div className="legajo-empleado">
            <div className="plan-capacitacion-contenido">
                {empleado.propuesta}
            </div>
            
            {
                Object.keys(empleado).length <= 0 
                        ? (
                            loading
                            ? <div className="buscar-loading">Cargando...</div> 
                            : <div className="buscador-plan"><a className="buscar-button" href='#' onClick={(e) => {e.preventDefault();cargarPlan();}}>
                                Buscar
                            </a></div>
                        )
                        : <></>
            }
            
        </div>
    </div>
    );
}

export default Empleado;