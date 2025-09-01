function RespuestaE(props){
    return(
        <div className="ev-cuestionario">
            <div className="ev-empleado">
                <div className="ev-circulo">{props.value.inicial}</div>
                <p className="ev-empleado-n">{props.value.empleado}</p>
            </div>
            <p className="ev-respuesta">{props.value.respuesta}</p>
            {
                props.value.feedback != null
                ? <div className="ev-respuesta-feedback">
                    <p className="ev-respuesta-feedback-titulo">Observaciones: </p>
                    <p className="ev-respuesta-feedback-texto">{props.value.feedback}</p>
                </div>
                :<></>
            }
        </div>
    );
}

export default RespuestaE;