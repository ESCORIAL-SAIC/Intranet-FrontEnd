import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../FileExplorer/SearchBar';

function ListadoEvaluacionesMBTI(){
    let navigate = useNavigate()
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(process.env.REACT_APP_BASE_URL+"/main", {
            headers: {
                Authorization: token,
            }
        }).then(res => {}).catch(err => {
            navigate('/login')
        })
      
    }, []);

    return(
        <div className="container">
            <div className="seccion">
                <i className="material-symbols-outlined seccion-icon">edit_note</i>
                <p className="seccion-titulo">LISTADO EVALUACIONES MBTI</p>
            </div>
            <div className="listado-evaluaciones-mbti">
                <div className='filter-bar'>
                    <div className='filter-selects'>
                        <div href="#" className='filter-desplegable'><span class="material-symbols-outlined">keyboard_arrow_right</span><p className='filter-titulo'>Filtros</p></div>
                        <div className='filter-container'>
                            <div className='filter-sector'>
                                <p className='filter-sector-texto'>Sector</p>
                                {/* <select id="filter-sector-select" onChange={cambiarFiltroSector}> */}
                                <select id="filter-sector-select">
                                    <option disabled selected value id='null'>SELECCIONE</option>
                                    <option value=''>TODAS</option>
                                {
                                    // hayEvaluaciones
                                    // ?
                                    // evaluaciones.sectores.map(sector => (
                                    //     <option value={sector.id}>{sector.descripcion}</option>
                                    // ))
                                    // :<></>
                                }
                                </select>
                            </div>
                            <div className='filter-evaluacion'>
                                <p className='filter-evaluacion-texto'>Evaluacion</p>
                                {/* <select id="filter-evaluacion-select" onChange={cambiarFiltroTipo}> */}
                                <select id="filter-evaluacion-select" >
                                    <option disabled selected value id='null'>SELECCIONE</option>
                                    <option value=''>TODAS</option>
                                    {/* {
                                        hayEvaluaciones
                                        ?
                                        evaluaciones.tipos.map(tipo => (
                                            <option value={tipo.id}>{tipo.descripcion}</option>
                                        ))
                                        :<></>
                                    } */}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='filter-search'>
                        <div href="#" className='filter-search-desplegable'><span class="material-symbols-outlined">keyboard_arrow_right</span><p className='filter-titulo'>Buscador</p></div>
                        <div className='filter-search-container'>
                            {/* <SearchBar buscar={confirmarBusqueda}/> */}
                            <SearchBar/>
                        </div>
                    </div>
                </div>
                <div className='listado-evaluaciones-mbti-container'>

                </div>
            </div>
        </div>
    );
}

export default ListadoEvaluacionesMBTI;