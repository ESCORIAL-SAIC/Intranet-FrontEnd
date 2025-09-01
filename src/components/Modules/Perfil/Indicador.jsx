
function Indicador(props){
    return(
        <a className='boton-power' target='_blank' id='boton-power' href={props.value.link}>
            <i className='material-symbols-outlined button-bar-icon boton-power-icono'>{props.value.icono}</i>
            <p className='boton-power-texto'>{props.value.nombre}</p>
        </a>
    );
}

export default Indicador;