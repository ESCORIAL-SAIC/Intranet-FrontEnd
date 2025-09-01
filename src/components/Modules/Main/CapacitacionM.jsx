import './CapacitacionM.css';

function CapacitacionM(props){
    return(
        <div className="main-capacitacion">
            <div className="main-capacitacion-fecha">
                <p className="main-capacitacion-dia">{props.value.dia}</p>
                <p className="main-capacitacion-mes">{props.value.mes}</p>
            </div>
            <div className='main-capacitacion-izq'>
                <p className="main-capacitacion-descripcion">{props.value.descripcion}</p>
                    {
                        props.value.lugar != ''
                        ? <div className='main-capacitacion-lugar'><div className='circulo'></div><p className='main-capacitacion-lugar-descripcion'>{props.value.lugar}</p></div>
                        : <></>
                    }                    
            </div>
        </div> 
    );
}

export default CapacitacionM;