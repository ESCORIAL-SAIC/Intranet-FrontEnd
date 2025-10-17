import PlanCapacitacionItem from "./PlanCapacitacionItem";

function EmpleadoPlanCapacitacion(props) {
    return (
        <div className="empleado-plan-capacitacion">
            <div>
                <PlanCapacitacionItem titulo={"Resumen Ejecutivo"} contenido={props.propuesta.resumen_ejecutivo}/>
                <PlanCapacitacionItem titulo={"Plan"} contenido={props.propuesta.recomendaciones_finales}>
                    {
                            props.propuesta.plan_capacitacion?.map((item, index) => (
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
                                        item.acciones_recomendadas?.map((accion) => (
                                            <div>- {accion}</div>
                                        ))
                                        }
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="propuesta-capacitacion-subtitulo">Plazo sugerido: </div>
                                        <div className="propuesta-capacitacion-texto">{item.plazo_sugerido}</div>
                                    </div>
                                </div>
                            ))
                    }
                </PlanCapacitacionItem>
                <PlanCapacitacionItem titulo={"Recomendaciones Finales"} contenido={props.propuesta.recomendaciones_finales}/>
            </div>
        </div>
    );
}

export default EmpleadoPlanCapacitacion;