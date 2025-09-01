import './Cuestionario.css';

function Cuestionario(props){
    
    let autoEval = (props.value.evaluador == props.value.usuario_evaluar)

    return(
        <a className="cuestionario" href={"/evaluacion-desempenio/" + props.value.cuestionario_id + "/" + props.value.usuario_evaluar}>
            <div className={autoEval?"semaforo-circulo s-repper":"semaforo-circulo s-cu"}></div>
            <p className="cuestionario-tipo">{"Evaluación de Desempeño: " + props.value.tipo}</p>
            <p className="cuestionario-tipo">Empleado a Evaluar: <b>{props.value.empleado_evaluar}</b></p>
            <p className='cuestionario-fecha'>{props.value.fechadesde.substring(0, 10) + " - " + props.value.fechahasta.substring(0, 10)}</p>
            <a className="acceder-cuestionario"><span className="material-symbols-outlined flecha-cuestionario">chevron_right</span></a>
        </a>
    );
}

export default Cuestionario;