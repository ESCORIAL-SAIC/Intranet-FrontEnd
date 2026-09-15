import PlanCapacitacionItem from "./PlanCapacitacionItem";

function EmpleadoPlanCapacitacion({propuesta}) {

    if (!propuesta || Object.keys(propuesta).length === 0) {
        return <div>No hay datos del plan de capacitación</div>;
    }

    const {
        resumen_ejecutivo,
        plan_capacitacion,
        recomendaciones_finales
    } = propuesta;

    return (
        <div className="empleado-plan-capacitacion">
            <div>
                <PlanCapacitacionItem titulo={"Resumen Ejecutivo"} contenido={propuesta.resumen_ejecutivo}/>
                <PlanCapacitacionItem titulo={"Plan"} contenido={propuesta.recomendaciones_finales}>
                    {
                        propuesta.plan_capacitacion?.map((item, index) => (
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
                                    <a href={item.link_capacitacion_sugerida ?? ''} className="propuesta-capacitacion-texto">{item.link_capacitacion_sugerida ?? ''}</a>
                                </div>
                            </div>
                        ))
                    }
                </PlanCapacitacionItem>
                <PlanCapacitacionItem titulo={"Recomendaciones Finales"} contenido={propuesta.recomendaciones_finales}/>
            </div>
        </div>
    );
}

export default EmpleadoPlanCapacitacion;