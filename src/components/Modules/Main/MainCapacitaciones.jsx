import { useEffect, useState } from "react";
import CapacitacionM from "./CapacitacionM";
import './MainCapacitaciones.css'

function MainCapacitaciones(){

    const [eventos, setEventos] = useState([]);

    const capacitaciones =
        {
            'descripcion': 'NO DISPONIBLE',
            'dia': '00',
            'mes': '---',
            'lugar': 'NO DISPONIBLE'
        }

        const getEventos = async () => {
            try {
              const response = await fetch(process.env.REACT_APP_BASE_URL+"/eventos")
              const jsonData = await response.json();
              setEventos(jsonData);
        
            } catch (err) {
              console.log(err.message)
            }
          };
        
          useEffect(() => {
            getEventos();
          }, []);

    return(
        <div className="main-capacitaciones">
            <p className="main-capacitaciones-cabecera">PROXIMOS EVENTOS</p>
            <div className="main-capacitaciones-container">
                {eventos.map(cap => (
                   <CapacitacionM value={cap}/>
                ))}
            </div>
        </div>
    );
}

export default MainCapacitaciones;