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
    const [propuesta, setPropuesta] = useState({});
    const [empleado, setEmpleado] = useState({});
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('desempenio');
    const [evaluaciones, setEvaluaciones] = useState([])
    const [encuestas, setEncuestas] = useState([])
    const [puesto, setPuesto] = useState('');

    const getEmpleado = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+"/empleado-detalle",{
                headers: {
                    Authorization: token,
                    Empleado_id: id
                }
            })
            const jsonData = await response.json();
            setEmpleado(jsonData[0]);        
        } catch (err) {
            console.log(err.message)
        }
    }

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
            
            // Check if we have the data in the expected format
            if (jsonData[0]?.puesto?.data) {
                // Convert the array buffer to base64 directly
                const uint8Array = new Uint8Array(jsonData[0].puesto.data);
                const binaryString = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '');
                const base64String = btoa(binaryString);
                setPuesto(base64String);
            } else {
                console.error('Unexpected data format:', jsonData);
            }
        } catch (err) {
            console.error('Error fetching puesto:', err.message);
            setPuesto(null);
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
            console.log(jsonData);
            setPropuesta(jsonData);
        } catch (err) {
            console.log(err.message)
        } finally {
            setLoading(false);
        }
    }

    const getEncuestas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+'/empleado-cuestionarios',{
                headers: {
                    Authorization: token,
                    Empleado_id: id
                }
            })
            const jsonData = await response.json();
            setEncuestas(jsonData); 
        } catch (err) {
            console.log(err.message)
        }
    }


    const getEvaluaciones = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+'/empleado-desempenio',{
                headers: {
                    Authorization: token,
                    Empleado_id: id
                }
            })
            const jsonData = await response.json();
            setEvaluaciones(jsonData); 
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
            setPropuesta(jsonData);        
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
        getEncuestas();
        getEmpleado();
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
                    <img className="empleado-detalle-img" src={"data:image/png;base64, "+empleado.image} alt="" />
                    <div className="empleado-detalle-datos">
                        <div className="empleado-nombre">{empleado.nombre}</div>
                        <div className="empleado-legajo">{empleado.legajo}</div>
                    </div>
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
                    {activeTab === 'desempenio' && <EmpleadoDesempenio evaluaciones={evaluaciones} />}
                    {activeTab === 'encuestas' && <EmpleadoEncuesta encuestas={encuestas} />}
                    {/* {activeTab === 'plancap' && <EmpleadoPlanCapacitacion empleado={empleado} propuesta={propuesta.propuesta}/>} */}
                    {activeTab === 'plancap' ? 
                        Object.keys(propuesta).length <= 0 
                            ? (
                                loading
                                ? <div className="buscar-loading">Cargando...</div> 
                                : 
                                <div className="buscador-plan">
                                    <h2 className="buscador-plan-titulo">Obtener Plan Capacitacion</h2>
                                    <a className="buscador-plan-button" href='#' onClick={(e) => {e.preventDefault();cargarPlan();}}>
                                        Obtener
                                    </a>
                                </div>
                            )
                            : <EmpleadoPlanCapacitacion empleado={empleado} propuesta={propuesta.propuesta}/>
                        : null
                    }
                    {activeTab === 'puesto' && <EmpleadoPuesto puesto={puesto} />}
                </div>
            </div>    
        </div>
    </div>
    );
}

export default Empleado;