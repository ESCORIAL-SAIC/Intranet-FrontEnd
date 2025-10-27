import PlanCapacitacionItem from "./PlanCapacitacionItem";

function EmpleadoPlanCapacitacion(props) {
    // Accept both shapes: either props.propuesta is the payload
    // or props.propuesta.propuesta (some endpoints wrap the object)
    const data = props.propuesta?.propuesta ?? props.propuesta ?? {};

    // Defensive: if no data yet, don't read properties from undefined
    if (!data || Object.keys(data).length === 0) {
        return (
            <div className="empleado-plan-capacitacion">
                <div>No hay datos del plan de capacitación</div>
            </div>
        );
    }

    return (
        <div className="empleado-plan-capacitacion">
            <div>
                <PlanCapacitacionItem titulo={"Resumen Ejecutivo"} contenido={data.resumen_ejecutivo}/>
                <PlanCapacitacionItem titulo={"Plan"} contenido={data.recomendaciones_finales}>
                    {
                        data.plan_capacitacion?.map((item, index) => (
                            <div key={index} style={{marginBottom: '10px'}} className="propuesta">
                                <div className="propuesta-capacitacion-t">
                                    <div className="propuesta-capacitacion-titulo">Area mejora: </div>
                                    <div className="propuesta-capacitacion-texto">{item.area_mejora}</div>
                                </div>
                                <div className="">
                                    <div className="propuesta-capacitacion-subtitulo">Brecha identificada: </div>
                                    <div className="propuesta-capacitacion-texto">{item.brecha_identificada}</div>
                                </div>
                                <div className="">
                                    <div className="propuesta-capacitacion-subtitulo">Objetivo capacitacion: </div>
                                    <div className="propuesta-capacitacion-texto">{item.objetivo_capacitacion}</div>
                                </div>
                                <div>
                                    <div className="propuesta-capacitacion-subtitulo">Acciones recomendadas: </div>
                                    <div className="propuesta-capacitacion-texto">
                                    {
                                        item.acciones_recomendadas?.map((accion, i) => (
                                            <div key={i}>- {accion}</div>
                                        ))
                                    }
                                    </div>
                                </div>
                                <div className="">
                                    <div className="propuesta-capacitacion-subtitulo">Curso sugerido: </div>
                                    <div className="propuesta-capacitacion-texto">{item.capacitacion_sugerida ?? ''}</div>
                                </div>
                            </div>
                        ))
                    }
                </PlanCapacitacionItem>
                <PlanCapacitacionItem titulo={"Recomendaciones Finales"} contenido={data.recomendaciones_finales}/>
            </div>
        </div>
    );
}

export default EmpleadoPlanCapacitacion;