import { ordenarCronologico, estadoItem, ESTADOS_ITEM, fmtFecha, fmtFechaHora } from '../utils';

// Roadmap cronológico de inducciones + encuesta final. Si se pasa onToggle (vista RRHH),
// cada inducción puede marcarse/desmarcarse como completada.
function RoadmapTimeline({ items, encuestaCompletada, encuestaFecha, onToggle, deshabilitado }) {
    const ordenados = ordenarCronologico(items);
    const todasCompletas = items.every(i => i.completada);

    return (
        <ol className="ri-timeline">
            {ordenados.map((item, index) => {
                const estado = estadoItem(item);
                const info = ESTADOS_ITEM[estado];
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
                                {item.requiere_evaluacion && (
                                    item.evaluacion_url
                                        ? <a href={item.evaluacion_url} target="_blank" rel="noreferrer"><i className="material-symbols-outlined">quiz</i>Evaluación (Forms)</a>
                                        : <span><i className="material-symbols-outlined">quiz</i>Requiere evaluación</span>
                                )}
                            </div>
                            {item.observaciones && <div className="ri-timeline-obs">{item.observaciones}</div>}
                            {item.completada && item.fecha_completada && (
                                <div className="ri-timeline-obs">Completada el {fmtFechaHora(item.fecha_completada)}</div>
                            )}

                            {onToggle && (
                                <button
                                    type="button"
                                    className={item.completada ? 'ri-boton' : 'ri-boton-secundario'}
                                    disabled={deshabilitado}
                                    onClick={() => onToggle(item)}
                                >
                                    {item.completada ? 'Desmarcar' : 'Marcar como completada'}
                                </button>
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
        </ol>
    );
}

export default RoadmapTimeline;
