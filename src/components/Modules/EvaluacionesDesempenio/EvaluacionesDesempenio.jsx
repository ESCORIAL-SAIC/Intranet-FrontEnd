import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EvaluacionDesempenio from './EvaluacionDesempenio';
import './EvaluacionesDesempenio.css';
import EvaluacionDesempenioPendiente from './EvaluacionDesempenioPendiente';
import SearchBar from '../FileExplorer/SearchBar';

function EvaluacionesDesempenio(){

    let navigate = useNavigate()
    const [evaluaciones, setEvaluaciones] = useState([])
    const [hayEvaluaciones, setHayEvaluaciones] = useState(false)
    const [hayEvalPend, setHayEvalPend] = useState(false)
    const [busqueda, setBusqueda] = useState('')
    const [filtroTipo, setFiltroTipo] = useState('')
    const [filtroSector, setFiltroSector] = useState('')

    const getEvaluaciones = async (apiDir) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+apiDir,{
                headers: {
                    Authorization: token,
                    busqueda: busqueda,
                    tipo: filtroTipo,
                    sector: filtroSector
                }
            })
            const jsonData = await response.json();
            console.log(jsonData);
            if(jsonData.registros.length > 0){
                setHayEvaluaciones(true)
            }
            setEvaluaciones(jsonData); 
            console.log(jsonData)
        } catch (err) {
            console.log(err.message)
        }
    }

    const getHayEvalPend = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+"/evaluacion-desempenio-pend",{
                headers: {
                    Authorization: token,
                }
            })
            const jsonData = await response.json();
            if(jsonData.length > 0){
                setHayEvalPend(true)
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    const cambiarFiltroSector = (sector) => {
        setFiltroSector(sector.target.value)
    } 

    const cambiarFiltroTipo = (tipo) => {
        setFiltroTipo(tipo.target.value)
    } 

    const confirmarBusqueda = (busqueda) => {
        setBusqueda(busqueda)
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

        getEvaluaciones('/evaluacion-desempenio-completas-p');

        // axios.get(process.env.REACT_APP_BASE_URL+"/perteneceagrupo", {
        //     headers: {
        //         Authorization: token,
        //         GrupoUsuario: "'rol_jefe_rrhh'"
        //     }
        // }).then(res => {
        //     if(res.data.success){
        //         getEvaluaciones('/evaluacion-desempenio-completas-full');
        //     }else{
        //         getEvaluaciones('/evaluacion-desempenio-completas');
        //     }
           
        // }).catch(err => {
        //    getEvaluaciones('/evaluacion-desempenio-completas');
        // })

        
        getHayEvalPend();
    }, [busqueda, filtroTipo, filtroSector]);

    return(
        <div className="container">
            <div className="seccion">
                <i className="material-symbols-outlined seccion-icon">edit_note</i>
                <p className="seccion-titulo">EVALUACIONES</p>
            </div>
            <div className='evaluaciones-completas'>
                <div className='filter-bar'>
                    <div className='filter-selects'>
                        <div href="#" className='filter-desplegable'><span class="material-symbols-outlined">keyboard_arrow_right</span><p className='filter-titulo'>Filtros</p></div>
                        <div className='filter-container'>
                            <div className='filter-sector'>
                                <p className='filter-sector-texto'>Sector</p>
                                <select id="filter-sector-select" onChange={cambiarFiltroSector}>
                                    <option disabled selected value id='null'>SELECCIONE</option>
                                    <option value=''>TODAS</option>
                                {
                                    hayEvaluaciones
                                    ?
                                    evaluaciones.sectores.map(sector => (
                                        <option value={sector.id}>{sector.descripcion}</option>
                                    ))
                                    :<></>
                                }
                                </select>
                            </div>
                            <div className='filter-evaluacion'>
                                <p className='filter-evaluacion-texto'>Evaluacion</p>
                                <select id="filter-evaluacion-select" onChange={cambiarFiltroTipo}>
                                    <option disabled selected value id='null'>SELECCIONE</option>
                                    <option value=''>TODAS</option>
                                    {
                                        hayEvaluaciones
                                        ?
                                        evaluaciones.tipos.map(tipo => (
                                            <option value={tipo.id}>{tipo.descripcion}</option>
                                        ))
                                        :<></>
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='filter-search'>
                        <div href="#" className='filter-search-desplegable'><span class="material-symbols-outlined">keyboard_arrow_right</span><p className='filter-titulo'>Buscador</p></div>
                        <div className='filter-search-container'>
                            <SearchBar buscar={confirmarBusqueda}/>
                        </div>
                    </div>
                </div>
                <div className='listado-evaluaciones-completas'>
                    {
                        hayEvaluaciones
                        ? <>
                        {evaluaciones.registros.map(evaluacion => (
                            <EvaluacionDesempenio value={evaluacion}/>
                        ))}
                        {hayEvalPend
                        ? <EvaluacionDesempenioPendiente/>
                        : <></>}
                        </>
                        : <div className='evaluaciones-pendientes'>
                            <p className='texto-no-evaluacion'>Todavia no has completado ninguna evaluacion de desempeño</p>
                            <a href='/perfil' className="boton-inicio">COMPLETAR FORMULARIO</a> 
                        </div>  
                    }
                </div>
            </div>
        </div>
    );
}

export default EvaluacionesDesempenio;