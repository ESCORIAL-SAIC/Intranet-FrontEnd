function RespuestaS(props){

    return(
        <div className="ev-respuesta-s">
                <p className="ev-puntuacion-inicial">{props.value.inicial}</p>
                <p className="ev-puntuacion">{props.value.puntuacion}</p>
        </div>
    );
}

export default RespuestaS;