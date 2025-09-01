import { useEffect, useState } from 'react';
import Capacitacion from './Capacitacion';
import './ListadoCapacitaciones.css';

function ListadoCapacitaciones(){

    const [capacitaciones, setCapacitaciones] = useState([])
    const [hayCapacitaciones, setHayCapacitaciones] = useState(false)

    const getCapacitaciones = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_BASE_URL+"/capacitaciones",{
                headers: {
                    Authorization: token,
                }
            })
            const jsonData = await response.json();
            if(jsonData.length > 0){
                setHayCapacitaciones(true)
            }else{
                setHayCapacitaciones(false)
            }
            setCapacitaciones(jsonData);
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getCapacitaciones();
    },[])

    return(
        <div className='cap-container'>
            <div className='cap-header'>CAPACITACIONES</div>
            <div className='cap-content'>
            {   hayCapacitaciones
                ?capacitaciones.map(cap => (
                    <Capacitacion value={cap}/>
                ))
                :<p className='texto-no-cap'>No tienes capacitaciones cargadas</p>
            }    
            </div>
        </div>
    );
}

export default ListadoCapacitaciones;