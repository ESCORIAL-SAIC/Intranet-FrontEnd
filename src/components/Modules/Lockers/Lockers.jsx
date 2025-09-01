import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from "axios";
import Locker from "./Locker";

function Lockers(props){

    const [lockers, setLockers] = useState([])
    const [planta, setPlanta] = useState('25M')

    let navigate = useNavigate()

    const getLockers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+"/lockers?planta="+planta,{
                headers: {
                    Authorization: token,
                }
            })
            const jsonData = await response.json();
            setLockers(jsonData);
        } catch (err) {
            console.log(err.message)
        }
    }

    const cambiarPlanta = (e) => setPlanta(e.target.value)

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(process.env.REACT_APP_BASE_URL+"/main", {
            headers: {
                Authorization: token,
            }
        }).then(res => {}).catch(err => {
            navigate('/login');
        })
        getLockers();
    }, [planta]);    

    return(
        <div className="container">
            <div className="seccion">
                <i className="material-symbols-outlined seccion-icon">lock</i>
                <p className="seccion-titulo">Gestor Lockers</p>
            </div>
            <div className="lockers-list">
                <div className="lockers">
                {
                    lockers.map(respuesta => (
                        <Locker value={respuesta}/>
                    ))
                }
                </div>
                <div className="locker-preview">
                    <div className="locker-preview-t">
                        <p className="lockers-preview-title">LOCKERS</p>
                        <p className="planta-title">PLANTA</p>
                        <select className="desplegable-planta" id="" onChange={e => cambiarPlanta(e)}>
                            <option value="25M">25 DE MAYO</option>
                            <option value="SUI">SUIPACHA</option>
                        </select>
                    </div>
                    <div className="locker-preview-detallado">
                        <div className="locker-left-col">
                            <p>LOCKER</p>
                            <p className="locker-preview-estado"></p>
                        </div>
                        <div className="locker-right-col">
                            <p className="locker-preview-empleado">Empleado:</p>
                            <p className="locker-preview-empleado-t" id="locker-preview-empleado-t"></p>
                            <div>
                                <div className="locker-preview-legajo">
                                    <p>Legajo:</p>
                                    <p id="locker-preview-legajo-t"></p>
                                </div>
                                <div className="locker-preview-numero">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Lockers;