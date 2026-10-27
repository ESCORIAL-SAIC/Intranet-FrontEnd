function EncuestaTarjeta(props) {
    return (
        <a className="encuesta-tarjeta" id='encuesta-tarjeta' href={'/encuesta-empleado/'+props.encuesta.id}>
            <div className="evaluacion-icono"><i className="material-symbols-outlined">description</i></div>
            <div className="encuesta-tarjeta-data">
                <p className="encuesta-tarjeta-titulo">Encuesta Capacitación: {(props.encuesta.fecha_respuesta.substring(0,10))}</p>
            </div>
        </a>
    );
} 

export default EncuestaTarjeta;