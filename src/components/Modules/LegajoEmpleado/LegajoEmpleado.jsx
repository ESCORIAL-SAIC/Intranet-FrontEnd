import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './LegajoEmpleado.css';
import axios from "axios";
import SearchBar from "../FileExplorer/SearchBar";

function LegajoEmpleado(){

    let navigate = useNavigate()
    const [empleados, setEmpleados] = useState([])
    const [busqueda, setBusqueda] = useState('')

    const confirmarBusqueda = (busqueda) => {
        setBusqueda(busqueda)
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(process.env.REACT_APP_BASE_URL+"/perteneceagrupo", {
        headers: {
            Authorization: token,
            GrupoUsuario: "'rol_intranet_adm'"
        }
        }).then(res => {
            
        }).catch(err => {
            navigate('/login')
        })

        getEmpleados();
      }, [busqueda]);    

    const getEmpleados = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+"/legajos-empleados",{
                headers: {
                    Authorization: token,
                    busqueda: busqueda
                }
            })
            const jsonData = await response.json();
            console.log(jsonData);
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
            <div className='filter-bar'>
                    <div className='filter-search'>
                        <div href="#" className='filter-search-desplegable'><span class="material-symbols-outlined">keyboard_arrow_right</span><p className='filter-titulo'>Buscador</p></div>
                        <div className='filter-search-container'>
                            <SearchBar buscar={confirmarBusqueda}/>
                        </div>
                    </div>
                </div>
                <div className="listado-legajos-empleados">
                    {
            empleados.map(empleado => (
                <a href={"/empleado/"+empleado.empleado_id} className="item-empleado">
                    {/* <img className="item-empleado-img" src={"data:image/png;base64, "+empleado.image}></img> */}
                    <div className="item-empleado-detalle">
                        <div className="item-empleado-nombre">{empleado.empleado}</div>
                        <div className="item-empleado-puesto">Puesto: {empleado.puesto}</div>
                    </div>
                    <div className="item-empleado-legajo">{empleado.legajo}</div>
                </a>
            ))
        }
                </div>
        
        </div>
    </div>
    );
}

export default LegajoEmpleado;