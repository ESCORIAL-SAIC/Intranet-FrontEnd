import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './LegajoEmpleado.css';
import axios from "axios";

function LegajoEmpleado(){

    let navigate = useNavigate()
    const [empleados, setEmpleados] = useState([])

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(process.env.REACT_APP_BASE_URL+"/main", {
            headers: {
                Authorization: token,
            }
        }).then(res => {}).catch(err => {
            navigate('/login')
        })

        getEmpleados();
      }, []);    

    const getEmpleados = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+"/legajos-empleados",{
                headers: {
                    Authorization: token,
                }
            })
            const jsonData = await response.json();
            setEmpleados(jsonData || []);
        } catch (err) {
            console.log(err.message)
        }
    }

    return(
    <div className="container">
        <div className="seccion">
            <i className="material-symbols-outlined seccion-icon">dashboard</i>
            <p className="seccion-titulo">EMPLEADOS</p>
        </div>
        <div className="legajos-empleados">
        {
            empleados.map(empleado => (
                <a href={"/empleado/"+empleado.empleado_id} className="item-empleado">
                    <div className="item-empleado-img"></div>
                    <div className="item-empleado-detalle">
                        <div className="item-empleado-nombre">{empleado.empleado}</div>
                        <div className="item-empleado-puesto">Puesto: </div>
                    </div>
                    <div className="item-empleado-legajo">{empleado.legajo}</div>
                </a>
            ))
        }
        </div>
    </div>
    );
}

export default LegajoEmpleado;