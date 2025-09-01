function EvaluacionDesempenio(props){

    let texto = ''

    if(props.value.encuesta == "CAPACITACIONES"){
        texto = 'Capacitacion Realizada: '
        // this.style.backgroundColor = "#fac73c"
    }else if(props.value.encuesta == "DESEMPEÑO"){
        texto = 'Empleado evaluado: '
    }

    return(
        <a className="evaluacion-desempenio" id='evaluacion-desempenio' href={'/respuestas-evaluacion-desempenio/'+props.value.id}>
            <div className="evaluacion-icono"><i className="material-symbols-outlined">description</i></div>
            <div className="evaluacion-desempenio-data">
                <p className="evaluacion-desempenio-titulo">Evaluacion:<br/> {props.value.encuesta}</p>
                <p className="evaluacion-desempenio-usuario">{"Completada por: " + props.value.usuario}</p>
                <p className="evaluacion-desempenio-usuario">{texto + " " + props.value.empleado_evaluar}</p>
            </div>
            <div className="evaluacion-desempenio-data-2">
                <p className="evaluacion-desempenio-fecha">{new Date(props.value.fecha_carga.substring(0, 10)).toLocaleDateString('es-ES', {timeZone: 'UTC'})}</p>
                <div className="evaluacion-usuarios">
                    
                </div>
            </div>
        </a>
    );
}

export default EvaluacionDesempenio;