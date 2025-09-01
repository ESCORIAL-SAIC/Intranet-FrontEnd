import { useEffect, useState } from 'react';
import './ListadoTareas.css';
import Tarea from './Tarea';

function ListadoTareas(){
    
    const [tareas, setTareas] = useState([]);  
    const [hayTareas, setHayTareas] = useState(false)

    const getTareas = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(process.env.REACT_APP_BASE_URL+"/tareas-pend-cant",{
            headers: {
                Authorization: token,
            }
        })
        const jsonData = await response.json();
        if(jsonData.length > 0){
          setHayTareas(true)
        }else{
          setHayTareas(false)
        }
        setTareas(jsonData);
      } catch (err) {
        console.log(err.message)
      }
    };
  
    useEffect(() => {
      getTareas();
    }, []);

    return(
    <div className='listado-tareas'>
        <div className='tarea-header'>TAREAS PENDIENTES</div>
        <div className='tarea-content'>
            {
            hayTareas
            ?tareas.map(tarea => (
                <Tarea value={tarea}/>
            ))
            :<p className='texto-no-tarea'>No tienes tareas pendientes</p>
            }
        </div>
    </div>
    );
}

export default ListadoTareas;