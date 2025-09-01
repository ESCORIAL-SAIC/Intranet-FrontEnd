import './RequerimientoPersonal.css';
import { useEffect, useState  } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function RequerimientoPersonal(){

    let { id } = useParams();
    let navigate = useNavigate()
    const [requerimiento, setRequerimiento] = useState({})
    const [candidatos, setCandidatos] = useState([])
    const [loading, setLoading] = useState(false);

    const buscarCandidatos = async () => {
        try {
            
            if(id == ''){return false}

            setLoading(true);

            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+'/entrevistador-requerimiento',
            {
                method: 'GET',
                headers: { 
                    Authorization: token,
                    'Content-Type': 'application/json',
                    'requerimiento': id,
                },
            }
            );
            const jsonData = await response.json();
            setCandidatos(jsonData[0].candidatos || [])
        } catch (err) {
            console.log(err.message)
        } finally {
            setLoading(false);
        }
    }

    const getRequerimiento = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+"/requerimiento-personal",{
                headers: {
                    Authorization: token,
                    Requerimiento: id
                }
            })
            const jsonData = await response.json();
            console.log(jsonData)
            setRequerimiento(jsonData[0])
            if(jsonData[0].candidatos){
                setCandidatos(jsonData[0].candidatos || []);
            }
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

        getRequerimiento();
      }, []);

    return(
        <div className="container">
        <div className="seccion">
            <i className="material-symbols-outlined seccion-icon">group_add</i>
            <p className="seccion-titulo">{requerimiento.tipo}</p>
        </div>
        <div className="requerimiento-personal">
            
            <div className="requerimiento-info">
                <div className="requerimiento-info-top">
                    <div className="requerimiento-info-nombre">{requerimiento.tipo}</div>
                    <div className="requerimiento-info-numero">{requerimiento.numero}</div>
                </div>
                <div className="requerimiento-info-center">
                    <div className="requerimiento-info-puesto"><p>Puesto:</p><p>{requerimiento.puesto}</p></div>
                    <div className="requerimiento-info-fecha"><p>Fecha:</p><p>{requerimiento.fecha}</p></div>
                    <div className="requerimiento-info-gerencia"><p>Gerencia:</p><p>{requerimiento.gerencia}</p></div>
                    <div className="requerimiento-info-sector"><p>Sector:</p><p>{requerimiento.sector}</p></div>
                </div>
                <div className="requerimiento-info-bottom">
                    <div className="requerimiento-info-estado">{requerimiento.estado}</div>
                </div>
            </div>
            <div className="requerimiento-colaboradores">
                <div className="requerimiento-buscar">
                    <div className="buscar-text">
                        {
                            !candidatos?.length > 0
                            ? "Buscar Colaboradores recomendados para la entrevista:"
                            : "Colaboradores recomendados para la entrevista:"
                        }

                    </div>
                    {
                        !candidatos?.length > 0
                        ? (
                            loading
                            ? <div className="buscar-loading">Cargando...</div> 
                            : <a className="buscar-button" href='#' onClick={buscarCandidatos}>
                                Buscar
                            </a>
                        )
                        : <></>
                    }
                    
                </div>
                <div className="requerimiento-listado-colaboradores">
                    {
                    candidatos
                    ?
                    candidatos.map(candidato => (
                        <div className='requerimiento-colaborador-recomendado'>
                            <div className='requerimiento-colaborador-img'></div>
                            <div className='requerimiento-colaborador-info'>
                                <div className='requerimiento-colaborador-titulo'>Colaborador:</div>
                                <div className='requerimiento-colaborador-nombre'>{candidato.empleado}</div>
                                <div className='requerimiento-colaborador-puesto'>{candidato.legajo}</div>
                            </div>
                            <div className='requerimiento-colaborador-sector'>
                                {candidato.sector}
                            </div>
                        </div>
                    ))
                    :<></>
                    }
                </div>
            </div>
        </div>
        </div>
    );

}

export default RequerimientoPersonal;