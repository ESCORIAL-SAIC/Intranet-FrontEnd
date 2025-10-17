import EvaluacionDesempenio from "../EvaluacionesDesempenio/EvaluacionDesempenio";

function EmpleadoDesempenio(props) {
    return (
        <div className="empleado-desempenio">
            {
            props.evaluaciones?.registros?.map(evaluacion => (
                <EvaluacionDesempenio value={evaluacion}/>
            ))
            }
        </div>
    );
}

export default EmpleadoDesempenio;