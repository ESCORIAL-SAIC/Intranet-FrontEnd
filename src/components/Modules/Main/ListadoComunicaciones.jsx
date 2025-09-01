import Comunicacion from './Comunicacion';
import './ListadoComunicaciones.css';
import { useEffect, useState } from 'react';
import ComunicacionCarga from './ComunicacionCarga';

function ListadoComunicaciones() {

  const [comunicaciones, setComunicaciones] = useState([]);
  const [loadState, setLoadState] = useState(false);  

  const getComunicaciones = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BASE_URL+"/comunicaciones")
      const jsonData = await response.json();
      setComunicaciones(jsonData);
      setLoadState(true)
    } catch (err) {
      console.log(err.message)
    }
  };

  useEffect(() => {
    getComunicaciones();
    
  }, []);

  return (
    <div className="listado-comunicaciones">
      {
        !loadState
        ?[...Array(2)].map(() => (
          <ComunicacionCarga/> 
          ))
        : null
      }      
      {comunicaciones.map(com => (
        <Comunicacion value={com}/>
      ))}
    </div>
  );
}   

export default ListadoComunicaciones;