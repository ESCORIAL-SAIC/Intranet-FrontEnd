import './Capacitacion.css';

function Capacitacion(props){

    let insignia = false

    if(props.value.estado == "Finalizada"){
        insignia = true
    }

    return(
        <div className='capacitacion'>
            <div className='capacitacion-top'>
                <p className='capacitacion-nombre'>{props.value.nombre}</p>
                
            </div>
            <div className='capacitacion-bot'>
                {
                    insignia
                    ?<i className="material-symbols-outlined capacitacion-insignia">editor_choice</i>
                    :<p className='capacitacion-puesto'>{props.value.estado}</p>
                }
                <p className='capacitacion-fecha'>{props.value.fecha}</p>
            </div>
        </div>
    );
}

export default Capacitacion;