import { useEffect, useState } from 'react';
import './Indicadores.css';
import Indicador from './Indicador';

function ListadoIndicadores(){

    const [indicadores, setIndicadores] = useState([])

    const getIndicadores = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+"/powerbi-accesos",{
                headers: {
                    Authorization: token,
                }
            })
            const jsonData = await response.json();
            setIndicadores(jsonData);
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getIndicadores();
    }, [])

    return(
        <div className="listado-indicadores">
            <p className="titulo-acceso-indicadores">Accesos Powerbi</p>
            <div className='indicadores'>
                {
                    indicadores.map(indicador => (
                        <Indicador value={indicador}/>
                    ))
                }
            </div>
        </div>
    );
}

export default ListadoIndicadores;