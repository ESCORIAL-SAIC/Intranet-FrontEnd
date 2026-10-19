import { EVALUACIONES, ENCUESTA_1MES_URL, ESTADOS_ENCUESTA_1MES } from '../constants';
import { ordenarCronologico, estadoItem, ESTADOS_ITEM, fmtFecha, fmtFechaHora } from '../utils';

// Roadmap cronológico: inducciones (con su evaluación de Forms, si tienen), encuesta de
// satisfacción y encuesta de 1.er mes.
// Vista RRHH: onToggle / onToggleEvaluacion / onToggleEncuesta1Mes marcan y desmarcan cada actividad.
// Vista colaborador: onMarcarEncuesta1Mes le permite indicar que ya respondió la encuesta de 1.er mes.
function RoadmapTimeline({ items, encuestaCompletada, encuestaFecha, encuesta1Mes, onToggle, onToggleEvaluacion,
                           onToggleEncuesta1Mes, onMarcarEncuesta1Mes, deshabilitado }) {
    const ordenados = ordenarCronologico(items);
    const todasCompletas = items.every(i => i.completada);
    const e1m = encuesta1Mes || { estado: 'no_corresponde' };
    const infoE1m = ESTADOS_ENCUESTA_1MES[e1m.estado];

    return (
        <ol className="ri-timeline">
            {ordenados.map((item, index) => {
                const estado = estadoItem(item);
                const info = ESTADOS_ITEM[estado];
                const evaluacion = EVALUACIONES[item.evaluacion_tipo];
                return (
                    <li key={item.id} className={`ri-timeline-item ${info.className}`}>
                        <div className="ri-timeline-marcador">
                            {item.completada
                                ? <i className="material-symbols-outlined">check</i>
                                : index + 1}
                        </div>
                        <div className="ri-timeline-contenido">
                            <div className="ri-timeline-cabecera">
                                <div>
                                    <div className="ri-timeline-titulo">{item.nombre}</div>
                                    <div className="ri-timeline-cuando">
                                        <i className="material-symbols-outlined">event</i>
                                        {item.fecha ? fmtFecha(item.fecha) : 'Fecha a confirmar'}
                                        {item.horario && <> · {item.horario} hs</>}
                                        <> · {item.duracion_min} min</>
                                    </div>
                                </div>
                                <span className={`ri-chip ${info.className}`}>{info.label}</span>
                            </div>

                            <div className="ri-timeline-detalle">
                                {item.ubicacion && <span><i className="material-symbols-outlined">location_on</i>{item.ubicacion}</span>}
                                {item.facilitador && <span><i className="material-symbols-outlined">person</i>{item.facilitador}</span>}
                                {item.material_url && (
                                    <a href={item.material_url} target="_blank" rel="noreferrer">
                                        <i className="material-symbols-outlined">description</i>Material
                                    </a>
                                )}
                            </div>
                            {item.observaciones && <div className="ri-timeline-obs">{item.observaciones}</div>}
                            {item.completada && item.fecha_completada && (
                                <div className="ri-timeline-obs">Completada el {fmtFechaHora(item.fecha_completada)}</div>
                            )}

                            {evaluacion && (
                                <div className={`ri-timeline-evaluacion ${item.evaluacion_completada ? 'realizada' : ''}`}>
                                    <i className="material-symbols-outlined">quiz</i>
                                    <div className="ri-timeline-evaluacion-texto">
                                        <div>
                                            Evaluación: <a href={evaluacion.url} target="_blank" rel="noreferrer">{evaluacion.label}</a>
                                        </div>
                                        {item.evaluacion_completada && item.evaluacion_fecha && (
                                            <div className="ri-timeline-obs">Realizada el {fmtFechaHora(item.evaluacion_fecha)}</div>
                                        )}
                                    </div>
                                    <span className={`ri-chip ${item.evaluacion_completada ? 'item-completada' : 'item-pendiente'}`}>
                                        {item.evaluacion_completada ? 'Realizada' : 'Pendiente'}
                                    </span>
                                </div>
                            )}

                            {(onToggle || (onToggleEvaluacion && evaluacion)) && (
                                <div className="ri-timeline-acciones">
                                    {onToggle && (
                                        <button type="button" className={item.completada ? 'ri-boton' : 'ri-boton-secundario'}
                                                disabled={deshabilitado} onClick={() => onToggle(item)}>
                                            {item.completada ? 'Desmarcar' : 'Marcar como completada'}
                                        </button>
                                    )}
                                    {onToggleEvaluacion && evaluacion && (
                                        <button type="button" className={item.evaluacion_completada ? 'ri-boton' : 'ri-boton-secundario'}
                                                disabled={deshabilitado} onClick={() => onToggleEvaluacion(item)}>
                                            {item.evaluacion_completada ? 'Desmarcar evaluación' : 'Marcar evaluación realizada'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </li>
                );
            })}

            <li className={`ri-timeline-item ${encuestaCompletada ? 'item-completada' : 'item-pendiente'}`}>
                <div className="ri-timeline-marcador">
                    <i className="material-symbols-outlined">{encuestaCompletada ? 'check' : 'flag'}</i>
                </div>
                <div className="ri-timeline-contenido">
                    <div className="ri-timeline-cabecera">
                        <div>
                            <div className="ri-timeline-titulo">Encuesta de satisfacción</div>
                            <div className="ri-timeline-cuando">
                                {encuestaCompletada
                                    ? `Respondida el ${fmtFechaHora(encuestaFecha)}`
                                    : todasCompletas
                                        ? 'Disponible para completar'
                                        : 'Se habilita al completar todas las inducciones'}
                            </div>
                        </div>
                        <span className={`ri-chip ${encuestaCompletada ? 'item-completada' : 'item-pendiente'}`}>
                            {encuestaCompletada ? 'Completada' : 'Pendiente'}
                        </span>
                    </div>
                </div>
            </li>

            <li className={`ri-timeline-item ${e1m.estado === 'completada' ? 'item-completada' : e1m.estado === 'pendiente' ? 'item-hoy' : 'item-pendiente'}`}>
                <div className="ri-timeline-marcador">
                    <i className="material-symbols-outlined">{e1m.estado === 'completada' ? 'check' : 'calendar_month'}</i>
                </div>
                <div className="ri-timeline-contenido">
                    <div className="ri-timeline-cabecera">
                        <div>
                            <div className="ri-timeline-titulo">Encuesta de 1.er mes</div>
                            <div className="ri-timeline-cuando">
                                {e1m.estado === 'completada'
                                    ? `Respondida el ${fmtFechaHora(e1m.fecha)}`
                                    : e1m.disponible_desde
                                        ? `${e1m.estado === 'pendiente' ? 'Disponible desde' : 'Se habilita el'} ${fmtFecha(e1m.disponible_desde)}`
                                        : 'Se habilita a los 30 días del ingreso'}
                            </div>
                        </div>
                        <span className={`ri-chip ${infoE1m.className}`}>{infoE1m.label}</span>
                    </div>

                    {e1m.estado === 'pendiente' && (
                        <div className="ri-timeline-detalle">
                            <a href={ENCUESTA_1MES_URL} target="_blank" rel="noreferrer">
                                <i className="material-symbols-outlined">open_in_new</i>Responder en Forms
                            </a>
                        </div>
                    )}

                    {e1m.estado === 'pendiente' && onMarcarEncuesta1Mes && (
                        <button type="button" className="ri-boton-secundario" disabled={deshabilitado} onClick={onMarcarEncuesta1Mes}>
                            Ya la respondí
                        </button>
                    )}
                    {e1m.estado !== 'no_corresponde' && onToggleEncuesta1Mes && (
                        <button type="button" className={e1m.estado === 'completada' ? 'ri-boton' : 'ri-boton-secundario'}
                                disabled={deshabilitado} onClick={onToggleEncuesta1Mes}>
                            {e1m.estado === 'completada' ? 'Desmarcar' : 'Marcar como respondida'}
                        </button>
                    )}
                </div>
            </li>
        </ol>
    );
}

export default RoadmapTimeline;
