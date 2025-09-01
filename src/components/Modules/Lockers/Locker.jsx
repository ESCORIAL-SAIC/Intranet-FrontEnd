import './Locker.css';
import { useState } from "react";

function Locker(props){

    const [display, setDisplay] = useState('none')

    function showInfo() {
        setDisplay('flex')
    }

    function hideInfo() {
        setDisplay('none')
    }

    return(
    <div className="locker">
        <div className="locker-info" id='locker-info' style={{'display': display}}>
            <div className='locker-planta'>
                <p className='locker-planta-titulo'>PLANTA</p>
                <p className="locker-planta-texto">{props.value.planta}</p>
            </div>
            <div id='locker-det' style={{'display': 'none'}}>
                <p id='locker-empleado'>{props.value.descripcion}</p>
                <p id='locker-legajo'>{props.value.legajo}</p>
                <p id='locker-estado'>{
                (props.value.descripcion != null && props.value.activestatus == 0)
                ? "NO DISPONIBLE"
                : (props.value.descripcion == null && props.value.activestatus == 0) ? "DISPONIBLE"
                : "FUERA DE SERVICIO"
                }</p>
            </div>
            <div className='locker-linea'></div>
            <div className='locker-codigo'>
                <p className='locker-codigo-titulo'>LOCKER</p>
                <p className="locker-codigo-texto">{props.value.codigo}</p>
            </div>
        </div>
        <div className={
            (props.value.descripcion != null && props.value.activestatus == 0)
            ? "locker-casilla ocupada"
            : (props.value.descripcion == null && props.value.activestatus == 0) ? "locker-casilla"
            : "locker-casilla no-disponible"
        }
        onMouseEnter={showInfo} onMouseLeave={hideInfo}>
        </div>    
    </div>
    );
}

export default Locker;