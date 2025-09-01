import './RequerimientoPersonal.css';
import { useEffect, useState  } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function ListadoRequerimientoPersonal(){
    
    let navigate = useNavigate()
    const [requerimientos, setRequerimientos] = useState([])

    const getRequerimientos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+'/requerimiento-personal',{
                headers: {
                    Authorization: token,
                }
            })
            const jsonData = await response.json();
            setRequerimientos(jsonData); 
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

        getRequerimientos();
    }, []);

    return(
        <div className="container">
            <div className="seccion">
                <i className="material-symbols-outlined seccion-icon">group</i>
                <p className="seccion-titulo">LISTADO REQUERIMIENTOS/REPOCICIONES DE PERSONAL</p>
            </div>
            <div className='listado-requerimiento-personal'>
                {
                    requerimientos.map(requerimiento => (
                        <a className='item-requerimiento-personal' href={'/requerimiento-personal/'+requerimiento.id}>
                            <div className='item-requerimiento-personal-icon'>
                                <i className="material-symbols-outlined">group</i>
                            </div>
                            <div className='item-requerimiento-personal-info'>
                                <div className='item-requerimiento-personal-titulo'>
                                    <div className='item-requerimiento-personal-nombre'>{requerimiento.tipo}</div>
                                    <div className='item-requerimiento-personal-numero'>{requerimiento.numero}</div>
                                </div>
                                <div className='item-requerimiento-personal-puesto'>Puesto vacante: {requerimiento.puesto}</div>
                                <div className='item-requerimiento-personal-sector'>Sector: {requerimiento.sector}</div>
                                <div className='item-requerimiento-personal-fecha'>{requerimiento.fecha}</div>
                            </div>
                        </a>
                    ))
                }
            </div>
        </div>
    );
}

export default ListadoRequerimientoPersonal;