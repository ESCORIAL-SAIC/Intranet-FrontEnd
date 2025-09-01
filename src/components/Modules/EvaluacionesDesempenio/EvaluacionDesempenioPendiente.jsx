function EvaluacionDesempenioPendiente(){

    return(
        <a className="evaluacion-desempenio-pendiente" href='/perfil'>
                        <div className="evaluacion-pendiente-icono"><i className="material-symbols-outlined ">edit</i></div>
                        <div className="evaluacion-desempenio-pendiente-data">
                            <p className="evaluacion-desempenio-pendiente-titulo">Completar Evaluaciones Pendientes<br/></p>
                            <i className="material-symbols-outlined">chevron_right</i>
                        </div>
        </a>
    );
}

export default EvaluacionDesempenioPendiente;