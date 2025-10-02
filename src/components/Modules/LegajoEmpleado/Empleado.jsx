import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './Empleado.css';
import axios from "axios";
import EmpleadoPuesto from './EmpleadoPuesto';
import EmpleadoDesempenio from './EmpleadoDesempenio';
import EmpleadoEncuesta from './EmpleadoEncuestas';
import EmpleadoPlanCapacitacion from "./EmpleadoPlanCapacitacion";

function Empleado(){

    let navigate = useNavigate();
    let { id } = useParams();
    const [empleado, setEmpleado] = useState({});
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('desempenio');
    const [evaluaciones, setEvaluaciones] = useState([])
    const [puesto, setPuesto] = useState('');

    const getPuesto = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+"/empleado-puesto",{
                headers: {
                    Authorization: token,
                    Empleado_id: id
                }
            })
            const jsonData = await response.json();
            const raw = String.fromCharCode.apply(null, new Uint8Array(jsonData[0].puesto.data));
            setPuesto(btoa(raw));
        } catch (err) {
            console.log(err.message)
        }  
    }

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

    const getEvaluaciones = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+'/evaluacion-desempenio-completas-p',{
                headers: {
                    Authorization: token,
                    Empleado_id: id
                }
            })
            const jsonData = await response.json();
            setEvaluaciones(jsonData); 
            console.log(jsonData)
        } catch (err) {
            console.log(err.message)
        }
    }

    const obtenerPlan = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+"/plan-capacitacion",{
                headers: {
                    Authorization: token,
                    empleado_id: id
                }
            });
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
        getPuesto();
        getEvaluaciones();
      }, []);    

    return(
    <div className="container">
        <div className="seccion">
            <i className="material-symbols-outlined seccion-icon">dashboard</i>
            <p className="seccion-titulo">EMPLEADO</p>
        </div>
        <div className="legajo-empleado">
            <div className="empleado-detalle">
                <div className="empleado-detalle-left">
                    <div className="empleado-nombre">{empleado.empleado}</div>
                    <div className="empleado-legajo">{empleado.legajo}</div>
                </div>
                <div className="empleado-detalle-right">
                    <div className="empleado-detalle-titulo">Puesto: {empleado.puesto}</div>
                    <div className="empleado-detalle-titulo">Sector: {empleado.sector}</div>
                    <div className="empleado-detalle-titulo">Gerencia: {empleado.gerencia}</div>
                </div>
            </div>
            <div className="empleado-solapa-principal">
                <div className="empleado-selector">
                    <a href="#" 
                        className={`empleado-selector-boton ${activeTab === 'desempenio' ? 'active' : ''}`}
                        onClick={(e) => {e.preventDefault(); setActiveTab('desempenio');}}>
                        Desempeño
                    </a>
                    <a href="#" 
                        className={`empleado-selector-boton ${activeTab === 'encuestas' ? 'active' : ''}`}
                        onClick={(e) => {e.preventDefault(); setActiveTab('encuestas');}}>
                        Encuestas
                    </a>
                    <a href="#" 
                        className={`empleado-selector-boton ${activeTab === 'plancap' ? 'active' : ''}`}
                        onClick={(e) => {e.preventDefault(); setActiveTab('plancap');}}>
                        Capacitacion
                    </a>
                    <a href="#" 
                        className={`empleado-selector-boton ${activeTab === 'puesto' ? 'active' : ''}`}
                        onClick={(e) => {e.preventDefault(); setActiveTab('puesto');}}>
                        Puesto
                    </a>
                </div>
                <div className="empleado-solapa-contenido">
                    {activeTab === 'desempenio' && <EmpleadoDesempenio empleado={empleado} />}
                    {activeTab === 'encuestas' && <EmpleadoEncuesta empleado={empleado} />}
                    {activeTab === 'plancap' && <EmpleadoPlanCapacitacion empleado={empleado} propuesta={empleado.propuesta}/>}
                    {activeTab === 'puesto' && <EmpleadoPuesto puesto={puesto} />}
                </div>
            </div>    
                
            {
                /*Object.keys(empleado).length <= 0 
                        ? (
                            loading
                            ? <div className="buscar-loading">Cargando...</div> 
                            : <div className="buscador-plan"><a className="buscar-button" href='#' onClick={(e) => {e.preventDefault();cargarPlan();}}>
                                Buscar
                            </a></div>
                        )
                        : <></>
                */
            }
            
        </div>
    </div>
    );
}

export default Empleado;